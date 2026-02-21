"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Search, Sparkles, Menu, LogOut, LayoutDashboard, MessageSquare, CreditCard, Globe, FileText, Users, Layout } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";

// Reuse Logo component logic but adapted for consistency
const Logo = () => (
  <Link to="/" className="flex items-center gap-2 font-bold text-xl transition-opacity hover:opacity-90">
    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground ">
      <Code2 className="h-5 w-5" />
    </div>
    <span>CodeFoundry</span>
  </Link>
);

export const DashboardNav = () => {
  const { user, logout } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load user history on mount
  useEffect(() => {
    if (user?.id) {
        const history = JSON.parse(localStorage.getItem(`recent_search_${user.id}`) || "[]");
        setRecentSearches(history);
    }
  }, [user?.id]);

  const addToHistory = (item: any) => {
    if (!user?.id) return;
    const newHistory = [
        { id: item.id, title: item.title, to: item.to, type: item.type },
        ...recentSearches.filter(r => r.id !== item.id)
    ].slice(0, 5);
    setRecentSearches(newHistory);
    localStorage.setItem(`recent_search_${user.id}`, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    if (!user?.id) return;
    setRecentSearches([]);
    localStorage.removeItem(`recent_search_${user.id}`);
  };

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/snippets/search?q=${query}`);
        setResults(response.data.results || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between gap-4">
        
        {/* Left: Logo */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>

        {/* Center: Search Bar */}
        <div ref={dropdownRef} className="flex-1 relative flex justify-center max-w-lg mx-2 sm:mx-8">
            <div className={cn(
                "relative group w-full transition-all duration-500",
                isSearchFocused ? "max-w-xl" : "max-w-md"
            )}>
                <div 
                    onClick={() => {
                        const input = document.getElementById('global-search-input');
                        input?.focus();
                        setIsSearchFocused(true);
                    }}
                    className={cn(
                        "flex items-center h-11 w-full rounded-2xl bg-slate-100/50 dark:bg-white/5 border transition-all duration-300 px-4 cursor-text",
                        isSearchFocused ? "border-primary/40 bg-white dark:bg-[#0d0d0e] ring-4 ring-primary/5 shadow-xl" : "border-slate-200 dark:border-white/5 hover:border-primary/20",
                    )}
                >
                    <Search className={cn(
                        "h-5 w-5 shrink-0 transition-colors mr-3",
                        isSearchFocused ? "text-primary" : "text-slate-400 dark:text-slate-500"
                    )} />
                    <input 
                        id="global-search-input"
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                        placeholder="Search code snippets, files..."
                        value={query}
                        autoComplete="off"
                        spellCheck={false}
                        onFocus={() => setIsSearchFocused(true)}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {!query && !isSearchFocused && (
                        <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded bg-slate-200 dark:bg-white/5 px-2 font-mono text-[10px] font-black text-slate-500 sm:flex border border-slate-300 dark:border-white/10 ml-2 uppercase tracking-tighter">
                           {isMac ? '⌘' : 'CTRL'}K
                        </kbd>
                    )}
                    {query && (
                        <button onClick={(e) => { e.stopPropagation(); setQuery(""); }} className="ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Dropdown Results */}
                <AnimatePresence>
                    {isSearchFocused && (
                        <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            className="absolute top-[120%] left-0 right-0 w-screen max-w-[480px] -translate-x-1/2 left-1/2 sm:left-0 sm:translate-x-0 sm:w-[520px] z-[100] bg-white dark:bg-[#0d0d0e] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            <div className="max-h-[550px] overflow-y-auto p-6 custom-scrollbar space-y-8">
                                
                                {/* I'M LOOKING FOR... (Categories) */}
                                {!query && (
                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">I'm looking for...</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {[
                                                { label: 'Snippets', icon: <Code2 size={14} />, color: 'text-indigo-500' },
                                                { label: 'Languages', icon: <Globe size={14} />, color: 'text-emerald-500' },
                                                { label: 'AI Solutions', icon: <Sparkles size={14} />, color: 'text-purple-500' },
                                                { label: 'Docs', icon: <FileText size={14} />, color: 'text-blue-500' },
                                                { label: 'Community', icon: <Users size={14} />, color: 'text-orange-500' },
                                                { label: 'Templates', icon: <Layout size={14} />, color: 'text-pink-500' }
                                            ].map((cat) => (
                                                <button 
                                                    key={cat.label}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-primary/20 transition-all text-xs font-bold text-slate-700 dark:text-slate-300 group"
                                                >
                                                    <span className={cn("transition-colors", cat.color)}>{cat.icon}</span>
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* RECENT SEARCHES or RESULTS */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                            {query ? 'Results' : 'Recent Searches'}
                                        </h3>
                                        {!query && recentSearches.length > 0 && (
                                            <button 
                                                onClick={clearHistory}
                                                className="text-[10px] font-bold text-red-500/60 hover:text-red-500 transition-colors uppercase tracking-widest"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                    
                                    {loading ? (
                                        <div className="py-12 flex flex-col items-center gap-4">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Searching Library...</span>
                                        </div>
                                    ) : query.trim() ? (
                                        <div className="space-y-1">
                                            {results.length > 0 ? results.map((item: any) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        addToHistory(item);
                                                        navigate(item.to);
                                                        setIsSearchFocused(false);
                                                    }}
                                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group text-left"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                            {item.type === 'language' ? <Code2 size={18} /> : <Sparkles size={18} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-[14px] text-slate-900 dark:text-white truncate">{item.title}</h4>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.type}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            )) : (
                                                <div className="py-8 text-center text-[13px] text-slate-500 font-medium">
                                                    No results found for "<span className="text-primary italic">{query}</span>"
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {recentSearches.length > 0 ? recentSearches.map((item, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => {
                                                        addToHistory(item); // Move to top
                                                        navigate(item.to);
                                                        setIsSearchFocused(false);
                                                    }}
                                                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                                            {item.type === 'language' ? <Code2 size={14} /> : <Sparkles size={14} />}
                                                        </div>
                                                        <span className="text-[14px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{item.title}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{item.type}</span>
                                                </button>
                                            )) : (
                                                <div className="py-6 text-center">
                                                    <p className="text-[13px] text-slate-500 font-medium">No recent searches yet.</p>
                                                    <p className="text-[11px] text-slate-400 mt-1">Explore snippets to build your history.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer hint */}
                            <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-200/50 dark:border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-600">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-300 dark:border-white/10">⏎</div> to select</span>
                                    <span className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-300 dark:border-white/10">ESC</div> to close</span>
                                </div>
                                <span className="text-primary/50 text-[9px] italic">Proprietary Index</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Link to="/ask-ai" className="hidden sm:flex">
            <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 transition-all duration-300 shadow-md hover:shadow-lg"
            >
                <Sparkles className="h-4 w-4" />
                <span>Ask AI</span>
            </Button>
          </Link>
          
          <div className="hidden md:block">
            <ModeToggle />
          </div>

          {/* Desktop User Info & Logout */}
          {user && (
            <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-border/40">
                <div className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase border",
                    user.plan === 'PRO' 
                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" 
                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                )}>
                    {user.plan}
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                        logout();
                        window.location.href = "/";
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors text-xs font-bold"
                >
                    Logout
                </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-1">
             <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] border-l border-white/5 bg-[#050505] p-0 flex flex-col">
                    <SheetHeader className="p-6 border-b border-white/5 text-left flex flex-row items-center justify-between">
                        <SheetTitle className="text-white flex items-center gap-2">
                             <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                                <Code2 className="h-4 w-4" />
                             </div>
                             <span>CodeFoundry</span>
                        </SheetTitle>
                        {user && (
                            <div className={cn(
                                "px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border shadow-sm",
                                user.plan === 'PRO' 
                                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" 
                                    : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            )}>
                                {user.plan}
                            </div>
                        )}
                    </SheetHeader>
                    
                    <div className="flex-1 py-6 px-4 space-y-2">
                        {[
                            { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                            { to: "/ask-ai", icon: MessageSquare, label: "Ask AI assistant" },
                            { to: "/features", icon: Sparkles, label: "Features" },
                            { to: null, icon: CreditCard, label: "Pricing" }
                        ].map((item, idx) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + idx * 0.05, duration: 0.4, ease: "easeOut" }}
                            >
                                <SheetClose asChild>
                                    {item.to ? (
                                        <Link to={item.to}>
                                            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                                                <item.icon size={18} />
                                                {item.label}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                                            <item.icon size={18} />
                                            {item.label}
                                        </Button>
                                    )}
                                </SheetClose>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 border-t border-white/5 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-400">Settings</span>
                            <ModeToggle />
                        </div>
                        {user && (
                            <div className="pt-2">
                                <Button 
                                    className="w-full justify-start gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 h-12 transition-all rounded-xl"
                                    variant="ghost"
                                    onClick={() => {
                                        logout();
                                        window.location.href = "/";
                                    }}
                                >
                                    <LogOut size={18} />
                                    Log out
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </SheetContent>
             </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};