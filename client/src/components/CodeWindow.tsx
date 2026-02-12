"use client";

import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

const codeSnippet = `const pluckDeep = key => obj => key.split('.').reduce((accum, key) => accum[key], obj)

const compose = (...fns) => res => fns.reduce((accum, next) => next(accum), res)

const unfold = (f, seed) => {
  const go = (f, seed, acc) => {
    const res = f(seed)
    return res ? go(f, res[1], acc.concat([res[0]])) : acc
  }
  return go(f, seed, [])
}`;

export function CodeWindow() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ 
        opacity: { duration: 0.5, delay: 0.2 },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      }}
      whileHover={{ scale: 1.02 }}
      className="relative w-full max-w-xl mx-auto rounded-lg shadow-2xl bg-[#1e1e1e] border border-white/5 overflow-hidden font-mono text-left"
    >
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground">functional.js</div>
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
            aria-label="Copy code"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative p-6 text-[13px] leading-relaxed text-[#d4d4d4]">
        <motion.pre 
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
            className="whitespace-pre-wrap break-words font-mono"
        >
          <motion.code variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}>
            <span className="text-[#c586c0]">const</span> <span className="text-[#dcdcaa]">pluckDeep</span> <span className="text-[#d4d4d4]">=</span> <span className="text-[#9cdcfe]">key</span> <span className="text-[#569cd6]">=&gt;</span> <span className="text-[#9cdcfe]">obj</span> <span className="text-[#569cd6]">=&gt;</span> <span className="text-[#9cdcfe]">key</span>.<span className="text-[#dcdcaa]">split</span>(<span className="text-[#ce9178]">'.'</span>).<span className="text-[#dcdcaa]">reduce</span>((<span className="text-[#9cdcfe]">accum</span>, <span className="text-[#9cdcfe]">key</span>) <span className="text-[#569cd6]">=&gt;</span> <span className="text-[#9cdcfe]">accum</span>[<span className="text-[#9cdcfe]">key</span>], <span className="text-[#9cdcfe]">obj</span>){'\n\n'}
          </motion.code>
          
          <motion.code variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}>
            <span className="text-[#c586c0]">const</span> <span className="text-[#dcdcaa]">compose</span> <span className="text-[#d4d4d4]">=</span> (...<span className="text-[#9cdcfe]">fns</span>) <span className="text-[#569cd6]">=&gt;</span> <span className="text-[#9cdcfe]">res</span> <span className="text-[#569cd6]">=&gt;</span> <span className="text-[#9cdcfe]">fns</span>.<span className="text-[#dcdcaa]">reduce</span>((<span className="text-[#9cdcfe]">accum</span>, <span className="text-[#9cdcfe]">next</span>) <span className="text-[#569cd6]">=&gt;</span> <span className="text-[#dcdcaa]">next</span>(<span className="text-[#9cdcfe]">accum</span>), <span className="text-[#9cdcfe]">res</span>){'\n\n'}
          </motion.code>

          <motion.code variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}>
            <span className="text-[#c586c0]">const</span> <span className="text-[#dcdcaa]">unfold</span> <span className="text-[#d4d4d4]">=</span> (<span className="text-[#9cdcfe]">f</span>, <span className="text-[#9cdcfe]">seed</span>) <span className="text-[#569cd6]">=&gt;</span> {`{`}{'\n'}
            {"  "}<span className="text-[#c586c0]">const</span> <span className="text-[#dcdcaa]">go</span> <span className="text-[#d4d4d4]">=</span> (<span className="text-[#9cdcfe]">f</span>, <span className="text-[#9cdcfe]">seed</span>, <span className="text-[#9cdcfe]">acc</span>) <span className="text-[#569cd6]">=&gt;</span> {`{`}{'\n'}
            {"    "}<span className="text-[#c586c0]">const</span> <span className="text-[#9cdcfe]">res</span> <span className="text-[#d4d4d4]">=</span> <span className="text-[#dcdcaa]">f</span>(<span className="text-[#9cdcfe]">seed</span>){'\n'}
            {"    "}<span className="text-[#c586c0]">return</span> <span className="text-[#9cdcfe]">res</span> ? <span className="text-[#dcdcaa]">go</span>(<span className="text-[#9cdcfe]">f</span>, <span className="text-[#9cdcfe]">res</span>[<span className="text-[#b5cea8]">1</span>], <span className="text-[#9cdcfe]">acc</span>.<span className="text-[#dcdcaa]">concat</span>([<span className="text-[#9cdcfe]">res</span>[<span className="text-[#b5cea8]">0</span>]])) : <span className="text-[#9cdcfe]">acc</span>{'\n'}
            {"  "}{`}`}{'\n'}
            {"  "}<span className="text-[#c586c0]">return</span> <span className="text-[#dcdcaa]">go</span>(<span className="text-[#9cdcfe]">f</span>, <span className="text-[#9cdcfe]">seed</span>, []){'\n'}
            {`}`}
          </motion.code>
        </motion.pre>
      </div>
    </motion.div>
  );
}
