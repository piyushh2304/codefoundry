
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardNav } from "@/components/DashboardNav";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { Copy, Check, ChevronRight, Code2 } from "lucide-react";
import api from '@/lib/axios';
import Editor from '@/components/Editor';

interface SnippetStep {
  id: string;
  title?: string;
  description?: string;
  code?: string;
  order: number;
}

interface Snippet {
  id: string;
  title: string;
  code?: string;
  description?: string;
  feature?: string;
  steps?: SnippetStep[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  snippets: Snippet[];
}

interface LanguageData {
  id: string;
  name: string;
  slug: string;
  categories: Category[];
}

const LanguageDetailPage = () => {
  const { langSlug } = useParams();
  const [data, setData] = useState<LanguageData | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/snippets/languages/${langSlug}/snippets`);
        setData(response.data);
        
        // Auto-select first snippet if available
        if (response.data.categories.length > 0 && response.data.categories[0].snippets.length > 0) {
          setSelectedCategoryId(response.data.categories[0].id);
          setSelectedSnippet(response.data.categories[0].snippets[0]);
        }
      } catch (error) {
        console.error('Error fetching language data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [langSlug]);

  const handleCopy = (code: string | undefined, id: string) => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col">
        <DashboardNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!data) return <div>Language not found</div>;

  // Extract headings from Tiptap JSON to use as TOC steps
  const extractSteps = (content: string | undefined) => {
    if (!content) return [];
    try {
      const json = JSON.parse(content);
      if (json.type !== 'doc' || !json.content) return [];
      
      const steps: { id: string; title: string; level: number }[] = [];
      
      json.content.forEach((node: any) => {
        if (node.type === 'heading' && (node.attrs.level === 2 || node.attrs.level === 3)) {
          const text = node.content?.map((c: any) => c.text).join('') || '';
          if (text) {
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            steps.push({ id, title: text, level: node.attrs.level });
          }
        }
      });
      
      return steps;
    } catch (e) {
      return [];
    }
  };

  const TOCSteps = extractSteps(selectedSnippet?.description);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 flex flex-col selection:bg-primary/30">
      <DashboardNav />
      
      <div className="flex-1 flex max-w-[1600px] mx-auto w-full">
        {/* Sidebar - Left */}
        <aside className="w-[240px] border-r border-slate-800 bg-[#050505] sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto hidden lg:block scrollbar-hide">
          <div className="py-8 px-4">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] border-b border-slate-800 pb-6 mb-10 px-2 whitespace-nowrap text-center">
              {data.name} Reference
            </h2>
            <nav className="space-y-10">
              {data.categories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <h3 className="px-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-4 opacity-90">
                    {category.name}
                  </h3>
                  <div className="ml-2 pl-3 border-l border-white/[0.05] space-y-1 relative">
                    {category.snippets.map((snippet) => (
                      <button
                        key={snippet.id}
                        onClick={() => {
                          setSelectedSnippet(snippet);
                          setSelectedCategoryId(category.id);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-[13px] font-medium transition-all relative group ${
                          selectedSnippet?.id === snippet.id 
                            ? 'text-white' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {/* Active Indicator Line */}
                        {selectedSnippet?.id === snippet.id && (
                          <motion.div 
                            layoutId="active-line"
                            className="absolute left-[-13px] top-0 bottom-0 w-[2px] bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                          />
                        )}
                        {snippet.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content - Center */}
        <main className="flex-1 overflow-y-auto pb-32 px-4 md:px-12 lg:px-20 scrollbar-hide">
          <AnimatePresence mode="wait">
            {selectedSnippet ? (
              <motion.div
                key={selectedSnippet.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl pt-12"
              >
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-4">
                    <span>{data.name}</span>
                    <ChevronRight size={12} className="text-slate-700" />
                    <span className="text-primary/80">{data.categories.find(c => c.id === selectedCategoryId)?.name}</span>
                </div>

                <div className="mb-14">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
                    {selectedSnippet.title}
                  </h1>
                  {selectedSnippet.description && (
                    <div className="text-lg text-slate-400 leading-relaxed -ml-4 prose-h2:scroll-mt-24 prose-h3:scroll-mt-24">
                      <Editor 
                        readOnly={true} 
                        initialContent={selectedSnippet.description} 
                        onChange={() => {}} 
                      />
                    </div>
                  )}
                </div>

                {/* Legacy Steps Section (Keep for backward compatibility) */}
                {selectedSnippet.steps && selectedSnippet.steps.length > 0 && (
                  <div className="space-y-20">
                    {selectedSnippet.steps.map((step) => (
                      <div key={step.id} className="space-y-6">
                        <div className="flex flex-col gap-2">
                           {step.title && (
                             <h2 className="text-2xl font-bold text-white tracking-tight border-b border-slate-800/50 pb-2">
                               {step.title}
                             </h2>
                           )}
                           {step.description && (
                             <div className="text-slate-400 -ml-4">
                               <Editor 
                                 readOnly={true} 
                                 initialContent={step.description} 
                                 onChange={() => {}} 
                               />
                             </div>
                           )}
                        </div>

                        {step.code && (
                           <div className="relative group rounded-xl overflow-hidden border border-slate-800/60 bg-[#0d0d0d] shadow-2xl transition-all hover:border-slate-700/60">
                             <div className="bg-[#111111] px-5 py-3 border-b border-slate-800/50 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                 <div className="flex gap-1.5">
                                   <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                                   <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                                 </div>
                                 <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 ml-2">
                                   {step.title?.split('(')[1]?.replace(')', '') || 'Snippet'}
                                 </span>
                               </div>
                               <button 
                                 onClick={() => handleCopy(step.code, step.id)}
                                 className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-[11px] font-bold text-slate-400 hover:text-white transition-all border border-slate-700/30"
                               >
                                 {copiedStates[step.id] ? (
                                   <>
                                     <Check size={14} className="text-emerald-500" />
                                     <span className="text-emerald-500 uppercase tracking-wider">Copied</span>
                                   </>
                                 ) : (
                                   <>
                                     <Copy size={14} />
                                     <span className="uppercase tracking-wider">Copy</span>
                                   </>
                                 )}
                               </button>
                             </div>
                             <div className="p-2">
                               <MonacoEditor
                                 height={Math.min(800, Math.max(100, step.code.split('\n').length * 24 + 40)) + "px"}
                                 defaultLanguage={data.slug}
                                 value={step.code}
                                 theme="vs-dark"
                                 options={{
                                   readOnly: true,
                                   minimap: { enabled: false },
                                   scrollBeyondLastLine: false,
                                   fontSize: 13,
                                   fontFamily: "'JetBrains Mono', monospace",
                                   padding: { top: 20, bottom: 20 },
                                   lineNumbers: 'on',
                                   renderLineHighlight: 'none',
                                   scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                                   automaticLayout: true,
                                   lineHeight: 1.6,
                                   backgroundColor: '#0d0d0d',
                                 }}
                               />
                             </div>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-24 p-8 rounded-2xl border border-slate-800/50 bg-slate-900/20 flex items-start gap-5">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Code2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 tracking-tight">Technical Implementation Note</h4>
                      <p className="text-slate-400 leading-relaxed italic text-sm">
                          This implementation follows modern security standards. Ensure your <span className="text-primary font-mono text-xs">JWT_SECRET</span> is a high-entropy string and never committed to version control.
                      </p>
                    </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 italic">
                Select a protocol or utility to begin.
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Sidebar - TOC */}
        <aside className="w-64 sticky top-16 h-[calc(100vh-4rem)] p-8 pt-12 hidden xl:block border-l border-slate-800/30 overflow-y-auto scrollbar-hide">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">On This Page</h4>
            <nav className="space-y-1 relative">
                {TOCSteps.length > 0 ? (
                  TOCSteps.map((step, index) => (
                    <a 
                        key={step.id} 
                        href={`#${step.id}`}
                        className={`block py-1.5 transition-all text-slate-500 hover:text-white ${
                          step.level === 3 ? 'pl-4 text-[12px]' : 'text-[13px] font-medium'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(step.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <span className="mr-2 text-slate-700 font-mono text-[10px]">{index + 1}.</span>
                        {step.title}
                    </a>
                  ))
                ) : (
                  <p className="text-[12px] text-slate-600 italic">No sections detected.</p>
                )}
            </nav>
        </aside>
      </div>
    </div>
  );
};


export default LanguageDetailPage;
