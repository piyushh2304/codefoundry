# ⚡ CodeFoundry AI: Advanced Agentic RAG Platform

[![Deployment: Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Deployment: Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)](https://render.com)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![AI: Gemini 2.0](https://img.shields.io/badge/AI-Gemini%202.0-blue?style=flat-square&logo=google-cloud)](https://ai.google.dev/)

**CodeFoundry AI** is a hyper-premium, agentic RAG (Retrieval-Augmented Generation) platform designed for modern developers. It transforms your static code snippets into a dynamic, searchable, and self-correcting knowledge base.

---

## 🧠 The Agentic RAG Architecture

Our RAG implementation goes beyond simple vector search. We've built a multi-stage pipeline designed for technical precision and transparency.

### 1. Hybrid Semantic Retrieval
Unlike standard search, CodeFoundry uses a **dual-vector strategy**:
- **Snippet-Level Embedding**: Captures the high-level intent of a module.
- **Step-Level Embedding**: Tokenizes individual implementation steps for granular code retrieval.
- **Keyword Integration**: Merges semantic results with traditional keyword matches to ensure "exact term" precision.

### 2. Intelligent Reranking & Scoring
Retrieved results are processed through a heuristic reranker that scores matches based on context density. We then provide:
- **Confidence Scores**: A real-time 0-100% indicator of how well the AI's answer aligns with your local database.
- **Source Citations**: Direct links to the specific snippets used to construct the answer, ensuring zero-hallucination transparency.

### 3. Agentic Reflection Loop
Every AI response undergoes a **self-audit pass**. Before you see an answer, the AI evaluates its own output against the retrieved snippets, correcting technical inaccuracies and ensuring implementation alignment.

### 4. Repository Ingestion
Powered by Phase 4 logic, you can feed the AI entire GitHub repositories. It clones, chunks, and indexes the code using `gemini-embedding-001`, turning any repo into a searchable private library.

---

## ✨ Key Features

- **🚀 Notion-Style Editor**: A premium writing experience with automatic code block detection and **intelligent language detection** on paste.
- **💬 Conversational Memory**: A persistent, sliding-window chat history that allows the AI to maintain context across complex, multi-turn technical discussions.
- **⚡ Supercharged UI**: Built with Framer Motion, GSAP, and Tailwind CSS for Apple-level scrollytelling and transitions.
- **🔒 Multi-Tenant Auth**: Secure Google OAuth and local authentication linked to your private snippet vault.

---

## 🛠️ Tech Stack

**Frontend:**
- **React 19 / Vite**: High-performance core.
- **Novel / Tiptap**: Collaborative, rich-text editing.
- **Framer Motion / GSAP**: Cinematic animations.
- **Tailwind CSS**: Modern styling.

**Backend:**
- **Express / Node.js**: Scalable API architecture.
- **Prisma ORM**: Type-safe database interactions.
- **PostgreSQL + pgvector**: Native vector storage for AI embeddings.
- **Google Generative AI**: Powered by Gemini 2.0 Flash and Embedding models.

---

## 🚀 Local Setup

1. **Clone the Repo**
2. **Setup Environment Variables** (`server/.env`):
   ```env
   DATABASE_URL=postgresql://user:pass@localhost:5432/db
   GEMINI_API_KEY=your_key_here
   JWT_SECRET=your_secret_here
   ```
3. **Install & Run**:
   ```bash
   npm run install:all
   npm run dev
   ```

## 🌍 Deployment

The project is production-optimized for split-deployment:
- **Backend**: Render (requires `prisma generate` in build).
- **Frontend**: Vercel (includes SPA routing support).

Check the **[README_DEPLOY.md](./README_DEPLOY.md)** for detailed production instructions.

---

*Built with ❤️ for the developer community.*
