import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Dropping column...');
        await prisma.$executeRawUnsafe('ALTER TABLE "Snippet" DROP COLUMN IF EXISTS embedding');
        console.log('Adding column with 3072 dimensions...');
        await prisma.$executeRawUnsafe('ALTER TABLE "Snippet" ADD COLUMN embedding vector(3072)');
        console.log('Successfully updated column to 3072!');
    } catch (e: any) {
        console.log('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
