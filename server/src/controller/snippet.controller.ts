import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { getEmbeddings } from '../lib/gemini.js';

const storeEmbedding = async (snippetId: string, title: string, description?: string, steps?: any[]) => {
    try {
        // 1. Index the main snippet
        const mainText = `${title} ${description || ''}`;
        const mainEmbedding = await getEmbeddings(mainText);
        const mainVector = `[${mainEmbedding.join(',')}]`;
        await prisma.$executeRawUnsafe(
            `UPDATE "Snippet" SET embedding = $1::vector WHERE id = $2`,
            mainVector,
            snippetId
        );

        // 2. Index individual steps (Document Chunking - Phase 2)
        if (steps && steps.length > 0) {
            for (const step of steps) {
                if (step.id) {
                    const stepText = `${step.title || ''} ${step.description || ''}`;
                    const stepEmbedding = await getEmbeddings(stepText);
                    const stepVector = `[${stepEmbedding.join(',')}]`;
                    await prisma.$executeRawUnsafe(
                        `UPDATE "SnippetStep" SET embedding = $1::vector WHERE id = $2`,
                        stepVector,
                        step.id
                    );
                }
            }
        }
        console.log(`Successfully stored vector embeddings for snippet: ${snippetId} and its steps.`);
    } catch (error) {
        console.error('Error in granular indexing:', error);
    }
};

export const getLanguages = async (req: Request, res: Response) => {
    try {
        const languages = await prisma.language.findMany();
        res.json(languages);
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSnippetById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const snippet = await prisma.snippet.findUnique({
            where: { id },
            include: {
                category: {
                    include: { language: true }
                },
                steps: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        if (!snippet) {
            return res.status(404).json({ message: 'Snippet not found' });
        }
        res.json(snippet);
    } catch (error) {
        console.error('Error fetching snippet by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSnippetsByLanguage = async (req: Request, res: Response) => {
    const langSlug = req.params.langSlug as string;
    try {
        const language = await prisma.language.findUnique({
            where: { slug: langSlug },
            include: {
                categories: {
                    include: {
                        snippets: {
                            where: { isVisible: true } as any,
                            include: {
                                steps: {
                                    orderBy: { order: 'asc' },
                                },
                            },
                            orderBy: { createdAt: 'desc' } as any,
                        },
                    },
                },
            },
        });

        if (!language) {
            return res.status(404).json({ message: 'Language not found' });
        }

        res.json(language);
    } catch (error) {
        console.error('Error fetching snippets by language:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    const langId = req.query.langId as string;
    try {
        const categories = await prisma.category.findMany({
            where: langId ? { languageId: langId } : {},
            orderBy: { name: 'asc' },
        });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createSnippet = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }
        const { title, description, categoryId, code, steps, feature, userId } = req.body;
        const createData: any = {
            title,
            description,
            categoryId,
            code,
            feature,
            userId: userId || null,
            steps: steps && steps.length > 0 ? {
                create: steps.map((s: any) => ({
                    title: s.title,
                    description: s.description,
                    code: s.code,
                    order: s.order
                }))
            } : undefined
        };
        const snippet = await prisma.snippet.create({
            data: createData,
            include: { steps: true }
        });

        // Trigger indexing (Phase 2 - Granular)
        storeEmbedding(snippet.id, title, description, snippet.steps);

        res.status(201).json(snippet);
    } catch (error: any) {
        console.error('Error creating snippet:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

export const updateSnippet = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, description, categoryId, code, steps, feature } = req.body;
    try {
        // Delete existing steps first if new ones are provided
        if (steps) {
            await prisma.snippetStep.deleteMany({ where: { snippetId: id } });
        }

        const updateData: any = {
            title,
            description,
            categoryId,
            code,
            feature,
            steps: steps && steps.length > 0 ? {
                create: steps.map((s: any) => ({
                    title: s.title,
                    description: s.description,
                    code: s.code,
                    order: s.order
                }))
            } : undefined
        };

        const snippet = await prisma.snippet.update({
            where: { id },
            data: updateData,
            include: { steps: true }
        });

        // Update indexing (Phase 2 - Granular)
        storeEmbedding(snippet.id, title || snippet.title, description || (snippet.description as string), snippet.steps);

        res.json(snippet);
    } catch (error) {
        console.error('Error updating snippet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSnippet = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const snippet = await prisma.snippet.findUnique({ where: { id } });
        if (snippet?.isAiGenerated) {
            const updateData: any = { isVisible: false };
            await prisma.snippet.update({
                where: { id },
                data: updateData
            });
        } else {
            await prisma.snippet.delete({ where: { id } });
        }
        res.json({ message: 'Snippet deleted successfully' });
    } catch (error) {
        console.error('Error deleting snippet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserSnippets = async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    if (!userId) {
        return res.status(400).json({ message: 'UserId is required' });
    }
    try {
        const whereClause: any = { userId, isVisible: true };
        const snippets = await prisma.snippet.findMany({
            where: whereClause,
            include: {
                category: {
                    include: { language: true }
                },
                steps: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(snippets);
    } catch (error) {
        console.error('Error fetching user snippets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createLanguage = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }
        const { name, slug, icon } = req.body;
        const language = await prisma.language.create({
            data: { name, slug, icon }
        });
        res.status(201).json(language);
    } catch (error: any) {
        console.error('Error creating language:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'A language with this name or slug already exists.' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }
        const { name, slug, languageId } = req.body;
        const category = await prisma.category.create({
            data: { name, slug, languageId }
        });
        res.status(201).json(category);
    } catch (error: any) {
        console.error('Error creating category:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'A category with this name or slug already exists for this language.' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
