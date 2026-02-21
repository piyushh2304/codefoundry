import { Router } from 'express';
import {
    getLanguages,
    getSnippetsByLanguage,
    getCategories,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    createLanguage,
    createCategory,
    getUserSnippets,
    getSnippetById,
    getSearch
} from '../controller/snippet.controller.js';

const router = Router();

router.get('/languages', getLanguages);
router.get('/search', getSearch);
router.get('/languages/:langSlug/snippets', getSnippetsByLanguage);
router.get('/categories', getCategories);
router.get('/user-snippets', getUserSnippets);
router.get('/:id', getSnippetById);
router.post('/snippets', createSnippet);
router.put('/:id', updateSnippet);
router.delete('/:id', deleteSnippet);
router.post('/languages', createLanguage);
router.post('/categories', createCategory);

export default router;
