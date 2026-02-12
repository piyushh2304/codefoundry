"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Database, LayoutTemplate, Bot, Zap, FileCode2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Parallax } from "@/components/Parallax";

const features = [
  {
    icon: ShieldCheck,
    title: "Auth Ready",
    desc: "JWT, OAuth, & Session middleware pre-configured.",
    color: "text-blue-500",
    gradient: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-500/20"
  },
  {
    icon: Database,
    title: "Backend Structured",
    desc: "Controllers, Services, Models - clean architecture.",
    color: "text-cyan-500",
    gradient: "from-cyan-500/10 to-blue-500/10",
    border: "border-cyan-500/20"
  },
  {
    icon: LayoutTemplate,
    title: "Frontend Forms",
    desc: "React Hook Form + Zod validation ready to go.",
    color: "text-violet-500",
    gradient: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-500/20"
  },
  {
    icon: Bot,
    title: "AI Generated",
    desc: "Missing a snippet? AI writes it in seconds.",
    color: "text-fuchsia-500",
    gradient: "from-fuchsia-500/10 to-pink-500/10",
    border: "border-fuchsia-500/20"
  },
  {
    icon: Zap,
    title: "Redis Cached",
    desc: "Ultra-fast response times with built-in caching.",
    color: "text-sky-500",
    gradient: "from-sky-500/10 to-blue-500/10",
    border: "border-sky-500/20"
  },
  {
    icon: FileCode2,
    title: "Type Safe",
    desc: "Built with TypeScript for robust, error-free code.",
    color: "text-teal-500",
    gradient: "from-teal-500/10 to-emerald-500/10",
    border: "border-teal-500/20"
  }
];

export function CoreFeatures() {
  return (
    <section className="py-24 bg-muted/5 border-y border-border" id="features">
      <div className="w-[95%] max-w-[2400px] mx-auto px-6 md:px-12">
        <Parallax offset={30}>
            <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Everything you need to <span className="text-primary">ship</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We handle the boring stuff so you can focus on building your product.
            </p>
            </div>
        </Parallax>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Parallax key={index} offset={index % 2 === 0 ? 20 : 40} className="h-full">
                <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
                >
                <Card className={`
                    h-full bg-gradient-to-br ${feature.gradient} 
                    border ${feature.border} hover:border-opacity-50 
                    transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                `}>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className={`p-2 rounded-lg bg-background/50 backdrop-blur-sm ${feature.color}`}>
                            <feature.icon className="w-6 h-6" />
                        </div>
                        {feature.title}
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground">
                        {feature.desc}
                    </p>
                    </CardContent>
                </Card>
                </motion.div>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
