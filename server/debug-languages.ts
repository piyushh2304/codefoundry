import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const languages = await prisma.language.findMany();
    console.log('--- LANGUAGES ---');
    console.log(JSON.stringify(languages, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
