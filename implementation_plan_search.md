# CodeFoundry Search Integration Guide

This guide provides the full implementation details for the search functionality, including the Backend API and the Frontend integration with debouncing.

## 1. Backend: Search API Endpoint
**File:** `server/src/controller/snippet.controller.ts`

### Code to Add:
```typescript
/**
 * Handles global search for snippets and languages
 * Performs case-insensitive search on titles and slugs
 */
export const getSearch = async (req: Request, res: Response) => {
    const query = req.query.q as string;
    
    // Return empty results if query is missing to avoid unnecessary DB load
    if (!query) return res.json({ results: [] });

    try {
        // Run searches in parallel for better performance
        const [languages, snippets] = await Promise.all([
            // Search Languages
            prisma.language.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { slug: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 5 // Limit to top 5 languages
            }),
            // Search Snippets (Visible only)
            prisma.snippet.findMany({
                where: {
                    AND: [
                        { isVisible: true },
                        {
                            OR: [
                                { title: { contains: query, mode: 'insensitive' } },
                                { description: { contains: query, mode: 'insensitive' } }
                            ]
                        }
                    ]
                },
                include: {
                    category: { include: { language: true } }
                },
                take: 10 // Limit to top 10 snippets
            })
        ]);

        // Transform DB results into a consistent UI format
        const formattedResults = [
            ...languages.map(l => ({
                id: l.id,
                title: l.name,
                description: `Browse all ${l.name} code snippets and patterns.`,
                type: 'language',
                to: `/snippets/${l.slug}`
            })),
            ...snippets.map(s => ({
                id: s.id,
                title: s.title,
                description: s.description || 'View details for this code snippet.',
                type: s.isAiGenerated ? 'ai' : 'curated',
                to: s.isAiGenerated ? `/ai-snippets/${s.id}` : `/snippets/${(s as any).category.language.slug}`
            }))
        ];

        res.json({ results: formattedResults });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
```

---

## 2. Frontend: Debouncing & API Integration
**File:** `client/src/components/DashboardNav.tsx`

### Logic Implementation:
```tsx
import { useState, useEffect } from "react";
import api from "@/lib/axios"; // Your axios instance
import { useNavigate } from "react-router-dom";

// Inside DashboardNav component:
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

/**
 * DEBOUNCING LOGIC:
 * This effect triggers every time 'query' changes.
 * It waits for 300ms of inactivity before calling the API.
 */
useEffect(() => {
    // If query is empty, clear results and don't make an API call
    if (!query.trim()) {
        setResults([]);
        return;
    }

    // Timer to delay the API request
    const delayDebounceFn = setTimeout(async () => {
        setLoading(true);
        try {
            // API Call to the new backend endpoint
            const response = await api.get(`/snippets/search?q=${query}`);
            setResults(response.data.results || []);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    }, 300); // 300ms is standard for search inputs

    // CLEANUP: If the user types again within 300ms, the previous timer is cancelled
    return () => clearTimeout(delayDebounceFn);
}, [query]);
```

---

## Line-by-Line Explanation

### Backend Logic:
1. **`prisma.$executeRaw` vs `findMany`**: I used `findMany` with `contains` and `mode: 'insensitive'` for cross-database compatibility (works on SQLite, Postgres, etc.) and better readability.
2. **`Promise.all`**: This executes both the Languages search and Snippets search at the same time on the server, significantly reducing response time.
3. **Result Mapping**: I map different database models (`Language`, `Snippet`) into a **unified result object** so the frontend doesn't have to handle complex conditional rendering.

### Frontend Logic:
1. **`setTimeout`**: This is the heart of debouncing. It schedules the function to run later.
2. **`clearTimeout` (Cleanup)**: Every time the `useEffect` runs again (as the user types), it clears the previous scheduled timer. This ensures that only the **final** keystroke triggers the API call.
3. **`loading` state**: Essential for UX. It shows the spinner while the user is waiting, making the UI feel responsive even with a delay.
4. **`query.trim()`**: Prevents API calls for just spaces or whitespace.

---

## 3. User-Specific Recent Searches (Local History)
**File:** `client/src/components/DashboardNav.tsx`

To ensure each user sees their own recent searches, we store their history in `localStorage` keyed by their unique `user.id`.

### Implementation Logic:
```tsx
const { user } = useAuth();
const [recentSearches, setRecentSearches] = useState([]);

// 1. LOAD: Fetch history for THIS specific user on mount
useEffect(() => {
    if (user?.id) {
        const history = JSON.parse(localStorage.getItem(`recent_search_${user.id}`) || "[]");
        setRecentSearches(history);
    }
}, [user?.id]);

// 2. SAVE: Function to update history
const addToHistory = (item) => {
    if (!user?.id) return;
    
    // Create new list: Put latest item at top, remove old duplicates
    const newHistory = [
        item,
        ...recentSearches.filter(r => r.id !== item.id)
    ].slice(0, 5); // Keep top 5 only

    setRecentSearches(newHistory);
    localStorage.setItem(`recent_search_${user.id}`, JSON.stringify(newHistory));
};

// 3. TRIGGER: call addToHistory when a result is clicked
// <button onClick={() => {
//    addToHistory({ id: item.id, title: item.title, to: item.to, type: item.type });
//    navigate(item.to);
// }}>
```
