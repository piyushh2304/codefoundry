import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Fixing SnippetStep embeddings...');
        await prisma.$executeRawUnsafe('ALTER TABLE "SnippetStep" DROP COLUMN IF EXISTS embedding');
        await prisma.$executeRawUnsafe('ALTER TABLE "SnippetStep" ADD COLUMN embedding vector(3072)');
        console.log('Successfully updated SnippetStep column to 3072!');
    } catch (e: any) {
        console.log('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
