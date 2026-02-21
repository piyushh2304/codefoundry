import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardNav } from "@/components/DashboardNav";
import { Sparkles, ArrowLeft, Code2, Calendar, Trash2 } from "lucide-react";
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import Editor from '@/components/Editor';

interface SnippetStep {
    id: string;
    title: string;
    description: string;
    code: string;
}

interface Snippet {
    id: string;
    title: string;
    description: string;
    code?: string;
    feature?: string;
    createdAt: string;
    steps?: SnippetStep[];
}

const AiSnippetDetailPage = () => {
    const { snippetId } = useParams();
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this AI snippet? It will be removed from your library but kept for AI training transparency.")) return;
        
        setIsDeleting(true);
        try {
            await api.delete(`/snippets/${snippetId}`);
            alert("Snippet deleted successfully");
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting snippet:', error);
            alert("Failed to delete snippet");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const fetchSnippet = async () => {
            try {
                const response = await api.get(`/snippets/${snippetId}`);
                setSnippet(response.data);
            } catch (error) {
                console.error('Error fetching AI snippet:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSnippet();
    }, [snippetId]);

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

    if (!snippet) return (
        <div className="min-h-screen bg-[#050505] flex flex-col">
            <DashboardNav />
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <p className="text-slate-500">Snippet not found or might have been deleted.</p>
                <Button onClick={() => navigate('/dashboard')} variant="outline">Go Back</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 flex flex-col">
            <DashboardNav />
            
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 py-12 pb-32">
                {/* Top Action Bar */}
                <div className="flex items-center justify-between mb-12">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to previous page</span>
                    </button>

                    <Button 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        variant="ghost"
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 gap-2 transition-all"
                    >
                        <Trash2 size={16} />
                        {isDeleting ? 'Deleting...' : 'Delete Snippet'}
                    </Button>
                </div>

                {/* Header Section */}
                <div className="relative mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5 shadow-lg shadow-indigo-500/5">
                            <Sparkles size={12} />
                            AI PRO SOLUTION
                        </div>
                        {snippet.feature && (
                             <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {snippet.feature}
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 ml-auto">
                            <Calendar size={12} />
                            {new Date(snippet.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tight text-white mb-10 bg-gradient-to-r from-white via-white to-white/30 bg-clip-text text-transparent break-words">
                        {snippet.title}
                    </h1>

                    {/* Overall Description */}
                    <div className="max-w-3xl border-l-2 border-indigo-500/30 pl-4 md:pl-8 ml-1">
                         <div className="prose prose-invert prose-p:text-lg md:prose-p:text-xl prose-p:text-slate-400 prose-p:leading-relaxed">
                            <Editor readOnly={true} initialContent={snippet.description} onChange={() => {}} />
                         </div>
                    </div>
                </div>

                {/* Steps Section */}
                <div className="space-y-40">
                    {snippet.steps && snippet.steps.length > 0 ? (
                        snippet.steps.map((step, idx) => {
                            const cleanTitle = step.title?.replace(/^\d+[\s.]+|Step\s+\d+[:\s]*/i, '').trim();
                            return (
                                <div key={step.id || idx} className="space-y-10 scroll-mt-24">
                                    <div className="space-y-6">
                                        <h2 className="text-2xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4 md:gap-6">
                                            <span className="text-indigo-500/30 tabular-nums">{(idx + 1).toString().padStart(2, '0')}</span>
                                            {cleanTitle || step.title}
                                        </h2>
                                        
                                        <div className="bg-transparent prose-h2:hidden prose-h3:hidden">
                                            <Editor 
                                                readOnly={true} 
                                                initialContent={`${step.description}\n\n\`\`\`${snippet.feature || 'javascript'}\n${step.code}\n\`\`\``} 
                                                onChange={() => {}} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : snippet.code ? (
                        /* Fallback for legacy snippets without steps */
                        <div className="space-y-8">
                             <div className="bg-transparent">
                                <Editor 
                                    readOnly={true} 
                                    initialContent={`\`\`\`${snippet.feature || 'javascript'}\n${snippet.code}\n\`\`\``} 
                                    onChange={() => {}} 
                                />
                             </div>
                        </div>
                    ) : null}
                </div>

                {/* Technical Card */}
                <div className="mt-16 md:mt-20 p-6 md:p-10 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles size={40} className="text-indigo-400" />
                    </div>
                    <div className="relative flex flex-col md:flex-row gap-8 items-start">
                        <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 shrink-0">
                            <Code2 size={32} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white mb-3 tracking-tight">AI Content Transparency</h4>
                            <p className="text-slate-400 leading-relaxed text-sm max-w-2xl">
                                This code was generated by our AI agent specifically for your query. 
                                It is designed to be a starting point for your development. 
                                Always review and test AI-generated code in a staging environment before 
                                deploying it to production.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AiSnippetDetailPage;
