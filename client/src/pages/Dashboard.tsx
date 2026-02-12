
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardNav } from "@/components/DashboardNav";
import axios from 'axios';
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
        const response = await axios.get('http://localhost:5000/api/snippets/languages');
        setLanguages(response.data);
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
            const response = await axios.get(`http://localhost:5000/api/snippets/user-snippets?userId=${user.id}`);
            setUserSnippets(response.data);
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
      
      <main className="flex-1 container py-8 px-4 md:px-8 mx-auto max-w-7xl">
        <div className="grid gap-12">
            
            {/* Your Snippets - Sticky/Prominent Top Card */}
            {user && (
                <section className="relative">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                             <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                <Sparkles size={20} />
                             </div>
                             <div>
                                <h2 className="text-2xl font-bold tracking-tight">Your AI Library</h2>
                                <p className="text-sm text-muted-foreground">Quick access to your generated snippets.</p>
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
                            {userSnippets.slice(0, 3).map((snippet, index) => (
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

            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Language Hub</h1>
                <p className="text-muted-foreground text-lg">Select a language to browse curated code snippets.</p>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-muted animate-pulse rounded-xl border border-white/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {languages.map((lang, index) => (
                        <motion.div
                            key={lang.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            onClick={() => navigate(`/snippets/${lang.slug}`)}
                            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 transition-all hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/5"
                        >
                            <div className="flex flex-col h-full items-start justify-between">
                                <div className="space-y-4">
                                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                      {/* Placeholder for icon if missing */}
                                      <span className="text-xl font-bold">{lang.name.charAt(0)}</span>
                                  </div>
                                  <div>
                                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{lang.name}</h3>
                                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                          Explore advanced {lang.name} snippets, boilerplates, and common utility functions.
                                      </p>
                                  </div>
                                </div>
                                <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-2">
                                    Browse Snippets
                                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
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