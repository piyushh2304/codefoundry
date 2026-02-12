import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const res = await prisma.$queryRaw`SELECT extname FROM pg_extension WHERE extname = 'vector'`;
        console.log('Vector extension:', res);

        // Also check if the column exists
        const columnRes = await prisma.$queryRaw`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Snippet' AND column_name = 'embedding'
        `;
        console.log('Embedding column:', columnRes);
    } catch (e: any) {
        console.log('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
