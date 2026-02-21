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
import { UpgradeButton } from '@/components/UpgradeButton';

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
    const { updateUser } = useAuth();

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

            // Update usage count locally if user is FREE
            if (user?.plan === 'FREE') {
                updateUser({ aiUsageCount: (user.aiUsageCount || 0) + 1 });
            }
        } catch (error: any) {
            console.error('Error asking AI:', error);
            const status = error.response?.status;
            const message = error.response?.data?.message || "I'm sorry, I encountered an error while processing your request.";
            
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: message
            }]);

            if (status === 403) {
                // If the error was a limit error, we should probably trigger the overlay 
                // but the local count update above should handle it for subsequent renders
                // If they refresh, the server count will be accurate
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-slate-200 flex flex-col relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
            </div>

            <DashboardNav />

            {/* Premium Overlay for non-pro users reaching limit */}
            {user?.plan === 'FREE' && (user?.aiUsageCount || 0) >= 3 && (
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl bg-black/40">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md space-y-6 p-10 rounded-[2.5rem] bg-black/40 border border-white/5 shadow-[0_0_50px_-12px_rgba(255,190,26,0.15)] backdrop-blur-md"
                    >
                        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/20 mb-4 shadow-inner">
                            <Sparkles className="text-yellow-500 w-10 h-10 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Free Trial Ended</h2>
                        <p className="text-slate-400 leading-relaxed font-medium text-lg">
                            You've used your 3 free AI generations. Upgrade to Pro for unlimited snippets, advanced explanations, and private repo search.
                        </p>
                        <div className="flex justify-center pt-4">
                            <UpgradeButton />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto px-4 relative z-10 custom-scrollbar pb-40">
                <div className="max-w-4xl mx-auto py-10 space-y-12">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className={cn(
                                    "flex gap-3 md:gap-6 group relative",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {/* Avatar Section */}
                                <div className="shrink-0 pt-1">
                                    <div className={cn(
                                        "h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl flex items-center justify-center border shadow-lg transition-transform group-hover:scale-110",
                                        msg.role === 'assistant' 
                                            ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400 shadow-indigo-500/5" 
                                            : "bg-slate-900 border-white/5 text-slate-400 shadow-black/20"
                                    )}>
                                        {msg.role === 'assistant' ? <Bot size={18} className="md:size-[22px] drop-shadow-sm" /> : <User size={18} className="md:size-[22px]" />}
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className={cn(
                                    "flex flex-col max-w-[90%] md:max-w-[85%]",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}>
                                    <div className="flex items-center gap-3 mb-2 px-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                            {msg.role === 'assistant' ? 'CodeFoundry AI' : 'Your Query'}
                                        </span>
                                        {msg.role === 'assistant' && (
                                            <div className="flex gap-2">
                                                {msg.isRaging && (
                                                    <span className="flex items-center gap-1.5 text-[9px] font-bold bg-emerald-500/5 text-emerald-400/80 px-2 py-0.5 rounded-full border border-emerald-500/10 uppercase tracking-wider">
                                                        <Database size={10} />
                                                        RAG Optimized
                                                    </span>
                                                )}
                                                {msg.isSearching && (
                                                    <span className="flex items-center gap-1.5 text-[9px] font-bold bg-blue-500/5 text-blue-400/80 px-2 py-0.5 rounded-full border border-blue-500/10 uppercase tracking-wider">
                                                        <Globe size={10} />
                                                        Knowledge Base
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 shadow-2xl relative transition-all",
                                        msg.role === 'assistant' 
                                            ? "bg-[#0a0a0d] border border-white/5 text-slate-200" 
                                            : "bg-indigo-600/10 border border-indigo-500/20 text-indigo-50 shadow-indigo-500/5"
                                    )}>
                                        <div className="bg-transparent -mx-6 -my-4">
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
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-6"
                        >
                            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/5">
                                <Loader2 size={22} className="animate-spin" />
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-12 bg-indigo-500/20 rounded-full animate-pulse" />
                                    <div className="h-1.5 w-8 bg-indigo-500/10 rounded-full animate-pulse delay-75" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Analyzing codebase & processing request...</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-32" />
                </div>
            </div>

            {/* Input Station */}
            <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
                <div className="w-full h-40 bg-gradient-to-t from-[#020202] via-[#020202]/90 to-transparent absolute bottom-0 left-0" />
                
                <div className="max-w-4xl mx-auto px-4 pb-8 relative z-10 pointer-events-auto">
                    {/* Floating Indicators */}
                    <div className="flex justify-center gap-3 mb-6 transition-all">
                        <motion.div 
                            whileHover={{ y: -2 }}
                            className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md text-[10px] font-bold text-slate-400 flex items-center gap-2 shadow-xl"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)] animate-pulse" />
                            Gemini 2.0 Engine
                        </motion.div>
                        <motion.div 
                            whileHover={{ y: -2 }}
                            className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md text-[10px] font-bold text-slate-400 flex items-center gap-2 shadow-xl"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                            Repo-Synced Library
                        </motion.div>
                    </div>

                    {/* Main Input Field */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center">
                            <Input
                                placeholder="Ask about MERN, Node.js..."
                                className="w-full bg-[#0d0d0f]/80 backdrop-blur-xl border-white/10 focus:border-indigo-500/50 h-14 md:h-16 pl-5 md:pl-8 pr-16 md:pr-20 rounded-2xl md:rounded-[1.5rem] text-base md:text-lg transition-all focus:ring-0 placeholder:text-slate-600 shadow-2xl"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <div className="absolute right-3 flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className={cn(
                                        "h-11 w-11 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                                        input.trim() && !isLoading 
                                            ? "bg-indigo-500 text-white shadow-indigo-500/20" 
                                            : "bg-white/5 text-slate-600 cursor-not-allowed"
                                    )}
                                >
                                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 px-2">
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                            Built with Google Gemini 2.0
                        </p>
                        <p className="text-[10px] text-slate-700 font-medium">
                            AI may make mistakes. Verify important code.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
};

export default AskAI;
