
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CodeBlock({ node }: { node: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = node.textContent;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="relative group my-8">
      <div className="absolute top-3 right-4 flex items-center gap-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {node.attrs.language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all border border-slate-700/30"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="rounded-lg bg-[#0d0d0d] font-mono text-sm text-slate-300 border border-slate-800/80 my-0 relative p-4 overflow-x-auto">
        <code>
          <NodeViewContent />
        </code>
      </pre>
    </NodeViewWrapper>
  );
}
