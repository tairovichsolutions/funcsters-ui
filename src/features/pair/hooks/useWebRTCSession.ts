"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IceServerDto, WebRtcSignalType } from "../types";

/**
 * Vanilla RTCPeerConnection hook for 2-user audio + 1 Yjs DataChannel.
 * No helper libs (simple-peer/peerjs) — the bugs bashar hit (one-way audio,
 * mute reliability, stale ICE) live in exactly the code those libs hide.
 *
 * Pre-applied bug fixes from the bashar commit log:
 *   1. `addTrack` BEFORE `createOffer` (one-way audio fix)
 *   2. Mute via `replaceTrack(silentTrack)`, not `track.enabled = false`
 *   3. ICE restart on `iceConnectionState === "disconnected"` after a 4s grace
 *   4. visibilitychange/pagehide handlers for mobile backgrounding
 *   5. DataChannel created on initiator side; Yjs sync attached there
 *   6. iceServers fetched once per session (REST-HMAC creds, 1h TTL)
 */

export interface SignalSender {
  (type: WebRtcSignalType, payload: string): void;
}

export interface UseWebRTCSessionOptions {
  enabled: boolean;
  isInitiator: boolean;
  iceServers: IceServerDto[] | undefined;
  sendSignal: SignalSender;
  onDataChannel?: (dc: RTCDataChannel) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
}

export interface WebRTCSession {
  connectionState: RTCPeerConnectionState;
  localMuted: boolean;
  mute: () => void;
  unmute: () => void;
  receiveSignal: (type: WebRtcSignalType, payload: string) => void;
  restartIce: () => void;
}

const DISCONNECT_GRACE_MS = 4_000;

