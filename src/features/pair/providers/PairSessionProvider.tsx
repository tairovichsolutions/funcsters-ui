"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { editor as monacoEditor } from "monaco-editor";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useIceServers, useLeaveSession, useMyActiveSession, pairKeys } from "../hooks/usePairQueries";
import { useStompPair } from "../hooks/useStompPair";
import { useWebRTCSession } from "../hooks/useWebRTCSession";
import { clearYjsPersistence, useYjsMonaco } from "../hooks/useYjsMonaco";
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
}

export function PairSessionProvider({ children }: PairSessionProviderProps) {
  const { data: currentUser } = useCurrentUser();
  const currentUsername = currentUser?.username ?? "";
  const { data: session } = useMyActiveSession();
  const queryClient = useQueryClient();
  
  // Only fetch ICE creds when a session is actually active (or imminent).
  // Avoids 401 noise on the landing/challenges page for logged-out visitors.
  const iceServersNeeded = session != null && session.status !== "ENDED";
  const { data: iceServers } = useIceServers(iceServersNeeded);
  const leaveMutation = useLeaveSession();

  // STOMP should connect as long as the user is logged in. This allows us
  // to receive real-time global notifications (like join accepts) without polling.
  const stomp = useStompPair({ enabled: !!currentUser });

  // WebRTC peer connection only activates when both peers have committed
  // (status === ACTIVE). Activating in AWAITING_GUIDELINES would make the host
  // publish an OFFER that the joiner's not-yet-created pc cannot consume.
  const webrtcEnabled = session != null && session.status === "ACTIVE";
  const sessionId = session?.id ?? null;
  const isHost = session?.hostUsername === currentUsername;

  // Global user events listener: instantly invalidates React Query data when
  // someone wants to join you, or when your join request is accepted, allowing
  // us to disable background polling.
  useEffect(() => {
    if (!stomp.connected || !currentUsername) return;
    
    // User-specific events (e.g. JOIN_ACCEPTED, INCOMING_JOIN).
    // Spring's convertAndSendToUser resolves by Principal.getName() which
    // returns the USERNAME, not the numeric userId.
    const subUser = stomp.subscribe(`/user/${currentUsername}/queue/pair/events`, () => {
      queryClient.invalidateQueries({ queryKey: pairKeys.all });
    });

    // Global lobby updates (count changed, new requests)
    const subLobby = stomp.subscribe(`/topic/pair/lobby-update`, () => {
      // Invalidate lobby-related queries
      queryClient.invalidateQueries({ queryKey: pairKeys.lobbyCount() });
      queryClient.invalidateQueries({ queryKey: pairKeys.all }); 
    });

    return () => {
      subUser?.unsubscribe();
      subLobby?.unsubscribe();
    };
  }, [stomp.connected, currentUsername, queryClient, stomp]);

  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [sessionEndedReason, setSessionEndedReason] = useState<string | null>(null);
  const [editor, setEditor] = useState<monacoEditor.IStandaloneCodeEditor | null>(null);
  // True only after BOTH STOMP topic subscriptions (control + signal) are
  // actually installed on the broker. WebRTC is gated on this — if we
  // activated on stomp.connected alone, the signal subscription effect
  // would race with useWebRTCSession's REINIT: on refresh, the peer
  // receives REINIT, rebuilds, and publishes a fresh OFFER. STOMP topics
  // are ephemeral (non-durable), so an OFFER arriving before the refreshed
  // tab has finished SUBSCRIBEing is silently dropped by the broker. The
  // handshake then stalls forever and the session appears dead even
  // though the backend still reports ACTIVE. See bug: host refresh kills
  // session, joiner refresh fails after N attempts.
  const [subscriptionsReady, setSubscriptionsReady] = useState(false);

  // receiveSignal identity rotates on every WebRTC rebuild; we read it
  // through a ref so the subscription effect below doesn't churn.
  const receiveSignalRef = useRef<((type: WebRtcSignalType, payload: string) => void) | null>(null);

  // Install control + signal subscriptions ATOMICALLY, BEFORE WebRTC can
  // send anything. Both must be live on the broker before subscriptionsReady
  // flips true. The explicit setState on success is the whole point of this
  // effect — we intentionally signal to the WebRTC hook (gated on
  // subscriptionsReady) that the inbound topics are live. The cleanup
  // setState(false) on teardown is the matching pair.
  useEffect(() => {
    if (!stomp.connected || !sessionId) return;

    const controlSub = stomp.subscribe(`/topic/pair/${sessionId}/control`, (msg) => {
      try {
        const event = JSON.parse(msg.body) as PairControlEvent;
        if (event.type === "SESSION_ENDED" || event.type === "PEER_LEFT") {
          setSessionEndedReason(event.reason ?? event.type);
          
          // CRITICAL FIX: Instantly invalidate the React Query cache so the
          // useMyActiveSession hook realizes the session is over, causing
          // the session UI (mic, code editor) to disappear immediately.
          queryClient.invalidateQueries({ queryKey: pairKeys.all });

          // Session is over for both sides — wipe persisted Yjs state so
          // the editor doesn't replay stale content if this tab ever joins
          // another session with the same id.
          clearYjsPersistence(sessionId).catch(() => {});
        }
      } catch {
        /* ignore malformed */
      }
    });

    const signalSub = stomp.subscribe(`/topic/pair/${sessionId}/signal`, (msg) => {
      try {
        const signal = JSON.parse(msg.body) as PairSignalMessage;
        // Don't process our own signals echoed back.
        if (signal.from === currentUsername) return;
        receiveSignalRef.current?.(signal.type, signal.payload);
      } catch {
        /* ignore */
      }
    });

    // subscribe() returns null if the client dropped between connected=true
    // and this callback — leave subscriptionsReady false and let the next
    // stomp.connected flip retry.
    if (!controlSub || !signalSub) {
      controlSub?.unsubscribe();
      signalSub?.unsubscribe();
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubscriptionsReady(true);

    return () => {
      setSubscriptionsReady(false);
      controlSub.unsubscribe();
      signalSub.unsubscribe();
    };
  }, [stomp, stomp.connected, sessionId, currentUsername]);

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
    enabled: webrtcEnabled && stomp.connected && subscriptionsReady,
    isInitiator: isHost,
    iceServers: iceServers,
    sendSignal,
    onDataChannel: setDataChannel,
    onRemoteStream: setRemoteStream,
  });

  // Keep receiveSignalRef pointed at the latest handler without forcing
  // the subscription effect above to re-run. Assigning the ref from an
  // effect (not during render) satisfies react-hooks/refs.
  useEffect(() => {
    receiveSignalRef.current = rtc.receiveSignal;
  }, [rtc.receiveSignal]);

  // Yjs editor sync — only when the UI has attached a Monaco instance.
  // isInitiator gates the initial Y.Doc seed so we don't duplicate the
  // starter code (see useYjsMonaco docstring). sessionId namespaces the
  // IndexedDB persistence so refreshing mid-session restores the
  // collaborative doc instead of starting fresh.
  const yjs = useYjsMonaco({
    editor,
    dataChannel,
    sessionId,
    username: currentUsername,
    isInitiator: isHost,
  });

  const leave = useCallback(async () => {
    if (sessionId == null) return;
    const id = sessionId;
    await leaveMutation.mutateAsync(id);
    // Purge the session's IndexedDB doc so a future session with the
    // same id (unlikely, but possible during local dev) doesn't inherit
    // stale content, and so browser storage doesn't grow unbounded.
    await clearYjsPersistence(id);
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

  return (
    <PairSessionContext.Provider value={value}>
      {/* Global hidden audio element to play the remote peer's audio stream.
          Attached once at the provider level so it persists across page
          navigation — moving it inside a route would kill audio on route
          change. */}
      <RemoteAudio stream={remoteStream} />
      {children}
    </PairSessionContext.Provider>
  );
}

function RemoteAudio({ stream }: { stream: MediaStream | null }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    } else {
      el.srcObject = null;
    }
  }, [stream]);
  return <audio ref={ref} autoPlay playsInline style={{ display: "none" }} />;
}
