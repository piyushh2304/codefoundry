
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardNav } from "@/components/DashboardNav";
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Code2, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Language {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

const Dashboard = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [userSnippets, setUserSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snippetsLoading, setSnippetsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await api.get('/snippets/languages');
        if (response.data && Array.isArray(response.data)) {
          setLanguages(response.data);
        } else {
          console.error('Expected array for languages, but received:', typeof response.data === 'string' && response.data.includes('<!doctype html>') ? 'HTML Document (likely a routing error)' : response.data);
          setLanguages([]);
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const fetchUserSnippets = async () => {
        if (!user?.id) return;
        try {
            const response = await api.get(`/snippets/user-snippets?userId=${user.id}`);
            if (response.data && Array.isArray(response.data)) {
              setUserSnippets(response.data);
            } else {
              console.error('Expected array for user snippets, but received:', typeof response.data === 'string' && response.data.includes('<!doctype html>') ? 'HTML Document' : response.data);
              setUserSnippets([]);
            }
        } catch (error) {
            console.error('Error fetching user snippets:', error);
        } finally {
            setSnippetsLoading(false);
        }
    };
    fetchUserSnippets();
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav />
      
      <main className="flex-1 container py-6 md:py-10 px-4 sm:px-6 md:px-8 mx-auto max-w-7xl">
        <div className="grid gap-8 md:gap-12">
            
            {/* Your Snippets - Sticky/Prominent Top Card */}
            {user && (
                <section className="relative">
                    <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-6 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                             <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shadow-inner">
                                <Sparkles size={20} />
                             </div>
                             <div>
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Your AI Library</h2>
                                <p className="text-xs md:text-sm text-muted-foreground">Quick access to your generated snippets.</p>
                             </div>
                        </div>
                        {userSnippets.length > 0 && (
                             <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                View All <ChevronRight size={16} />
                             </Button>
                        )}
                    </div>

                    {snippetsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {[1, 2, 3].map(i => (
                                 <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse border border-white/5" />
                             ))}
                        </div>
                    ) : userSnippets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.isArray(userSnippets) && userSnippets.slice(0, 3).map((snippet, index) => (
                                <motion.div
                                    key={snippet.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => navigate(`/ai-snippets/${snippet.id}`)}
                                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-5 transition-all hover:bg-white/5 hover:border-white/10"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                <Code2 size={16} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/70">
                                                {snippet.feature || 'AI Generated'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Clock size={10} />
                                            {new Date(snippet.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <h4 className="font-semibold text-foreground group-hover:text-indigo-400 transition-colors line-clamp-1">
                                        {snippet.title}
                                    </h4>
                                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {snippet.description}
                                    </p>
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <Sparkles size={12} className="text-yellow-500/50" />
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Call to action for more */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => navigate('/ask-ai')}
                                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-white/10 hover:border-indigo-500/50 transition-colors group cursor-pointer"
                            >
                                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                                    <Sparkles size={20} />
                                </div>
                                <span className="mt-2 text-sm font-medium text-muted-foreground group-hover:text-foreground">Generate More</span>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="p-12 rounded-2xl border border-dashed border-white/10 flex flex-col items-center text-center">
                            <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-medium">No AI snippets yet</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-6">Ask our AI to generate high-quality code and it will appear here.</p>
                            <Button onClick={() => navigate('/ask-ai')} variant="outline" className="gap-2">
                                <Sparkles size={16} /> Ask AI Now
                            </Button>
                        </div>
                    )}
                </section>
            )}

            <div className="mt-4 md:mt-8 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Language Hub</h1>
                <p className="text-muted-foreground text-base md:text-lg">Select a language to browse curated code snippets.</p>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-muted animate-pulse rounded-xl border border-white/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.isArray(languages) && languages.map((lang, index) => (
                        <motion.div
                            key={lang.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                delay: index * 0.08,
                                type: "spring",
                                damping: 20,
                                stiffness: 100
                            }}
                            whileHover={{ 
                                scale: 1.02, 
                                translateY: -8,
                            }}
                            onClick={() => navigate(`/snippets/${lang.slug}`)}
                            className="group relative cursor-pointer min-h-[220px] rounded-[2rem] border border-white/5 bg-[#0a0a0c] p-1 transition-all hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]"
                        >
                            {/* Inner Container */}
                            <div className="relative h-full w-full rounded-[1.8rem] bg-gradient-to-br from-white/[0.03] to-transparent p-7 overflow-hidden">
                                
                                {/* Background Decorative Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="relative flex flex-col h-full justify-between z-10">
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-[10deg] group-hover:scale-110 shadow-xl">
                                                <span className="text-2xl font-black italic tracking-tighter">
                                                    {lang.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                {lang.slug === 'mern' ? 'Full Stack' : 'Language'}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors tracking-tight">
                                                {lang.name}
                                            </h3>
                                            <p className="mt-2.5 text-[13px] text-slate-500 leading-relaxed font-medium line-clamp-3">
                                                Master the art of {lang.name} with our curated collection of enterprise-grade boilerplates and advanced utilities.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between">
                                        <div className="flex items-center text-xs font-bold text-primary group-hover:gap-3 transition-all duration-300">
                                            <span className="uppercase tracking-[0.2em] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                Browse Gallery
                                            </span>
                                            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg">
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-1 w-1 rounded-full bg-white/10 group-hover:bg-primary/40 transition-colors" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Shine Effect */}
                                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;