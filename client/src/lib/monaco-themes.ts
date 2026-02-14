import { loader } from "@monaco-editor/react";

export const monacoThemes: Record<string, string> = {
    dracula: "Dracula",
    monokai: "Monokai",
    nightOwl: "Night Owl",
    cobalt: "Cobalt",
    oceanicNext: "Oceanic Next",
    githubDark: "GitHub Dark",
    tokyoNight: "Tokyo Night",
    nord: "Nord",
    solarizedDark: "Solarized Dark",
    tomorrowNight: "Tomorrow Night",
    birdsOfParadise: "Birds of Paradise",
    blackboard: "Blackboard",
    twilight: "Twilight",
};

export const defineThemes = async (monaco: any) => {
    if (!monaco && loader) {
        monaco = await loader.init();
    }

    const [
        dracula,
        monokai,
        nightOwl,
        cobalt,
        oceanicNext,
        githubDark,
        nord,
        solarizedDark,
        tomorrowNight,
        birdsOfParadise,
        blackboard,
        twilight,
    ] = await Promise.all([
        // @ts-ignore
        import("monaco-themes/themes/Dracula.json"),
        // @ts-ignore
        import("monaco-themes/themes/Monokai.json"),
        // @ts-ignore
        import("monaco-themes/themes/Night Owl.json"),
        // @ts-ignore
        import("monaco-themes/themes/Cobalt.json"),
        // @ts-ignore
        import("monaco-themes/themes/Oceanic Next.json"),
        // @ts-ignore
        import("monaco-themes/themes/GitHub Dark.json"),
        // @ts-ignore
        import("monaco-themes/themes/Nord.json"),
        // @ts-ignore
        import("monaco-themes/themes/Solarized-dark.json"),
        // @ts-ignore
        import("monaco-themes/themes/Tomorrow-Night.json"),
        // @ts-ignore
        import("monaco-themes/themes/Birds of Paradise.json"),
        // @ts-ignore
        import("monaco-themes/themes/Blackboard.json"),
        // @ts-ignore
        import("monaco-themes/themes/Twilight.json"),
    ]);

    monaco.editor.defineTheme("dracula", dracula);
    monaco.editor.defineTheme("monokai", monokai);
    monaco.editor.defineTheme("nightOwl", nightOwl);
    monaco.editor.defineTheme("cobalt", cobalt);
    monaco.editor.defineTheme("oceanicNext", oceanicNext);
    monaco.editor.defineTheme("githubDark", githubDark);
    monaco.editor.defineTheme("nord", nord);
    monaco.editor.defineTheme("solarizedDark", solarizedDark);
    monaco.editor.defineTheme("tomorrowNight", tomorrowNight);
    monaco.editor.defineTheme("birdsOfParadise", birdsOfParadise);
    monaco.editor.defineTheme("blackboard", blackboard);
    monaco.editor.defineTheme("twilight", twilight);

    // Custom Tokyo Night Theme
    monaco.editor.defineTheme("tokyoNight", {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "", foreground: "a9b1d6", background: "1a1b26" },
            { token: "string", foreground: "9ece6a" },
            { token: "keyword", foreground: "bb9af7" },
            { token: "comment", foreground: "565f89", fontStyle: "italic" },
            { token: "number", foreground: "ff9e64" },
            { token: "type", foreground: "2ac3de" },
            { token: "function", foreground: "7aa2f7" },
        ],
        colors: {
            "editor.background": "#1a1b26",
            "editor.foreground": "#a9b1d6",
            "editorCursor.foreground": "#c0caf5",
            "editor.lineHighlightBackground": "#1e202e",
            "editorLineNumber.foreground": "#3b4261",
            "editor.selectionBackground": "#33467c",
        },
    });
};
