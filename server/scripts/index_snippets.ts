import { PrismaClient } from '@prisma/client';
import { getEmbeddings } from '../src/lib/gemini.js';

const prisma = new PrismaClient();

async function indexExistingSnippets() {
    console.log('--- Starting Bulk Indexing ---');

    // Find snippets that don't have embeddings yet
    const snippets = await prisma.snippet.findMany({
        where: {
            isAiGenerated: true // Start with AI ones, or remove to index all
        }
    });

    console.log(`Found ${snippets.length} snippets to index.`);

    for (const snippet of snippets) {
        try {
            console.log(`Indexing: ${snippet.title}...`);
            const embeddingText = `${snippet.title} ${snippet.description || ''}`;
            const embedding = await getEmbeddings(embeddingText);
            console.log(`Embedding length: ${embedding.length}`);
            const vectorString = `[${embedding.join(',')}]`;

            await prisma.$executeRawUnsafe(
                `UPDATE "Snippet" SET embedding = cast($1 as public.vector) WHERE id = $2`,
                vectorString,
                snippet.id
            );
        } catch (error: any) {
            console.error(`Failed to index snippet ${snippet.id}:`, error.message, error.code, error.meta);
        }
    }

    console.log('--- Indexing Complete ---');
    await prisma.$disconnect();
}

indexExistingSnippets();
