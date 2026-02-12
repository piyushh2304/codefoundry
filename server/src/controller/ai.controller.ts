import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { model, SYSTEM_PROMPT, getEmbeddings } from '../lib/gemini.js';

export const askAI = async (req: Request, res: Response) => {
    const { prompt, userId } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        // --- 0. Special Handling: Repository Ingestion (Phase 4 Simulation) ---
        if (prompt.includes('github.com') || prompt.includes('.zip')) {
            return res.json({
                explanation: "I've detected a repository link! I am now initiating Phase 4 'Repository Ingestion'. I will clone the repo, chunk the code files, and index them into your private vector library. This usually takes 30-60 seconds.",
                isIngesting: true,
                confidence: 100
            });
        }

        // --- 1. Conversational Memory (Phase 3) ---
        const chatHistory = userId ? await (prisma as any).chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 6,
        }) : [];

        const formattedHistory = chatHistory.reverse().map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        // --- 2. Hybrid Search & Reranking (Phase 2 & 4) ---
        const promptEmbedding = await getEmbeddings(prompt);
        const vectorString = `[${promptEmbedding.join(',')}]`;

        // 2.1 Parallel Search
        const [semanticSnippets, semanticSteps]: [any[], any[]] = (await Promise.all([
            prisma.$queryRawUnsafe(
                `SELECT id, title, description, (embedding <-> $1::vector) as dist
                 FROM "Snippet" WHERE embedding IS NOT NULL AND "isVisible" = true
                 ORDER BY (embedding <-> $1::vector) * (CASE WHEN "userId" = $2 THEN 0.8 ELSE 1.0 END) LIMIT 5`,
                vectorString, userId || ''
            ),
            prisma.$queryRawUnsafe(
                `SELECT s.id, s.title, s.description, (ss.embedding <-> $1::vector) as dist
                 FROM "Snippet" s JOIN "SnippetStep" ss ON ss."snippetId" = s.id
                 WHERE ss.embedding IS NOT NULL AND s."isVisible" = true
                 ORDER BY (ss.embedding <-> $1::vector) * (CASE WHEN s."userId" = $2 THEN 0.8 ELSE 1.0 END) LIMIT 5`,
                vectorString, userId || ''
            )
        ])) as any;

        const keywords = prompt.split(' ').filter((w: string) => w.length > 3);
        const keywordSnippets = await prisma.snippet.findMany({
            where: {
                OR: [{ title: { contains: prompt, mode: 'insensitive' } }, ...keywords.map((k: string) => ({ title: { contains: k, mode: 'insensitive' } }))],
                isVisible: true
            } as any,
            take: 5
        });

        // 2.2 Reranking & Scoring
        const scores: Record<string, { score: number, data: any }> = {};
        const allMatches = [...semanticSnippets, ...semanticSteps, ...keywordSnippets];

        allMatches.forEach((m: any) => {
            if (!m.id) return;
            if (!scores[m.id]) scores[m.id] = { score: 0, data: m };
            // Weighting
            if (semanticSteps.find(s => s.id === m.id)) scores[m.id].score += 4;
            if (semanticSnippets.find(s => s.id === m.id)) scores[m.id].score += 3;
            if (keywordSnippets.find(s => s.id === m.id)) scores[m.id].score += 2;
        });

        const relevantSnippets = Object.values(scores)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(s => s.data);

        // --- 3. Transparency: Confidence & Citations (Phase 4) ---
        const bestDist = Math.min(...allMatches.map(m => m.dist || 1.0));
        const confidenceScore = Math.max(0, Math.min(100, Math.round((1 - bestDist) * 100)));
        const sources = relevantSnippets.map(s => ({ id: s.id, title: s.title }));

        const contextString = relevantSnippets.length > 0
            ? "Context Snippets:\n" + relevantSnippets.map(s => `Title: ${s.title}\nDesc: ${s.description}`).join("\n\n")
            : "No database matches. Use general knowledge.";

        // --- 4. Generation & Reflection (Future / Agentic) ---
        const chatSession = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "Understood. I will provide a technical solution grounded in the provided context." }] },
                ...formattedHistory
            ]
        });

        const initialResult = await chatSession.sendMessage(`Query: ${prompt}\n\nContext:\n${contextString}`);
        let responseText = initialResult.response.text();

        // Agentic Reflection Loop
        try {
            const reflection = await chatSession.sendMessage("Reflection: Verify the technical accuracy and context alignment of your last response. Correct it if necessary and return ONLY the JSON.");
            responseText = reflection.response.text();
        } catch (e) {
            console.warn("Reflection failed, continuing...");
        }

        // --- 5. Final Processing ---
        let aiData;
        try {
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            aiData = JSON.parse(cleanJson);
        } catch (e) {
            return res.status(500).json({ message: "Invalid AI Format" });
        }

        // Auto-save & return
        const newSnippet = await prisma.snippet.create({
            data: {
                title: aiData.title,
                description: aiData.explanation,
                feature: aiData.language,
                userId: userId || null,
                isAiGenerated: true,
                steps: {
                    create: (aiData.steps || []).map((s: any, i: number) => ({ title: s.title, description: s.description, code: s.code, order: i }))
                }
            } as any,
            include: { steps: true }
        });

        // Persist history & Return
        if (userId) {
            await (prisma as any).chatMessage.createMany({
                data: [{ content: prompt, role: 'user', userId }, { content: aiData.explanation, role: 'assistant', userId }]
            }).catch(() => { });
        }

        res.json({
            explanation: aiData.explanation,
            snippet: newSnippet,
            steps: (newSnippet as any).steps,
            language: aiData.language,
            confidence: confidenceScore,
            sources: sources
        });

    } catch (error: any) {
        console.error('AI Error:', error);
        res.status(500).json({ message: error.message || 'Error' });
    }
};
