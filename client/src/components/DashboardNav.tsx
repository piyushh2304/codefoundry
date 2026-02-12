"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { Code2, Search, Sparkles } from "lucide-react";

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
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between gap-4">
        
        {/* Left: Logo */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>

        {/* Center: Search Button */}
        <div className="flex-1 flex justify-center max-w-md mx-4">
            <Button
              variant="outline"
              className={cn(
                "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-56 lg:w-96",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => {
                console.log("Open search");
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline-flex">Search for code snippets...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              
            </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
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
            {/* Mobile simplified button */}
          <Link to="/ask-ai" className="sm:hidden">
            <Button variant="ghost" size="icon" className="text-purple-500">
                <Sparkles className="h-5 w-5" />
            </Button>
          </Link>
          
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};