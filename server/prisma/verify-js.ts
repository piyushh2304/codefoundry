import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const js = await prisma.language.findUnique({
        where: { slug: 'javascript' },
        include: {
            categories: {
                include: {
                    snippets: true
                }
            }
        }
    });

    if (!js) {
        console.log('JavaScript language not found.');
        return;
    }

    console.log(`Language: ${js.name}`);
    for (const cat of js.categories) {
        console.log(`  Category: ${cat.name} (${cat.snippets.length} snippets)`);
        for (const snippet of cat.snippets) {
            console.log(`    - ${snippet.title}`);
        }
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
