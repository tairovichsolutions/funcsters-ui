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
import { usePairSession } from "@/features/pair/providers/PairSessionProvider";
import { CommunityGuidelinesModal } from "@/features/pair/components/CommunityGuidelinesModal";
import { useCurrentUser } from "@/features/pair/hooks/useCurrentUser";

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
    setCurrentCode,
  } = useLanguageImplementations();

  const challengeId = chId;
  const { mutateAsync: runCode, isPending } = useRunCode();
  const { mutateAsync: submitCode, isPending: submitPending } = useSubmitCode();
  const { data: userData } = useGetUserProfile();
  const isAuthenticated = userData?.data?.authenticated || false;
  const { openModal } = useAuthModal();

  // ---- Pair-programming wiring ------------------------------------------
  // When a session is ACTIVE on this challenge, attach the editor to the
  // shared Yjs doc so both users see each other's edits. Detach when the
  // session ends.
  const pair = usePairSession();
  const { data: currentUser } = useCurrentUser();
  const pairSession = pair.session;
  const isJoiner = pairSession?.joinerUsername === currentUser?.username;
  const showGuidelines =
    isJoiner && pairSession?.status === "AWAITING_GUIDELINES";

  useEffect(() => {
    if (pairSession?.status !== "ACTIVE") {
      pair.attachEditor(null);
      return;
    }
    let cancelled = false;
    const tryAttach = () => {
      if (cancelled) return;
      if (editorRef.current) {
        pair.attachEditor(editorRef.current);
      } else {
        window.setTimeout(tryAttach, 150);
      }
    };
    tryAttach();
    return () => {
      cancelled = true;
      pair.attachEditor(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairSession?.status, pairSession?.id]);

  useEffect(() => {
    if (!languageId || !challengeId) return;

    const saved = getSavedCode(languageId, String(challengeId));

    if (saved !== null) {
      setCode(saved);
      setCurrentCode(saved);
    } else if (starterCode) {
      setCode(starterCode);
      setCurrentCode(starterCode);
    } else {
      setCode("");
      setCurrentCode("");
    }
  }, [languageId, challengeId, starterCode, setCurrentCode]);

  const handleCodeChange = useCallback((value?: string) => {
    setCode(value ?? "");
    setCurrentCode(value ?? "");
  }, [setCurrentCode]);

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

      const responseData = res?.data?.data;
      if (!responseData) return;

      const status = responseData?.status;
      const failed = responseData?.testRunSummary?.failed ?? 0;

      if (status === 'succeeded' && failed === 0 && responseData?.testRunSummary) {
        const shouldShowXp = !viewedSolution && userProgress !== "COMPLETED";
        setEarnedXp(shouldShowXp ? xpCount : 0);

        if (shouldShowXp || showSuccessModal) {
          setSubmitModalOpen(true);
        }
        setResults(responseData);
        updateUserProgress?.(languageId, "COMPLETED");
      } else {
        setResults(responseData);
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
    <div className="h-full w-full shrink-0 dark:bg-[#1C1F22]">
      <PanelGroup direction="vertical" className="w-full h-full gap-1.5">
        <Panel minSize={40} defaultSize={65}>
          <div className="border border-border-soft rounded-xl overflow-hidden h-full w-full flex flex-col bg-background dark:bg-[#1C1F22]">
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

              {/* Community guidelines gate — shown to the joiner on the
                  challenge page when their session is AWAITING_GUIDELINES.
                  On Agree: transitions session to ACTIVE and the editor
                  auto-attaches to Yjs. On Decline: ends the session. */}
              <CommunityGuidelinesModal
                open={!!showGuidelines}
                sessionId={pairSession?.id ?? null}
                onDecline={() => pair.leave()}
              />
            </div>

            <div className="flex-1 min-h-0 ">
              {/* Two editor modes:
                  - Solo: `value={code}` (controlled) — React state owns content.
                  - Pair-session: `defaultValue={code}` (uncontrolled) — Yjs
                    owns content so CRDT updates aren't overwritten by React
                    re-renders. `key` forces a clean Monaco remount on mode
                    switch so the editor picks up the right props. */}
              {pairSession?.status === "ACTIVE" ? (
                <MonacoCodeEditer
                  key={`pair-${pairSession.id}`}
                  defaultValue={code}
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
              ) : (
                <MonacoCodeEditer
                  key="solo"
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
              )}
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
