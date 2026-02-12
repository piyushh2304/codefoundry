import { EditorRoot, EditorContent, EditorBubble, EditorBubbleItem, useEditor } from "novel";
import { defaultExtensions } from "./extensions";
import { useMemo } from "react";
import { Code, Type } from "lucide-react";
import "tippy.js/dist/tippy.css";
import "./syntax.css";


interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  documentId?: string;
  readOnly?: boolean;
}

const ensureValidDoc = (content: any) => {
    if (!content) return { type: "doc", content: [] };
    
    // If it's already a JSON Tiptap document
    if (typeof content === 'object' && content.type === "doc") return content;

    if (typeof content === 'string') {
        // Try parsing as JSON first
        try {
            const parsed = JSON.parse(content);
            if (parsed.type === "doc") return parsed;
        } catch (e) {
            // Check for markdown-style code blocks
            if (content.includes('```')) {
                const parts = content.split(/(```[\s\S]*?```)/g);
                const nodes = parts.map(part => {
                    const match = part.match(/```(\w+)?\s*([\s\S]*?)```/);
                    if (match) {
                        return {
                            type: "codeBlock",
                            attrs: { language: match[1] || "javascript" },
                            content: match[2] ? [{ type: "text", text: match[2].trim() }] : []
                        };
                    } else if (part.trim()) {
                        return {
                            type: "paragraph",
                            content: [{ type: "text", text: part.trim() }]
                        };
                    }
                    return null;
                }).filter(node => node !== null);

                return { type: "doc", content: nodes };
            }

            // Fallback: Check if the whole string is likely code (old heuristic)
            const isCode = /[{}[\]()=;]|import |const |function |var |export |npm |yarn |pnpm /.test(content) || content.includes('\n');
            
            if (isCode) {
                return {
                    type: "doc",
                    content: [
                        {
                            type: "codeBlock",
                            attrs: { language: "javascript" },
                            content: [{ type: "text", text: content }]
                        }
                    ]
                };
            }

            return {
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: content }]
                    }
                ]
            };
        }
    }
    
    return { type: "doc", content: [] };
};

const BubbleMenuContent = () => {
    const { editor } = useEditor();
    if (!editor) return null;

    return (
        <EditorBubble 
            tippyOptions={{ duration: 100 }}
            shouldShow={({ editor }) => {
                const { from, to } = editor.state.selection;
                // Only show if there's an actual selection (not just cursor) and editor is focused
                return from !== to && editor.isFocused;
            }}
            className="flex items-center gap-1 bg-[#1a1a1a] border border-white/10 rounded-lg p-1 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-200"
        >
            <EditorBubbleItem 
                onSelect={(editor) => {
                    if (editor.isActive('codeBlock')) {
                        editor.chain().focus().toggleCodeBlock().run();
                    } else {
                        const { from, to } = editor.state.selection;
                        const text = editor.state.doc.textBetween(from, to, "\n");
                        editor.chain().focus()
                            .deleteSelection()
                            .insertContent({
                                type: 'codeBlock',
                                content: text ? [{ type: 'text', text }] : []
                            })
                            .run();
                    }
                }}
            >
                <div className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-all cursor-pointer whitespace-nowrap">
                    {editor.isActive('codeBlock') ? (
                        <>
                            <Type size={14} className="text-primary" />
                            <span>Change to Text</span>
                        </>
                    ) : (
                        <>
                            <Code size={14} className="text-primary" />
                            <span>Change to Code</span>
                        </>
                    )}
                </div>
            </EditorBubbleItem>
        </EditorBubble>
    );
};

const EditorView = ({ 
    onUpdate, 
    extensions, 
    readOnly, 
    initialContent 
}: { 
    onUpdate: (editor: any) => void, 
    extensions: any[], 
    readOnly?: boolean, 
    initialContent?: string 
}) => {
    return (
        <div 
            className={`relative w-full max-w-none transition-all ${
                readOnly 
                ? 'bg-transparent' 
                : 'bg-[#0d0d0d] rounded-xl border border-white/10 p-8 shadow-2xl'
            }`}
        >
             <EditorContent
                initialContent={ensureValidDoc(initialContent)}
                extensions={extensions}
                className="outline-none" 
                editorProps={{
                     attributes: {
                         class: `prose prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:p-0 focus:outline-none max-w-full ${readOnly ? 'prose-lg' : 'prose-base'}`,
                         spellcheck: 'false',
                     },
                     handlePaste: (view, event) => {
                        const text = event.clipboardData?.getData('text/plain');
                        if (!text) return false;

                        // Heuristic for code detection
                        const isCode = /[{}[\]()=;]|import |const |function |var |export |npm |yarn |pnpm /.test(text) || (text.includes('\n') && text.length > 20);
                        
                        // If it looks like code and we're not currently inside a code block
                        if (isCode && !view.state.selection.$from.parent.type.name.includes('codeBlock')) {
                            const { schema } = view.state;
                            
                            // Simple auto-language detection
                            const detectLanguage = (code: string) => {
                                if (code.includes('import ') && code.includes('from ')) return 'typescript';
                                if (code.includes('def ') || code.includes('import pandas')) return 'python';
                                if (code.includes('<html>') || code.includes('</div>')) return 'html';
                                if (code.includes('{') && (code.includes('margin:') || code.includes('padding:'))) return 'css';
                                if (code.includes('SELECT ') && code.includes('FROM ')) return 'sql';
                                if (code.startsWith('npm ') || code.startsWith('yarn ') || code.startsWith('git ')) return 'bash';
                                return 'javascript'; // Default
                            };

                            const lang = detectLanguage(text);
                            const node = schema.nodes.codeBlock.create({ language: lang }, schema.text(text));
                            const transaction = view.state.tr.replaceSelectionWith(node);
                            view.dispatch(transaction);
                            return true; // Handled
                        }
                        
                        return false; // Let default paste handle it
                     }
                }}
                onUpdate={({ editor }) => onUpdate(editor)}
                editable={!readOnly}
             >
                <BubbleMenuContent />
             </EditorContent>
        </div>
    );
}

export default function Editor({ onChange, initialContent, readOnly = false }: EditorProps) {
  
  const extensions = useMemo(() => {
      return [...defaultExtensions];
  }, []);

  const handleUpdate = (editor: any) => {
      if (readOnly) return;
      const json = editor.getJSON();
      onChange(JSON.stringify(json));
  };

  return (
    <EditorRoot>
       <EditorView 
            onUpdate={handleUpdate} 
            extensions={extensions} 
            readOnly={readOnly}
            initialContent={initialContent}
       />
    </EditorRoot>
  )
}
