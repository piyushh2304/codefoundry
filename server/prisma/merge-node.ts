import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const languages = await prisma.language.findMany({
        where: {
            OR: [
                { name: { contains: 'Node', mode: 'insensitive' } },
                { slug: { contains: 'node', mode: 'insensitive' } }
            ]
        }
    });

    console.log('Found languages:', languages.map(l => ({ name: l.name, slug: l.slug, id: l.id })));

    if (languages.length < 2) {
        console.log('Only one or zero Node languages found. Nothing to merge.');
        return;
    }

    // Define the target (the one we want to keep)
    // Let's prefer 'Node.js' with slug 'nodejs'
    const target = languages.find(l => l.slug === 'nodejs') || languages[0];
    const others = languages.filter(l => l.id !== target.id);

    console.log(`Target language: ${target.name} (${target.slug})`);

    for (const other of others) {
        console.log(`Merging ${other.name} (${other.slug}) into ${target.name}...`);

        // Move categories
        const categories = await prisma.category.findMany({
            where: { languageId: other.id }
        });

        for (const cat of categories) {
            // Check if a category with same slug exists in target
            const existingCat = await prisma.category.findFirst({
                where: {
                    languageId: target.id,
                    slug: cat.slug
                }
            });

            if (existingCat) {
                console.log(`  Category ${cat.slug} already exists in target. Moving snippets...`);
                // Move snippets to existing category
                await prisma.snippet.updateMany({
                    where: { categoryId: cat.id },
                    data: { categoryId: existingCat.id }
                });
                // Delete the redundant category
                await prisma.category.delete({ where: { id: cat.id } });
            } else {
                console.log(`  Moving category ${cat.slug} to target...`);
                // Update category to point to target language
                await prisma.category.update({
                    where: { id: cat.id },
                    data: { languageId: target.id }
                });
            }
        }

        // Delete the other language
        await prisma.language.delete({
            where: { id: other.id }
        });
        console.log(`  Deleted ${other.name}.`);
    }

    console.log('✅ Merge complete!');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
