"use client";

import { Mic, MicOff, Wifi, WifiOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { editor as monacoEditor } from "monaco-editor";
import { CommunityGuidelinesModal } from "@/features/pair/components/CommunityGuidelinesModal";
import { LeaveSessionConfirm } from "@/features/pair/components/LeaveSessionConfirm";
import { SessionTimer } from "@/features/pair/components/SessionTimer";
import { useCurrentUser } from "@/features/pair/hooks/useCurrentUser";
import { useMyActiveSession } from "@/features/pair/hooks/usePairQueries";
import { usePairSession } from "@/features/pair/providers/PairSessionProvider";
import { MonacoCodeEditer } from "@/components/ui/monaco-editor";

/**
 * Active pair-programming session page.
 *
 * Orchestrates the full user experience:
 *   - Community guidelines modal for joiners (AWAITING_GUIDELINES)
 *   - Monaco editor bound to the shared Yjs doc
 *   - Hidden <audio> element playing the peer's WebRTC stream
 *   - Top bar: partner name, connection state, 45-min timer, mute, leave
 *   - Redirect to /pair/lobby after session ends
 *
 * Page-refresh safe (spec story 3.2): state is reconstructed from the server
 * via useMyActiveSession, and the timer is computed from the server-authoritative
 * endsAtEpochMs. The WebRTC peer connection is re-established on mount.
 */
export default function PairSessionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const sessionIdFromUrl = Number(params.id);

  const { data: currentUser } = useCurrentUser();
  const { isLoading: sessionLoading } = useMyActiveSession();
  const {
    session,
    connectionState,
    localMuted,
    remoteStream,
    sessionEndedReason,
    mute,
    unmute,
    leave,
    attachEditor,
  } = usePairSession();

  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [editorMounted, setEditorMounted] = useState(false);

  // Wire the editor ref through to the provider once it's mounted.
  useEffect(() => {
    if (!editorMounted) return;
    attachEditor(editorRef.current);
    return () => attachEditor(null);
  }, [editorMounted, attachEditor]);

  // Play the peer's audio stream.
  useEffect(() => {
    if (!audioRef.current) return;
    if (remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.srcObject = null;
    }
  }, [remoteStream]);

  // When the session ends (by either side leaving, cap, or grace expiry),
  // kick both peers back to the lobby with a message.
  useEffect(() => {
    if (session && session.status === "ENDED") {
      router.replace(`/pair/lobby?ended=${session.id}`);
    }
    if (sessionEndedReason && session?.status !== "ENDED") {
      // Remote peer ended — let the provider refetch and the effect above fire.
      setTimeout(() => router.replace(`/pair/lobby?ended=${session?.id ?? "0"}`), 300);
    }
  }, [session, sessionEndedReason, router]);

  // Redirect when arriving with no active session or a different session id.
  useEffect(() => {
    if (sessionLoading) return;
    if (!session) {
      // Query settled, no active session — kick back to lobby.
      router.replace("/pair/lobby");
      return;
    }
    if (session.id !== sessionIdFromUrl) {
      router.replace(`/pair/session/${session.id}`);
    }
  }, [sessionLoading, session, sessionIdFromUrl, router]);

  if (sessionLoading || !session) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-sm text-muted-foreground">
        {sessionLoading ? "Loading session…" : "No active session — redirecting…"}
      </div>
    );
  }

  const isJoiner = currentUser?.username === session.joinerUsername;
  const showGuidelines = isJoiner && session.status === "AWAITING_GUIDELINES";
  const partnerUsername = isJoiner ? session.hostUsername : session.joinerUsername;

  return (
    <div className="flex min-h-screen flex-col">
      {/* hidden audio element playing the peer's stream */}
      <audio ref={audioRef} autoPlay playsInline />

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <div className="text-xs text-muted-foreground">Pair programming with</div>
            <div className="font-semibold">@{partnerUsername}</div>
          </div>
          <span className="text-xs text-muted-foreground">on</span>
          <div className="text-sm font-medium">{session.challengeTitle}</div>
          <span className="hidden rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground md:inline-flex">
            {session.languageName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ConnectionBadge state={connectionState} />
          <SessionTimer endsAtEpochMs={session.endsAtEpochMs} />
          <button
            onClick={localMuted ? unmute : mute}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              localMuted
                ? "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
            }`}
          >
            {localMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {localMuted ? "Unmute" : "Mute"}
          </button>
          <LeaveSessionConfirm onConfirm={leave} disabled={session.status !== "ACTIVE"} />
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1">
        {session.status === "ACTIVE" ? (
          <MonacoCodeEditer
            editorRef={editorRef as React.MutableRefObject<unknown>}
            language={session.languageName.toLowerCase()}
            theme="vs-dark"
            onChange={() => {
              if (!editorMounted) setEditorMounted(true);
            }}
          />
        ) : (
          <div className="flex h-[80vh] items-center justify-center text-sm text-muted-foreground">
            {session.status === "AWAITING_GUIDELINES"
              ? "Waiting for both users to be ready…"
              : "Session ended."}
          </div>
        )}
      </main>

      {/* Guidelines modal for the joiner */}
      <CommunityGuidelinesModal
        open={showGuidelines}
        sessionId={session.id}
        onDecline={() => leave()}
      />
    </div>
  );
}

function ConnectionBadge({ state }: { state: RTCPeerConnectionState }) {
  const label =
    state === "connected"
      ? "Connected"
      : state === "connecting" || state === "new"
      ? "Connecting"
      : state === "disconnected"
      ? "Reconnecting"
      : state === "failed"
      ? "Failed"
      : "Closed";
  const online = state === "connected";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        online
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
      }`}
    >
      {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
      {label}
    </span>
  );
}
