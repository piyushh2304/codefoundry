# Implementation Plan: Ask AI (RAG-based Assistant)

## Overview
This phase implements a ChatGPT-like AI assistant that uses Retrieval-Augmented Generation (RAG) to provide context-aware code solutions. It searches existing snippets, uses Google Gemini for generation, and automatically saves generated code to the library.

## Objectives
- [ ] Setup Gemini AI integration with RAG capabilities.
- [ ] Implement a backend AI controller for processing queries.
- [ ] Build a premium, ChatGPT-inspired chat UI.
- [ ] Implement automatic snippet categorization and saving.
- [ ] Ensure responses are professional and include copyable code blocks.

## Phase 1: Backend & RAG Infrastructure
### 1. Gemini Integration (`server/src/lib/ai.ts`)
- Re-initialize `@google/generative-ai`.
- Setup utility for prompt engineering (System instruction for professional responses).
- Implement a search helper to fetch relevant context from the database.

### 2. AI Controller (`server/src/controller/ai.controller.ts`)
- `askAI`: The main endpoint.
  - **Context Retrieval**: Query `prisma.snippet.findMany` with text search or keyword matching (simulating RAG for now, or using embeddings if pgvector is available).
  - **Generation**: Send query + context to Gemini.
  - **Auto-Save**: Parse the structured response from Gemini and create a new `Snippet` record in the database.
- `getChatHistory`: (Optional) Retrieve past interactions.

### 3. Routes (`server/src/routes/ai.routes.ts`)
- `POST /api/ai/ask` - Main chat endpoint.

## Phase 2: Frontend - The "Chat" Experience
### 1. Chat Component (`client/src/components/Chat/ChatInterface.tsx`)
- Full-page or modal-based chat interface.
- Modern input field with auto-resize and "Send" button.
- Message bubbles with distinct styles for User vs AI.
- Framer Motion animations for message entry.

### 2. Specialized Message Rendering
- Use `Tiptap` or a custom Markdown renderer for AI responses.
- Implement syntax highlighting for code blocks.
- Add a floating "Copy" button on all code snippets.

### 3. Navigation & State
- Add "Ask AI" to the Dashboard sidebar.
- Persist current session chat state.

## Phase 3: Automation & Logic
### 1. Structured Output (JSON Mode)
- Force Gemini to return a structured JSON that includes:
  - `title`: Professional title for the snippet.
  - `code`: The actual code.
  - `language`: Target language (slug).
  - `category`: Recommended category (slug).
  - `explanation`: The textual part of the response.

### 2. Database Synchronization
- Verify the auto-saving logic correctly links new snippets to existing Languages/Categories or creates them if missing.

---
**Next Step:** Re-setup the Gemini configuration and implement the Backend AI routes.
