"use client";

export type LanguageIconConfig = {
  label: string;
  iconName: string;
};

export const LANGUAGE_ICON_MAP: Record<string, LanguageIconConfig> = {
  javascript: {
    label: "JavaScript",
    iconName: "logos:javascript",
  },
  typescript: {
    label: "TypeScript",
    iconName: "logos:typescript-icon",
  },
  java: {
    label: "Java",
    iconName: "logos:java",
  },
  python: {
    label: "Python",
    iconName: "logos:python",
  },
  c: {
    label: "C",
    iconName: "vscode-icons:file-type-c",
  },
  cpp: {
    label: "C++",
    iconName: "vscode-icons:file-type-cpp3",
  },
  csharp: {
    label: "C#",
    iconName: "logos:c-sharp",
  },
  php: {
    label: "PHP",
    iconName: "logos:php",
  },
  ruby: {
    label: "Ruby",
    iconName: "logos:ruby",
  },
  go: {
    label: "Go",
    iconName: "logos:go",
  },
  rust: {
    label: "Rust",
    iconName: "logos:rust",
  },
  kotlin: {
    label: "Kotlin",
    iconName: "logos:kotlin-icon",
  },
  swift: {
    label: "Swift",
    iconName: "logos:swift",
  },
  dart: {
    label: "Dart",
    iconName: "logos:dart",
  },
  r: {
    label: "R",
    iconName: "logos:r-lang",
  },
  html: {
    label: "HTML",
    iconName: "logos:html-5",
  },
  css: {
    label: "CSS",
    iconName: "logos:css-3",
  },
  sql: {
    label: "SQL",
    iconName: "vscode-icons:file-type-sql",
  },
  shell: {
    label: "Shell",
    iconName: "logos:bash-icon",
  },
  lua: {
    label: "Lua",
    iconName: "logos:lua",
  },
};

export const prettifyLanguageName = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
