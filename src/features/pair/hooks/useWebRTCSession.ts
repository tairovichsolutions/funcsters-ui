"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IceServerDto, WebRtcSignalType } from "../types";

/**
 * Vanilla RTCPeerConnection hook for 2-user audio + 1 Yjs DataChannel.
 * No helper libs (simple-peer/peerjs) — the bugs bashar hit (one-way audio,
 * mute reliability, stale ICE) live in exactly the code those libs hide.
 *
 *   1. `addTrack` BEFORE `createOffer` (one-way audio fix)
 *   2. Mute via `track.enabled = false` — simpler and 100% reliable across
 *      Chrome/Safari/Firefox. The prior `replaceTrack(silentTrack)` approach
 *      silently failed when the sender wasn't ready yet (race between user
 *      click and getUserMedia resolve), leaving the UI muted but the mic
 *      still broadcasting.
 *   3. Mute intent is stored in a ref and re-applied each time a fresh
 *      stream is acquired, so a click during setup isn't dropped.
 *   4. Rebuild the PC when the peer restarts (browser refresh mid-session):
 *      detecting either an OFFER on an already-connected PC, or an
 *      ICE/connection "failed" state, we increment a rebuild nonce that
 *      tears down + recreates the PC fresh. Pending offers are replayed
 *      against the new PC so the non-initiator side answers correctly.
 *   5. ICE candidates that arrive pre-setRemoteDescription are queued and
 *      flushed once the remote description is applied.
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
  const disconnectTimerRef = useRef<number | null>(null);
  const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  // Mute intent survives across pc rebuilds + the getUserMedia race. Every
  // time a fresh local stream is acquired we apply `!mutedIntentRef.current`
  // to its audio track(s).
  const mutedIntentRef = useRef<boolean>(false);

  // Offer received while current pc is non-fresh (peer refreshed). Replayed
  // on the next pc after rebuild completes.
  const pendingOfferRef = useRef<string | null>(null);

  // Bump this to force a full pc rebuild (cleanup + setup).
  const [rebuildNonce, setRebuildNonce] = useState(0);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("new");
  const [localMuted, setLocalMuted] = useState(false);

  const applyMuteIntentToStream = useCallback((stream: MediaStream) => {
    for (const track of stream.getAudioTracks()) {
      track.enabled = !mutedIntentRef.current;
    }
  }, []);

  const triggerRebuild = useCallback((pendingOffer?: string) => {
    if (pendingOffer) pendingOfferRef.current = pendingOffer;
    setRebuildNonce((n) => n + 1);
  }, []);

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
          if (disconnectTimerRef.current != null) {
            window.clearTimeout(disconnectTimerRef.current);
          }
          // 4s grace — mobile networks briefly blip on handoff. If still
          // disconnected after that, assume the peer is gone and rebuild.
          disconnectTimerRef.current = window.setTimeout(() => {
            if (pcRef.current === pc && pc.iceConnectionState === "disconnected") {
              triggerRebuild();
            }
          }, DISCONNECT_GRACE_MS);
        } else if (state === "connected" || state === "completed") {
          if (disconnectTimerRef.current != null) {
            window.clearTimeout(disconnectTimerRef.current);
            disconnectTimerRef.current = null;
          }
        } else if (state === "failed") {
          // A peer refresh usually lands here — the stale pc can't recover,
          // a fresh one can.
          if (pcRef.current === pc) triggerRebuild();
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

      // 1. Acquire microphone + apply any pre-existing mute intent.
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch (err) {
        console.error("[webrtc] getUserMedia failed", err);
        return;
      }
      if (cancelled || pcRef.current !== pc) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      localStreamRef.current = stream;
      applyMuteIntentToStream(stream);

      // 2. addTrack BEFORE createOffer/createAnswer so the SDP reflects
      //    the outgoing audio direction (not recvonly).
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 3. Three possible paths at this point:
      //    (a) Rebuilt non-initiator with an offer queued from the peer's
      //        fresh connection → answer it on the new pc.
      //    (b) Initiator → create the DataChannel + send the first offer.
      //    (c) Non-initiator with no queued offer → wait for one to arrive.
      const queuedOffer = pendingOfferRef.current;
      if (queuedOffer) {
        pendingOfferRef.current = null;
        try {
          await pc.setRemoteDescription({ type: "offer", sdp: queuedOffer });
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          if (answer.sdp) sendSignal("ANSWER", answer.sdp);
          await flushPendingIce(pc);
        } catch (err) {
          console.error("[webrtc] queued offer replay failed", err);
        }
      } else if (isInitiator) {
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
        if (
          pcRef.current.iceConnectionState === "disconnected" ||
          pcRef.current.iceConnectionState === "failed"
        ) {
          triggerRebuild();
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
      pendingIceCandidatesRef.current = [];
      pcRef.current?.close();
      pcRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, iceServers, isInitiator, rebuildNonce]);

  const flushPendingIce = async (pc: RTCPeerConnection) => {
    const queued = pendingIceCandidatesRef.current.splice(0);
    for (const cand of queued) {
      try {
        await pc.addIceCandidate(cand);
      } catch (err) {
        console.warn("[webrtc] flush queued candidate failed", err);
      }
    }
  };

  const receiveSignal = useCallback(
    (type: WebRtcSignalType, payload: string) => {
      const pc = pcRef.current;

      (async () => {
        try {
          if (type === "OFFER") {
            if (!pc) {
              // pc not ready yet (we're mid-rebuild). Queue for replay.
              pendingOfferRef.current = payload;
              return;
            }
            // An OFFER on an already-established pc means the peer restarted
            // (e.g. browser refresh). Tear down our stale pc and answer on
            // a fresh one.
            const state = pc.connectionState;
            if (state === "connected" || state === "failed" || state === "disconnected") {
              triggerRebuild(payload);
              return;
            }
            await pc.setRemoteDescription({ type: "offer", sdp: payload });
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            if (answer.sdp) sendSignal("ANSWER", answer.sdp);
            await flushPendingIce(pc);
          } else if (type === "ICE_RESTART") {
            if (!pc) return;
            await pc.setRemoteDescription({ type: "offer", sdp: payload });
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            if (answer.sdp) sendSignal("ANSWER", answer.sdp);
            await flushPendingIce(pc);
          } else if (type === "ANSWER") {
            if (!pc) return;
            if (pc.signalingState === "stable") {
              // Stale answer for a pc we already tore down. Ignore.
              return;
            }
            await pc.setRemoteDescription({ type: "answer", sdp: payload });
            await flushPendingIce(pc);
          } else if (type === "ICE_CANDIDATE") {
            const candidate = JSON.parse(payload) as RTCIceCandidateInit;
            if (pc && pc.remoteDescription) {
              await pc.addIceCandidate(candidate);
            } else {
              pendingIceCandidatesRef.current.push(candidate);
            }
          }
        } catch (err) {
          console.error("[webrtc] signal handler error", type, err);
        }
      })();
    },
    [sendSignal, triggerRebuild]
  );

  const mute = useCallback(() => {
    mutedIntentRef.current = true;
    const stream = localStreamRef.current;
    if (stream) applyMuteIntentToStream(stream);
    setLocalMuted(true);
  }, [applyMuteIntentToStream]);

  const unmute = useCallback(() => {
    mutedIntentRef.current = false;
    const stream = localStreamRef.current;
    if (stream) applyMuteIntentToStream(stream);
    setLocalMuted(false);
  }, [applyMuteIntentToStream]);

  return {
    connectionState,
    localMuted,
    mute,
    unmute,
    receiveSignal,
  };
}
