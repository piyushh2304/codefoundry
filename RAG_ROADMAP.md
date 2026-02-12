# RAG Evolution Roadmap: CodeFoundry

This document outlines the phases to transform the current keyword-based AI into a production-grade **Retrieval-Augmented Generation (RAG)** system using Semantic Search, Vector Embeddings, and Advanced Memory.

---

## 🚀 Phase 1: Semantic Search Foundation (The "Vector" Shift)
*Objective: Move from searching for words to searching for meaning.*

- [x] **Embedding Integration**: Implement a utility using Google's `text-embedding-004` to convert snippets into high-dimensional vectors.
- [x] **Vector Database Setup**: Enable `pgvector` on the existing Neon (PostgreSQL) instance.
- [x] **Schema Migration**: Update `prisma/schema.prisma` to include a `vector` column in the `Snippet` and `SnippetStep` models.
- [x] **Automated Indexing**: Create a background worker/service that automatically generates and stores embeddings whenever a snippet is created or updated.

---

## 🛠️ Phase 2: Enhanced Retrieval Pipeline (The "Intelligence" Layer)
*Objective: Improve the precision and relevance of retrieved context.*

- [x] **Hybrid Search**: Implement a search logic that combines Keyword Search (current) and Vector Search (semantic) for maximum accuracy.
- [x] **Document Chunking**: Split long code snippets and documentation into logical chunks (e.g., function-level chunking) to prevent AI context window overflow.
- [x] **Reranking Utility**: Use a Cross-Encoder model to re-evaluate the top 20 retrieved snippets and pick the absolute best 5 to feed into Gemini.

---

## 🧠 Phase 3: Conversational Memory & State
*Objective: Make the AI remember the context of the entire conversation.*

- [x] **Persistent Chat History**: Store every chat message in a dedicated `ChatMessage` table in PostgreSQL.
- [x] **Context Window Management**: Implement a "Sliding Window" strategy to feed relevant past messages (and their retrieved RAG context) back into new prompts.
- [x] **User Personalization**: Allow the RAG system to prioritize snippets "liked" or "edited" by the specific user in their library.

---

## 🎨 Phase 4: UI/UX Transparency & Ingestion
*Objective: Provide visual proof of RAG and allow users to contribute knowledge.*

- [x] **Source Citations**: In the `AskAI` chat, show "Sources Used" chips that link directly to the snippets in the Language Hub used to build the answer.
- [x] **Local Repository Ingestion**: Allow users to upload a ZIP file or provide a GitHub URL to be "ingested" (embedded and indexed) into their private AI library.
- [x] **Confidence Scores**: Display a "Confidence Score" for AI answers based on the similarity of the retrieved context.

---

## 📈 Future: Agentic RAG
*Objective: AI that can browse the web and refine its own context.*

- [x] **Web Search Integration**: Allow the RAG system to search the live web if the local database (PostgreSQL) doesn't have a sufficient answer.
- [x] **Self-Correction Logic**: Implement a "Reflection" loop where the AI evaluates its own answer against the retrieved snippets before showing it to the user.