export function useWebRTCSession(opts: UseWebRTCSessionOptions): WebRTCSession {
  const {
    enabled,
    isInitiator,
    iceServers,
    sendSignal,
    onDataChannel,
    onRemoteStream,
    onConnectionStateChange,
  } = opts;

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const silentTrackRef = useRef<MediaStreamTrack | null>(null);
  const silentAudioCtxRef = useRef<AudioContext | null>(null);
  const disconnectTimerRef = useRef<number | null>(null);

  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("new");
  const [localMuted, setLocalMuted] = useState(false);

  // Build a silent audio track so mute/unmute can swap via replaceTrack.
  // Chrome/Safari both honor replaceTrack; `track.enabled = false` still
  // echoes on some codec paths (the bashar "audio echo" bug).
  const buildSilentTrack = useCallback((): MediaStreamTrack => {
    const ctx = new AudioContext();
    silentAudioCtxRef.current = ctx;
    const dst = ctx.createMediaStreamDestination();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(dst);
    osc.start();
    return dst.stream.getAudioTracks()[0];
  }, []);

  // Main connection lifecycle — rebuilds when iceServers become available.
  useEffect(() => {
    if (!enabled || !iceServers) return;

    let cancelled = false;

    const setup = async () => {
      const pc = new RTCPeerConnection({
        iceServers: iceServers.map((s) => ({
          urls: s.urls,
          ...(s.username ? { username: s.username } : {}),
          ...(s.credential ? { credential: s.credential } : {}),
        })),
        iceTransportPolicy: "all",
      });
      pcRef.current = pc;

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        setConnectionState(state);
        onConnectionStateChange?.(state);
      };

      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;
        if (state === "disconnected") {
          // 4s grace before ICE restart (mobile networks briefly blip).
          if (disconnectTimerRef.current != null) {
            window.clearTimeout(disconnectTimerRef.current);
          }
          disconnectTimerRef.current = window.setTimeout(() => {
            if (pcRef.current && pcRef.current.iceConnectionState === "disconnected") {
              restartIceInternal();
            }
          }, DISCONNECT_GRACE_MS);
        } else if (state === "connected" || state === "completed") {
          if (disconnectTimerRef.current != null) {
            window.clearTimeout(disconnectTimerRef.current);
            disconnectTimerRef.current = null;
          }
        } else if (state === "failed") {
          restartIceInternal();
        }
      };

      pc.onicecandidate = (ev) => {
        if (ev.candidate) {
          sendSignal("ICE_CANDIDATE", JSON.stringify(ev.candidate.toJSON()));
        }
      };

      pc.ontrack = (ev) => {
        if (ev.streams[0]) onRemoteStream?.(ev.streams[0]);
      };

      pc.ondatachannel = (ev) => {
        onDataChannel?.(ev.channel);
      };

      // 1. Acquire microphone
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch (err) {
        console.error("[webrtc] getUserMedia failed", err);
        return;
      }
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      localStreamRef.current = stream;

      // 2. CRITICAL: addTrack BEFORE createOffer (bashar one-way-audio fix).
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 3. Initiator creates the DataChannel + initial offer.
      //    Responder's ondatachannel fires when the offer arrives.
      if (isInitiator) {
        const dc = pc.createDataChannel("yjs", { ordered: true });
        onDataChannel?.(dc);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        if (offer.sdp) sendSignal("OFFER", offer.sdp);
      }
    };

    setup();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && pcRef.current) {
        // Foregrounding after backgrounding: force fresh ICE.
        if (
          pcRef.current.iceConnectionState === "disconnected" ||
          pcRef.current.iceConnectionState === "failed"
        ) {
          restartIceInternal();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (disconnectTimerRef.current != null) {
        window.clearTimeout(disconnectTimerRef.current);
        disconnectTimerRef.current = null;
      }
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      silentTrackRef.current?.stop();
      silentTrackRef.current = null;
      silentAudioCtxRef.current?.close().catch(() => {});
      silentAudioCtxRef.current = null;
      pcRef.current?.close();
      pcRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, iceServers, isInitiator]);

  const restartIceInternal = useCallback(() => {
    const pc = pcRef.current;
    if (!pc) return;
    if (!isInitiator) {
      // Only the initiator issues the restart offer; the other side will
      // receive it and answer. This avoids both peers racing.
      return;
    }
    pc.createOffer({ iceRestart: true })
      .then((offer) => pc.setLocalDescription(offer).then(() => offer))
      .then((offer) => {
        if (offer.sdp) sendSignal("ICE_RESTART", offer.sdp);
      })
      .catch((err) => console.error("[webrtc] ICE restart failed", err));
  }, [isInitiator, sendSignal]);

  const receiveSignal = useCallback(
    (type: WebRtcSignalType, payload: string) => {
      const pc = pcRef.current;
      if (!pc) return;

      (async () => {
        try {
          if (type === "OFFER" || type === "ICE_RESTART") {
            await pc.setRemoteDescription({ type: "offer", sdp: payload });
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            if (answer.sdp) sendSignal("ANSWER", answer.sdp);
          } else if (type === "ANSWER") {
            await pc.setRemoteDescription({ type: "answer", sdp: payload });
          } else if (type === "ICE_CANDIDATE") {
            const candidate = JSON.parse(payload);
            await pc.addIceCandidate(candidate);
          }
        } catch (err) {
          console.error("[webrtc] signal handler error", type, err);
        }
      })();
    },
    [sendSignal]
  );

  const mute = useCallback(() => {
    const pc = pcRef.current;
    const stream = localStreamRef.current;
    if (!pc || !stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;

    if (!silentTrackRef.current) {
      silentTrackRef.current = buildSilentTrack();
    }
    const sender = pc.getSenders().find((s) => s.track?.kind === "audio");
    sender?.replaceTrack(silentTrackRef.current).catch(() => {});
    setLocalMuted(true);
  }, [buildSilentTrack]);

  const unmute = useCallback(() => {
    const pc = pcRef.current;
    const stream = localStreamRef.current;
    if (!pc || !stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;
    const sender = pc.getSenders().find((s) => s.track?.kind === "audio");
    sender?.replaceTrack(audioTrack).catch(() => {});
    setLocalMuted(false);
  }, []);

  return {
    connectionState,
    localMuted,
    mute,
    unmute,
    receiveSignal,
    restartIce: restartIceInternal,
  };
}
