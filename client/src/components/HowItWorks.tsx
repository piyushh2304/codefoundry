"use client";

import { motion } from "framer-motion";
import { Search, Zap, Rocket } from "lucide-react";
import { Parallax } from "@/components/Parallax";

const steps = [
  {
    icon: Search,
    title: "1. Search",
    description: "Browse our library of pro boilerplates or specific components.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    icon: Zap,
    title: "2. Generate",
    description: "Use an existing template, or let our AI write what you need instantly.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20"
  },
  {
    icon: Rocket,
    title: "3. Ship",
    description: "Copy, paste, and deploy. Save hours of recurring setup time.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="how-it-works">
      <div className="w-[95%] max-w-[2400px] mx-auto px-6 md:px-12">
        <Parallax offset={30}>
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
            >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                No complex CLI tools. No signups for MVP. Just code.
            </p>
            </motion.div>
        </Parallax>

        <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-violet-500/20" />

          {steps.map((step, index) => (
            <Parallax key={index} offset={index * 15 + 10} className="h-full">
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative h-full"
                >
                <div className={`
                    h-full p-8 rounded-2xl bg-background border ${step.border} 
                    hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                    flex flex-col items-center text-center group
                `}>
                    <div className={`
                        w-16 h-16 rounded-2xl ${step.bg} ${step.color} 
                        flex items-center justify-center mb-6 text-3xl
                        group-hover:rotate-6 transition-transform
                    `}>
                        <step.icon className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                    </p>
                </div>
                </motion.div>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
