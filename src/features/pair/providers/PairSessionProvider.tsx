"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { editor as monacoEditor } from "monaco-editor";
import { useIceServers, useLeaveSession, useMyActiveSession } from "../hooks/usePairQueries";
import { useStompPair } from "../hooks/useStompPair";
import { useWebRTCSession } from "../hooks/useWebRTCSession";
import { useYjsMonaco } from "../hooks/useYjsMonaco";
import type {
  PairControlEvent,
  PairSessionDto,
  PairSignalMessage,
  WebRtcSignalType,
} from "../types";

/**
 * One-stop hook for a pair programming session. Internally:
 *   - Subscribes to /topic/pair/{sessionId}/control for lifecycle events
 *   - Subscribes to /topic/pair/{sessionId}/signal for WebRTC signaling
 *   - Runs useWebRTCSession for audio + 1 DataChannel
 *   - Runs useYjsMonaco for editor sync when a Monaco editor is attached
 *   - Exposes mute/unmute/leave and remote audio stream for the UI
 *
 * The host is the "initiator" — they create the RTCDataChannel and the
 * first SDP offer. The joiner's hook waits for the offer.
 */

interface PairSessionValue {
  session: PairSessionDto | null;
  connectionState: RTCPeerConnectionState;
  localMuted: boolean;
  remoteStream: MediaStream | null;
  sessionEndedReason: string | null;
  mute: () => void;
  unmute: () => void;
  leave: () => Promise<void>;
  attachEditor: (editor: monacoEditor.IStandaloneCodeEditor | null) => void;
  yjsReady: boolean;
}

const PairSessionContext = createContext<PairSessionValue | null>(null);

export function usePairSession() {
  const ctx = useContext(PairSessionContext);
  if (!ctx) {
    throw new Error("usePairSession must be used inside PairSessionProvider");
  }
  return ctx;
}

interface PairSessionProviderProps {
  children: React.ReactNode;
  /** The logged-in user's own username — used to decide host vs. joiner role. */
  currentUsername: string;
}

export function PairSessionProvider({ children, currentUsername }: PairSessionProviderProps) {
  const { data: session } = useMyActiveSession();
  const { data: iceServers } = useIceServers();
  const leaveMutation = useLeaveSession();

  const enabled = session != null && session.status !== "ENDED";
  const sessionId = session?.id ?? null;
  const isHost = session?.hostUsername === currentUsername;

  const stomp = useStompPair({ enabled });

  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [sessionEndedReason, setSessionEndedReason] = useState<string | null>(null);
  const [editor, setEditor] = useState<monacoEditor.IStandaloneCodeEditor | null>(null);

  // Subscribe to STOMP topics once connected + session known.
  useEffect(() => {
    if (!stomp.connected || !sessionId) return;

    const controlSub = stomp.subscribe(`/topic/pair/${sessionId}/control`, (msg) => {
      try {
        const event = JSON.parse(msg.body) as PairControlEvent;
        if (event.type === "SESSION_ENDED" || event.type === "PEER_LEFT") {
          setSessionEndedReason(event.reason ?? event.type);
        }
      } catch {
        /* ignore malformed */
      }
    });

    return () => {
      controlSub?.unsubscribe();
    };
  }, [stomp, stomp.connected, sessionId]);

  // WebRTC signal relay wiring
  const sendSignal = useCallback(
    (type: WebRtcSignalType, payload: string) => {
      if (!sessionId) return;
      const msg: PairSignalMessage = { type, payload, from: currentUsername };
      stomp.publish(`/app/pair/${sessionId}/signal`, msg);
    },
    [stomp, sessionId, currentUsername]
  );

  const rtc = useWebRTCSession({
    enabled: enabled && stomp.connected,
    isInitiator: isHost,
    iceServers: iceServers,
    sendSignal,
    onDataChannel: setDataChannel,
    onRemoteStream: setRemoteStream,
  });

  // Subscribe to signaling topic + route to receiveSignal
  const receiveSignalRef = useRef(rtc.receiveSignal);
  receiveSignalRef.current = rtc.receiveSignal;

  useEffect(() => {
    if (!stomp.connected || !sessionId) return;

    const signalSub = stomp.subscribe(`/topic/pair/${sessionId}/signal`, (msg) => {
      try {
        const signal = JSON.parse(msg.body) as PairSignalMessage;
        // Don't process our own signals echoed back.
        if (signal.from === currentUsername) return;
        receiveSignalRef.current(signal.type, signal.payload);
      } catch {
        /* ignore */
      }
    });

    return () => {
      signalSub?.unsubscribe();
    };
  }, [stomp, stomp.connected, sessionId, currentUsername]);

  // Yjs editor sync — only when the UI has attached a Monaco instance.
  const yjs = useYjsMonaco({
    editor,
    dataChannel,
    username: currentUsername,
  });

  const leave = useCallback(async () => {
    if (sessionId == null) return;
    await leaveMutation.mutateAsync(sessionId);
  }, [sessionId, leaveMutation]);

  const attachEditor = useCallback(
    (e: monacoEditor.IStandaloneCodeEditor | null) => setEditor(e),
    []
  );

  const value = useMemo<PairSessionValue>(
    () => ({
      session: session ?? null,
      connectionState: rtc.connectionState,
      localMuted: rtc.localMuted,
      remoteStream,
      sessionEndedReason,
      mute: rtc.mute,
      unmute: rtc.unmute,
      leave,
      attachEditor,
      yjsReady: yjs.ready,
    }),
    [session, rtc.connectionState, rtc.localMuted, rtc.mute, rtc.unmute, remoteStream, sessionEndedReason, leave, attachEditor, yjs.ready]
  );

  return <PairSessionContext.Provider value={value}>{children}</PairSessionContext.Provider>;
}
