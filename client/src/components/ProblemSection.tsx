"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Parallax } from "@/components/Parallax";

const painPoints = [
  "Rewriting authentication logic",
  "Rebuilding backend folder structures",
  "Copying half-broken snippets from blogs",
  "Wasting hours on setup instead of features"
];

export function ProblemSection() {
  return (
    <section className="py-24 bg-muted/5 border-y border-border relative overflow-hidden">
        {/* Background Gradients - Subtle Blue/Purple */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

      <div className="w-[95%] max-w-[2400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Parallax offset={30}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Every project starts <span className="text-muted-foreground line-through decoration-red-500/50 decoration-4">the same way</span>...
              </h2>
              <p className="text-xl text-muted-foreground">
                You have a brilliant idea, but then you spend the first week:
              </p>
            </motion.div>
          </Parallax>

          <div className="grid md:grid-cols-2 gap-6">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Parallax offset={index % 2 === 0 ? 20 : 40} className="h-full">
                  <div className="h-full p-6 bg-background/40 backdrop-blur-sm border border-white/5 hover:border-red-500/20 rounded-xl flex items-start gap-4 transition-all hover:bg-red-500/5 group">
                    <div className="mt-1 bg-red-500/10 p-2 rounded-full group-hover:bg-red-500/20 transition-colors">
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground/90">{point}</h3>
                    </div>
                  </div>
                </Parallax>
              </motion.div>
            ))}
          </div>

          <Parallax offset={20}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-16 text-center"
            >
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">This is what CodeFoundry fixes.</span>
                </div>
            </motion.div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
