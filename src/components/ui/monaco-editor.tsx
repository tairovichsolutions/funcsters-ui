/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { cn } from "@/lib";
import Editor from "@monaco-editor/react";
import { EditorKeyBinding } from "@/context/EditorSettingsContext";

function useMonacoShortcuts(params: {
  keyBinding: EditorKeyBinding;
  onRunShortcut?: () => void;
  onSubmitShortcut?: () => void;
  editorRef: React.MutableRefObject<any | null>;
  monacoRef: React.MutableRefObject<any | null>;
}) {
  const { keyBinding, onRunShortcut, onSubmitShortcut, editorRef, monacoRef } =
    params;

  React.useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    let runKeybinding: number | null = null;
    let submitKeybinding: number | null = null;

    switch (keyBinding) {
      case "vscode":
        runKeybinding = monaco.KeyMod.CtrlCmd | monaco.KeyCode.Comma;
        submitKeybinding = monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter;
        break;

      case "sublime":
        runKeybinding = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB;
        submitKeybinding =
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyB;
        break;

      case "vim":
        runKeybinding = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR;
        submitKeybinding =
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyR;
        break;
    }

    if (onRunShortcut && runKeybinding !== null) {
      editor.addCommand(runKeybinding, () => onRunShortcut());
    }

    if (onSubmitShortcut && submitKeybinding !== null) {
      editor.addCommand(submitKeybinding, () => onSubmitShortcut());
    }

    editor.addAction({
      id: "format-document-shortcut",
      label: "Format Document",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
      ],
      run: (ed: any) => {
        const formatAction = ed.getAction("editor.action.formatDocument");
        return formatAction?.run();
      },
    });
  }, [keyBinding, onRunShortcut, onSubmitShortcut, editorRef, monacoRef]);
}

type Props = {
  value?: string;
  tabSize?: number;
  fontSize?: number;
  language?: string;
  className?: string;
  defaultValue?: string;
  autoComplete?: boolean;
  wordWrap?: "on" | "off";
  height?: number | string;
  onRunShortcut?: () => void;
  onSubmitShortcut?: () => void;
  options?: Record<string, any>;
  keyBinding?: EditorKeyBinding;
  onChange?: (value: string) => void;
  theme?: "light" | "vs-dark" | "hc-black";
  editorRef?: React.MutableRefObject<any | null>;
};

const DARK_THEME_NAME = "custom-dark";

export const MonacoCodeEditer = React.memo(
  ({
    value,
    editorRef,
    options,
    onChange,
    tabSize = 2,
    defaultValue,
    onRunShortcut,
    fontSize = 14,
    className = "",
    wordWrap = "on",
    onSubmitShortcut,
    theme = "vs-dark",
    autoComplete = true,
    keyBinding = "vscode",
    language = "javascript",
  }: Props) => {
    const internalEditorRef = React.useRef<any | null>(null);
    const monacoRef = React.useRef<any | null>(null);

    React.useEffect(() => {
      if (editorRef) {
        editorRef.current = internalEditorRef.current;
      }
    }, [editorRef]);

    useMonacoShortcuts({
      keyBinding,
      onRunShortcut,
      onSubmitShortcut,
      editorRef: internalEditorRef,
      monacoRef,
    });

    React.useEffect(() => {
      const monaco = monacoRef.current;
      if (!monaco) return;

      monaco.editor.defineTheme(DARK_THEME_NAME, {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: { "editor.background": "#0D1A26" },
      });

      monaco.editor.setTheme(theme === "vs-dark" ? DARK_THEME_NAME : theme);
    }, [theme]);

    return (
      <div className={cn("h-full w-full", className)}>
        <Editor
          height="100%"
          language={language}
          value={value}
          defaultValue={defaultValue}
          onChange={(v) => onChange?.(v || "")}
          theme={theme === "vs-dark" ? DARK_THEME_NAME : theme}
          options={{
            fontSize,
            wordWrap,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            tabSize,
            detectIndentation: false,
            lineNumbersMinChars: 3,
            lineDecorationsWidth: 0,
            padding: { top: 15, bottom: 10 },
            overviewRulerBorder: false,
            renderLineHighlight: "line",
            glyphMargin: false,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            suggestOnTriggerCharacters: autoComplete,
            quickSuggestions: autoComplete,
            parameterHints: { enabled: autoComplete },
            ...options,
          }}
          onMount={(editor, monaco) => {
            internalEditorRef.current = editor;
            monacoRef.current = monaco;

            if (editorRef) {
              editorRef.current = editor;
            }

            monaco.editor.defineTheme(DARK_THEME_NAME, {
              base: "vs-dark",
              inherit: true,
              rules: [],
              colors: {
                "editor.background": "#0D1A26",
              },
            });

            monaco.editor.setTheme(
              theme === "vs-dark" ? DARK_THEME_NAME : theme,
            );
          }}
        />
      </div>
    );
  },
);
