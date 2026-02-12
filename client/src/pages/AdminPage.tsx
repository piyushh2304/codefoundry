
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Edit3, 
  Layout, 
  Database, 
  ChevronRight,
  Layers,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Editor from '@/components/Editor';
import { DashboardNav } from '@/components/DashboardNav';

interface Language {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AdminPage = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedLang, setSelectedLang] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [isCreatingLang, setIsCreatingLang] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await api.get('/snippets/languages');
        setLanguages(res.data);
      } catch (err) {
        console.error('Error fetching languages:', err);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (selectedLang) {
      const fetchCategories = async () => {
        try {
          const res = await api.get(`/snippets/categories?langId=${selectedLang}`);
          setCategories(res.data);
        } catch (err) {
          console.error('Error fetching categories:', err);
        }
      };
      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [selectedLang]);

  const handleCreateLanguage = async () => {
    if (!newLangName) return;
    try {
        const slug = newLangName.toLowerCase().replace(/ /g, '-');
        const res = await api.post('/snippets/languages', { name: newLangName, slug });
        setLanguages(prev => [...prev, res.data]);
        setSelectedLang(res.data.id);
        setIsCreatingLang(false);
        setNewLangName('');
    } catch (err) {
        console.error('Error creating language:', err);
        setError('Failed to create language.');
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatName || !selectedLang) return;
    try {
        const slug = newCatName.toLowerCase().replace(/ /g, '-');
        const res = await api.post('/snippets/categories', { 
            name: newCatName, 
            slug, 
            languageId: selectedLang 
        });
        setCategories(prev => [...prev, res.data]);
        setSelectedCat(res.data.id);
        setIsCreatingCat(false);
        setNewCatName('');
    } catch (err) {
        console.error('Error creating category:', err);
        setError('Failed to create category.');
    }
  };

  const handleSave = async () => {
    if (!title || !selectedLang || !selectedCat) {
      setError('Please fill in all metadata fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/snippets/snippets', {
        title,
        description: content,
        categoryId: selectedCat,
        code: '', 
        steps: [] 
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Reset form fully
      setTitle('');
      setContent('');
      setSelectedLang('');
      setSelectedCat('');
      setPreviewMode(false);
    } catch (err) {
      console.error('Error saving snippet:', err);
      setError('Failed to save snippet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 flex flex-col selection:bg-primary/30 font-sans">
      <DashboardNav />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Sparkles className="text-primary w-8 h-8" />
              Snippet Factory
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Create and publish premium developer guides.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
                variant="outline" 
                onClick={() => setPreviewMode(!previewMode)}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2"
            >
              {previewMode ? <Edit3 size={18} /> : <Eye size={18} />}
              {previewMode ? 'Back to Editor' : 'Live Preview'}
            </Button>
            <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-black font-bold px-8 rounded-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
              ) : (
                <Share2 size={18} />
              )}
              Save & Publish
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Metadata Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <section className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5 shadow-2xl space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Database size={14} className="text-primary" />
                    Target Language
                  </label>
                  <button 
                    onClick={() => setIsCreatingLang(!isCreatingLang)}
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                  >
                    {isCreatingLang ? 'Cancel' : 'Add New'}
                  </button>
                </div>
                
                {isCreatingLang ? (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Language Name"
                      value={newLangName}
                      onChange={(e) => setNewLangName(e.target.value)}
                      className="bg-[#151515] border-white/10"
                    />
                    <Button onClick={handleCreateLanguage} size="sm" className="bg-primary text-black">
                      Add
                    </Button>
                  </div>
                ) : (
                  <select 
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Language</option>
                    {languages.map(lang => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Layers size={14} className="text-primary" />
                    Category Group
                  </label>
                  {selectedLang && (
                    <button 
                      onClick={() => setIsCreatingCat(!isCreatingCat)}
                      className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                    >
                      {isCreatingCat ? 'Cancel' : 'Add New'}
                    </button>
                  )}
                </div>

                {isCreatingCat ? (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Category Name"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="bg-[#151515] border-white/10"
                    />
                    <Button onClick={handleCreateCategory} size="sm" className="bg-primary text-black">
                      Add
                    </Button>
                  </div>
                ) : (
                  <select 
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                    disabled={!selectedLang}
                    className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Layout size={14} className="text-primary" />
                  Guide Title
                </label>
                <Input 
                  placeholder="e.g., Auth Middleware Pattern"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[#151515] border-white/10 rounded-xl h-12 text-white placeholder:text-slate-600 focus-visible:ring-primary/20"
                />
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm font-medium"
                  >
                    <CheckCircle2 size={18} />
                    Snippet published successfully!
                  </motion.div>
                )}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm font-medium"
                  >
                    <AlertCircle size={18} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
               <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2 tracking-tight">
                 <Sparkles className="w-4 h-4 text-primary" />
                 Pro Tip
               </h4>
               <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
                 Paste your whole markdown or code content here. Our editor will automatically detect code blocks, headings, and formatting to match the premium theme.
               </p>
            </div>
          </div>

          {/* Editor/Preview Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!previewMode ? (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <Editor 
                    onChange={setContent}
                    initialContent={content}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                      <span>{languages.find(l => l.id === selectedLang)?.name || 'Language'}</span>
                      <ChevronRight size={14} className="text-slate-700" />
                      <span className="text-primary">{categories.find(c => c.id === selectedCat)?.name || 'Category'}</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-white tracking-tight mb-8">
                      {title || 'Untitiled Guide'}
                    </h1>
                  </div>
                  <Editor 
                    readOnly={false}
                    initialContent={content}
                    onChange={setContent}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
