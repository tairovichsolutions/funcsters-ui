/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CodeEditorHeader,
  TestResultsPanel,
} from "@/containers/CodePlayground";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import {
  EditorTheme,
  useEditorSettings,
} from "@/context/EditorSettingsContext";
import { useRunCode } from "@/mutations/useRunCode";
import { useSubmitCode } from "@/mutations/useSubmitCode";
import { RunCodeApiResponse } from "@/types/run-code-type";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import { MonacoCodeEditer } from "@/components/ui/monaco-editor";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useLanguageImplementations } from "@/context/languageImplementationsContext";
import { SolutionSubmittedModal } from "@/containers/CodePlayground/SolutionSubmittedModal";

const LOCAL_STORAGE_KEY = "funcsters-code-snippets";

type Snippet = {
  code: string;
  languageId: number;
  challengeId: string;
};

const readSnippets = (): Snippet[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Snippet[]) : [];
  } catch {
    return [];
  }
};

const getSavedCode = (
  languageId: number | null,
  challengeId: string | null,
) => {
  if (!languageId || !challengeId) return null;
  const snippets = readSnippets();
  const found = snippets.find(
    (s) => s.languageId === languageId && s.challengeId === challengeId,
  );
  return found?.code ?? null;
};

const saveSnippetOnRun = (
  languageId: number | null,
  challengeId: string | null,
  code: string,
) => {
  if (!languageId || !challengeId || typeof window === "undefined") return;

  const snippets = readSnippets();
  const idx = snippets.findIndex(
    (s) => s.languageId === languageId && s.challengeId === challengeId,
  );

  if (idx === -1) {
    snippets.push({ languageId, challengeId, code });
  } else {
    snippets[idx] = { ...snippets[idx], code };
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snippets));
};

export const CodePlaygroundScreen = memo(() => {
  const { resolvedTheme } = useTheme();
  const [code, setCode] = useState("");
  const [results, setResults] = useState<RunCodeApiResponse | null>(null);
  const [earnedXp, setEarnedXp] = useState<number | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const editorRef = useRef<any | null>(null);
  const { settings } = useEditorSettings();
  const {
    xpCount,
    languageId,
    starterCode,
    userProgress,
    viewedSolution,
    showSuccessModal,
    selectedLanguage,
    updateUserProgress,
    challengeId: chId,
  } = useLanguageImplementations();

  const challengeId = chId;
  const { mutateAsync: runCode, isPending } = useRunCode();
  const { mutateAsync: submitCode, isPending: submitPending } = useSubmitCode();
  const { data: userData } = useGetUserProfile();
  const isAuthenticated = userData?.data?.authenticated || false;
  const { openModal } = useAuthModal();

  useEffect(() => {
    if (!languageId || !challengeId) return;

    const saved = getSavedCode(languageId, String(challengeId));

    if (saved !== null) {
      setCode(saved);
    } else if (starterCode) {
      setCode(starterCode);
    } else {
      setCode("");
    }
  }, [languageId, challengeId, starterCode]);

  const handleCodeChange = useCallback((value?: string) => {
    setCode(value ?? "");
  }, []);

  const handleFormatCode = useCallback(() => {
    const editor = editorRef.current;
    const action = editor?.getAction?.("editor.action.formatDocument");
    action?.run();
  }, []);

  useEffect(() => {
    setResults(null);
  }, [languageId, challengeId]);

  const handleRunCode = useCallback(async () => {
    if (!isAuthenticated) {
      openModal("loginRequiredModal");
      return;
    }
    if (!languageId || !challengeId) return;

    try {
      const payload = {
        userCode: code,
        languageId,
        challengeId,
      };

      saveSnippetOnRun(languageId, String(challengeId), code);

      const res = (await runCode(payload)) as { data: { data: RunCodeApiResponse } };
      setResults(res.data.data);
    } catch (err: any) {
      setResults(null);
      toast.error(err?.message || "Something went wrong while running code");
    }
  }, [code, languageId, challengeId, runCode, isAuthenticated, openModal]);

  const handleSubmitCode = useCallback(async () => {
    if (!isAuthenticated) {
      openModal("loginRequiredModal");
      return;
    }

    if (!languageId || !challengeId) return;

    try {
      const payload = {
        userCode: code,
        languageId,
        challengeId,
      };

      setEarnedXp(xpCount);
      const res = await submitCode(payload);

      if (res?.status !== 200) {
        toast.error("Something went wrong while submitting");
        return;
      }

      const failed = res?.data?.data?.testRunSummary?.failed ?? 0;

      if (failed === 0) {
        const shouldShowXp = !viewedSolution && userProgress !== "COMPLETED";
        setEarnedXp(shouldShowXp ? xpCount : 0);

        if (shouldShowXp || showSuccessModal) {
          setSubmitModalOpen(true);
        }
        setResults(null);
        setResults(res.data.data);
        updateUserProgress?.(languageId, "COMPLETED");
      } else {
        setResults(null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Unexpected error while submitting");
    }
  }, [
    code,
    languageId,
    viewedSolution,
    challengeId,
    submitCode,
    updateUserProgress,
    xpCount,
    userProgress,
    isAuthenticated,
    openModal,
    showSuccessModal,
  ]);

  const websiteTheme: EditorTheme =
    resolvedTheme === "dark" ? "vs-dark" : "light";

  const editorTheme: EditorTheme =
    settings.themeMode === "system" ? websiteTheme : settings.theme;

  return (
    <div className="h-full w-full shrink-0">
      <PanelGroup direction="vertical" className="w-full h-full gap-1.5">
        <Panel minSize={40} defaultSize={65}>
          <div className="border border-border-soft rounded-xl overflow-hidden h-full w-full flex flex-col bg-background">
            <div className="px-4 flex items-center justify-between border-b border-border-soft h-16 overflow-hidden">
              <CodeEditorHeader
                code={code}
                isPending={isPending}
                handleRunCode={handleRunCode}
                submitCodePending={submitPending}
                handleSubmitCode={handleSubmitCode}
                handleFormatCode={handleFormatCode}
                allTestPass={(results?.testRunSummary?.passed ?? 0) >= 1}
              />

              {submitModalOpen && (
                <SolutionSubmittedModal
                  open={submitModalOpen}
                  onClose={() => setSubmitModalOpen(false)}
                  xpCount={earnedXp}
                />
              )}
            </div>

            <div className="flex-1 min-h-0">
              <MonacoCodeEditer
                value={code}
                theme={editorTheme}
                editorRef={editorRef}
                className="w-full h-full"
                tabSize={settings.tabSize}
                onChange={handleCodeChange}
                language={selectedLanguage}
                fontSize={settings.fontSize}
                wordWrap={settings.wordWrap}
                onRunShortcut={handleRunCode}
                keyBinding={settings.keyBinding}
                onSubmitShortcut={handleSubmitCode}
                autoComplete={settings.autoComplete}
              />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-full rounded-full shrink-0 h-1.5 cursor-row-resize bg-transparent hover:bg-primary/40 data-resize-handle-active:bg-primary/60 transition-colors duration-150" />

        <Panel minSize={10} defaultSize={35}>
          <div className="w-full h-full">
            <TestResultsPanel results={results} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
});
