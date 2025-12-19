"use client";

import * as React from "react";

export type EditorTheme = "vs-dark" | "light" | "hc-black";
export type EditorKeyBinding = "default" | "vscode" | "sublime" | "vim";

export type EditorSettings = {
  theme: EditorTheme;
  fontSize: number;
  tabSize: number;
  wordWrap: "on" | "off";
  autoComplete: boolean;
  keyBinding: EditorKeyBinding;
};

type EditorSettingsContextValue = {
  settings: EditorSettings;
  setTheme: (theme: EditorTheme) => void;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setTabSize: (size: number) => void;
  setWordWrap: (value: "on" | "off") => void;
  setAutoComplete: (value: boolean) => void;
  setKeyBinding: (value: EditorKeyBinding) => void;
  resetSettings: () => void;
};

const STORAGE_KEY = "editor:settings:v1";

const DEFAULT_SETTINGS: EditorSettings = {
  theme: "light",
  fontSize: 14,
  tabSize: 2,
  wordWrap: "on",
  autoComplete: true,
  keyBinding: "default",
};

function detectSystemTheme(): EditorTheme {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "vs-dark" : "light";
}

function readSettingsFromStorage(): EditorSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {
        ...DEFAULT_SETTINGS,
        theme: detectSystemTheme(),
      };
    }

    const parsed = JSON.parse(raw) as Partial<EditorSettings>;

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      theme: (parsed.theme as EditorTheme | undefined) ?? detectSystemTheme(),
    };
  } catch {
    return {
      ...DEFAULT_SETTINGS,
      theme: detectSystemTheme(),
    };
  }
}

const EditorSettingsContext =
  React.createContext<EditorSettingsContextValue | null>(null);

export function EditorSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = React.useState<EditorSettings>(() =>
    readSettingsFromStorage()
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const value: EditorSettingsContextValue = {
    settings,
    setTheme: (theme) => {
      setSettings((prev) => ({ ...prev, theme }));
    },
    setFontSize: (size) => {
      const clamped = Math.max(10, Math.min(36, size));
      setSettings((prev) => ({ ...prev, fontSize: clamped }));
    },
    increaseFontSize: () => {
      setSettings((prev) => ({
        ...prev,
        fontSize: Math.min(25, prev.fontSize + 1),
      }));
    },
    decreaseFontSize: () => {
      setSettings((prev) => ({
        ...prev,
        fontSize: Math.max(10, prev.fontSize - 1),
      }));
    },
    setTabSize: (size) => {
      const clamped = Math.max(1, Math.min(8, size));
      setSettings((prev) => ({ ...prev, tabSize: clamped }));
    },
    setWordWrap: (value) => {
      setSettings((prev) => ({ ...prev, wordWrap: value }));
    },
    setAutoComplete: (value) => {
      setSettings((prev) => ({ ...prev, autoComplete: value }));
    },
    setKeyBinding: (value) => {
      setSettings((prev) => ({ ...prev, keyBinding: value }));
    },
    resetSettings: () => {
      setSettings({
        ...DEFAULT_SETTINGS,
        theme: detectSystemTheme(),
      });
    },
  };

  return (
    <EditorSettingsContext.Provider value={value}>
      {children}
    </EditorSettingsContext.Provider>
  );
}

export function useEditorSettings(): EditorSettingsContextValue {
  const ctx = React.useContext(EditorSettingsContext);

  if (!ctx) {
    throw new Error(
      "useEditorSettings must be used inside <EditorSettingsProvider>"
    );
  }

  return ctx;
}
