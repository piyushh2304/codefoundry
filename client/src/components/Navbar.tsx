"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { Code2, Menu, X, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

const items = [
  { title: "Pricing", href: "#pricing" },
  { title: "Features", href: "#features" },
  { title: "FAQ", href: "#faq" },
];

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-yellow-400/20 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" /> 
            </div>
            <span className="text-xl">CodeFoundry</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Right Side: CTA + Mobile Menu */}
        <div className="flex items-center gap-4">
            <div className="hidden md:block">
               <ModeToggle />
            </div>
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button className="rounded-full font-semibold px-6" size="default">
                    {isAuthenticated ? "Dashboard" : "Get Started"}
                </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-md hover:bg-muted"
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border/40 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {items.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground"
                >
                  {item.title}
                </Link>
              ))}
              <div className="pt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ModeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
