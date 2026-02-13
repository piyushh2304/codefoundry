
import StarterKit from "@tiptap/starter-kit";
import { Heading } from "@tiptap/extension-heading";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { mergeAttributes } from "@tiptap/core";
import { Placeholder } from "@tiptap/extension-placeholder";
import { BubbleMenu as BubbleMenuExtension } from "@tiptap/extension-bubble-menu";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
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
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors cursor-pointer",
        },
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TaskList.configure({
        HTMLAttributes: {
            class: "not-prose pl-2",
        },
    }),
    TaskItem.configure({
        HTMLAttributes: {
            class: "flex items-start my-4",
        },
        nested: true,
    }),
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Image.configure({
        HTMLAttributes: {
            class: "rounded-lg border border-slate-800",
        },
    }),
    BubbleMenuExtension,
];
