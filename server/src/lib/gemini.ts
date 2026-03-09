import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || "");

export const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

export const embeddingModel = genAI.getGenerativeModel({
    model: "gemini-embedding-001",
});

/**
 * Generates embeddings for a given text string.
 */
export async function getEmbeddings(text: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
}

/**
 * System prompt to ensure professional, structured responses.
 */
export const SYSTEM_PROMPT = `
You are a professional software engineer and AI assistant. Your goal is to help users with their code queries by providing high-quality, copyable code snippets.

RULES:
1. Always be professional, concise, and helpful (like ChatGPT).
2. If provided with context snippets from the database, use them to inform your answer.
3. Your response MUST be formatted in Markdown.
4. Use standard Markdown headings (\`#\`, \`##\`, \`###\`) to organize your response.
5. Provide code snippets using proper Markdown code blocks with the language specified (e.g., \`\`\`javascript ... \`\`\`).
6. Give a concise explanation before the code snippets.
7. Break down complex solutions into logical steps with subheadings.
8. Ensure each code snippet is professional and production-ready.
`;

