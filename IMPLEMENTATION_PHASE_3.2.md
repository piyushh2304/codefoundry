# Implementation Plan: Phase 3.2 - Snippet Management & Search API

## Overview
This phase focuses on building the core functionality of the platform: managing code snippets. This includes CRUD operations, advanced filtering by language/category, and a robust search mechanism.

## Objectives
- [ ] Create `SnippetController` for handling all snippet-related logic.
- [ ] Implement robust search and filtering (by language, category, and feature).
- [ ] Implement pagination for snippet lists.
- [ ] Establish protected routes for creating/editing snippets (Admin/User role check).
- [ ] Integrate snippet routes into the main application.

## 1. Controller Development
### `server/src/controller/snippet.controller.ts`
Implement the following methods:
- `createSnippet`: Create a new snippet with category association.
- `getSnippets`: List snippets with filtering (language, category, isAiGenerated) and pagination.
- `getSnippetById`: Fetch detailed snippet information.
- `updateSnippet`: Update snippet content or metadata (Protected).
- `deleteSnippet`: Remove a snippet (Protected).
- `searchSnippets`: Full-text search across titles, descriptions, and code.

## 2. Route Definition
### `server/src/routes/snippet.routes.ts`
- `GET /api/snippets` - List all/filtered snippets.
- `GET /api/snippets/search` - Search snippets.
- `GET /api/snippets/:id` - Get specific snippet.
- `POST /api/snippets` - Create new snippet (Requires Auth).
- `PUT /api/snippets/:id` - Update snippet (Requires Auth).
- `DELETE /api/snippets/:id` - Delete snippet (Requires Auth).

## 3. Integration
### `server/src/index.ts`
- Import and mount snippet routes at `/api/snippets`.

## 4. Verification Tasks
- [ ] Test snippet creation via Postman/Thunder Client.
- [ ] Verify category/language relations are correctly handled.
- [ ] Test the filtering logic (e.g., fetch only "JavaScript" snippets).
- [ ] Test the search functionality with partial keywords.

---
**Next Step:** Implement the Snippet Controller logic.
