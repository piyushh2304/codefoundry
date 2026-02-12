
import StarterKit from "@tiptap/starter-kit";
import { Heading } from "@tiptap/extension-heading";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { mergeAttributes } from "@tiptap/core";
import { Placeholder } from "@tiptap/extension-placeholder";
import { BubbleMenu as BubbleMenuExtension } from "@tiptap/extension-bubble-menu";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlock from "./CodeBlock";

const lowlight = createLowlight(common);

export const defaultExtensions = [
    StarterKit.configure({
        codeBlock: false, // We'll use lowlight instead
        heading: false,
    }),

    Heading.configure({
        levels: [1, 2, 3],
    }).extend({
        addAttributes() {
            return {
                ...this.parent?.(),
                id: {
                    default: null,
                    parseHTML: element => element.getAttribute('id'),
                    renderHTML: attributes => {
                        return { id: attributes.id }
                    },
                },
            }
        },
        renderHTML({ node, HTMLAttributes }) {
            const level = node.attrs.level;
            const classes: Record<number, string> = {
                1: "text-4xl font-bold mt-6 mb-4 tracking-tight text-foreground",
                2: "text-2xl font-bold mt-8 mb-4 tracking-tight text-white border-b border-slate-800/50 pb-2 scroll-mt-24",
                3: "text-xl font-semibold mt-6 mb-3 text-slate-200 scroll-mt-24",
            };

            // Generate ID if not present
            if (!HTMLAttributes.id) {
                const text = node.textContent.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                HTMLAttributes.id = text;
            }

            return [
                `h${level}`,
                mergeAttributes(HTMLAttributes, { class: classes[level] }),
                0,
            ];
        },
    }),

    CodeBlockLowlight.configure({
        lowlight,
    }).extend({
        addNodeView() {
            return ReactNodeViewRenderer(CodeBlock)
        },
    }),

    Placeholder.configure({
        placeholder: ({ node }) => {
            if (node.type.name === "heading") {
                return `Heading ${node.attrs.level}`;
            }
            return "Start writing or paste code...";
        },
        includeChildren: true,
    }),
    BubbleMenuExtension,
];
