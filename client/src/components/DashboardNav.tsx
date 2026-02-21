"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Search, Sparkles, Menu, LogOut, LayoutDashboard, MessageSquare, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

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
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between gap-4">
        
        {/* Left: Logo */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>

        {/* Center: Search Button */}
        <div className="flex-1 hidden xs:flex justify-center max-w-md mx-2 sm:mx-4">
            <Button
              variant="outline"
              className={cn(
                "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-56 lg:w-80",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => {
                console.log("Open search");
              }}
            >
              <Search className="mr-2 h-4 w-4 shrink-0" />
              <span className="hidden md:inline-flex">Search for code snippets...</span>
              <span className="inline-flex md:hidden">Search...</span>
            </Button>
        </div>

        {/* Mobile Search Icon Only (for very small screens) */}
        <div className="xs:hidden">
            <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
            </Button>
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