import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, 
    Bot, 
    User, 
    Loader2, 
    Sparkles, 
    Database,
    Globe
} from 'lucide-react';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { DashboardNav } from '@/components/DashboardNav';
import { useAuth } from '@/context/AuthContext';
import Editor from '@/components/Editor';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    snippet?: {
        title: string;
        code: string;
        language: string;
        category: string;
    };
    steps?: Array<{
        title: string;
        description: string;
        code: string;
    }>;
    isRaging?: boolean;
    isSearching?: boolean;
}

const AskAI = () => {
    const [input, setInput] = useState('');
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hello! I'm your AI assistant. I can help you find or generate code snippets. I'll search our local database first and then use my general knowledge to provide you with a professional solution."
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/ai/ask', {
                prompt: input,
                userId: user?.id
            });

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.explanation,
                snippet: response.data.snippet ? {
                    title: response.data.snippet.title,
                    code: response.data.snippet.code,
                    language: response.data.language,
                    category: response.data.category
                } : undefined,
                steps: response.data.steps,
                isRaging: true,
                isSearching: true
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error asking AI:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error while processing your request. Please make sure your server and Gemini API key are correctly configured."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col">
            <DashboardNav />

            <div className="flex-1 overflow-y-auto pt-6 pb-24 max-w-4xl mx-auto w-full px-4 md:px-8 custom-scrollbar">
                <div className="space-y-8">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex gap-4 p-4 rounded-2xl transition-colors",
                                    msg.role === 'assistant' ? "bg-white/5 border border-white/5" : ""
                                )}
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                                    msg.role === 'assistant' 
                                        ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" 
                                        : "bg-slate-800 border-slate-700 text-slate-300"
                                )}>
                                    {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            {msg.role === 'assistant' ? 'CodeFoundry AI' : 'You'}
                                        </span>
                                        {msg.role === 'assistant' && msg.isRaging && (
                                            <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                <Database size={10} />
                                                RAG ACTIVE
                                            </span>
                                        )}
                                        {msg.role === 'assistant' && msg.isSearching && (
                                            <span className="flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                                                <Globe size={10} />
                                                SEARCHED
                                            </span>
                                        )}
                                    </div>
                                    <div className="bg-transparent -ml-4">
                                        <Editor 
                                            readOnly={true} 
                                            initialContent={
                                                msg.role === 'assistant' && msg.steps 
                                                ? `${msg.content}\n\n${msg.steps.map(s => `## ${s.title}\n${s.description}\n\n\`\`\`${msg.snippet?.language || 'javascript'}\n${s.code}\n\`\`\``).join('\n\n')}`
                                                : msg.role === 'assistant' && msg.snippet
                                                ? `${msg.content}\n\n\`\`\`${msg.snippet.language}\n${msg.snippet.code}\n\`\`\``
                                                : msg.content
                                            } 
                                            onChange={() => {}} 
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {isLoading && (
                        <div className="flex gap-4 p-4">
                            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <Loader2 size={18} className="animate-spin" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500 italic">Thinking... searching codebase...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute -top-12 left-0 right-0 flex justify-center gap-2 opacity-60">
                         <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] flex items-center gap-1.5">
                            <Sparkles size={10} className="text-purple-400" />
                            Gemini 2.0 Enabled
                         </div>
                         <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] flex items-center gap-1.5">
                            <Database size={10} className="text-indigo-400" />
                            Auto-syncing to Snippets
                         </div>
                    </div>
                    <div className="relative group">
                        <Input
                            placeholder="Ask anything (e.g., 'User auth using MERN' or 'Node.js server code')"
                            className="w-full bg-white/5 border-white/10 focus:border-indigo-500/50 h-14 pl-6 pr-14 rounded-2xl text-lg transition-all focus:ring-4 focus:ring-indigo-500/10"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 top-3 h-8 w-8 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:opacity-50 text-white flex items-center justify-center transition-all shadow-lg"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </div>
                    <p className="text-center mt-3 text-[11px] text-slate-600">
                        CodeFoundry AI can make mistakes. Verify important code before use.
                    </p>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default AskAI;
