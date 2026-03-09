import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { model, SYSTEM_PROMPT, getEmbeddings } from '../lib/gemini.js';

export const askAI = async (req: Request, res: Response) => {
    const { prompt, userId } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        // --- 0. AI Usage & Pro Check ---
        const user = await prisma.user.findUnique({
            where: { id: (req as any).user?.id || userId }
        });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Allow only 3 usages for FREE users
        if (user.plan === 'FREE' && (user as any).aiUsageCount >= 3) {
            return res.status(403).json({
                message: "You've reached your free AI limit. Please upgrade to Pro for unlimited access.",
                code: "PRO_REQUIRED"
            });
        }
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

        // --- 4. Generation & Streaming (SSE) ---
        const chatSession = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "Understood. I will provide a technical solution grounded in the provided context." }] },
                ...formattedHistory
            ]
        });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Start by sending metadata (confidence, sources)
        res.write(`data: ${JSON.stringify({ type: 'metadata', confidence: confidenceScore, sources: sources })}\n\n`);

        const initialResult = await chatSession.sendMessageStream(`Query: ${prompt}\n\nContext:\n${contextString}`);

        let fullContent = "";
        for await (const chunk of initialResult.stream) {
            const chunkText = chunk.text() || "";
            if (chunkText) {
                fullContent += chunkText;
                res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunkText })}\n\n`);
            }
        }

        // Signal stream completion
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end(); // close stream

        // --- 5. Background Processing ---
        // Increment usage count for FREE users
        if (user.plan === 'FREE') {
            await prisma.user.update({
                where: { id: userId },
                data: { aiUsageCount: { increment: 1 } }
            }).catch(() => { });
        }

        // Persist history 
        if (userId) {
            await (prisma as any).chatMessage.createMany({
                data: [{ content: prompt, role: 'user', userId }, { content: fullContent, role: 'assistant', userId }]
            }).catch(() => { });
        }

        // Background extraction of snippet details (for library)
        (async () => {
            try {
                const extractionPrompt = `Extract from this professional markdown response the necessary structured info. Please respond ONLY with valid JSON.
Fields required: "title" (short descriptive title), "explanation" (brief overview), "language" (primary language slug), "steps" (Array of { title, description, code }).

Response to extract:
${fullContent}`;
                const extractionResult = await model.generateContent(extractionPrompt);
                const cleanJson = extractionResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                const aiData = JSON.parse(cleanJson);
                
                await prisma.snippet.create({
                    data: {
                        title: aiData.title,
                        description: aiData.explanation,
                        feature: aiData.language,
                        userId: userId || null,
                        isAiGenerated: true,
                        steps: {
                            create: (aiData.steps || []).map((s: any, i: number) => ({ title: s.title, description: s.description, code: s.code, order: i }))
                        }
                    } as any
                });
            } catch (e) {
                console.error("Failed to extract background snippet:", e);
            }
        })();

    } catch (error: any) {
        console.error('AI Error:', error);
        res.status(500).json({ message: error.message || 'Error' });
    }
};
