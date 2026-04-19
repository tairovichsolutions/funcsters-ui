"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IceServerDto, WebRtcSignalType } from "../types";

/**
 * Vanilla RTCPeerConnection hook for 2-user audio + 1 Yjs DataChannel.
 *
 *   1. addTrack BEFORE createAnswer/createOffer. An OFFER that arrives
 *      during our getUserMedia is queued until setup finishes — otherwise
 *      createAnswer would reflect no local audio and produce recvonly
 *      SDP, resulting in one-way audio that never recovers.
 *   2. Mute via track.enabled. Intent is stored in a ref and re-applied
 *      to every newly-acquired stream so a click during permission-grant
 *      latency isn't dropped.
 *   3. Peer-refresh detection. A fresh mount sends a REINIT signal; any
 *      side still holding a connected pc rebuilds immediately instead of
 *      waiting for ICE to time out. Also covers the case where a stale
 *      pc receives an OFFER on a "connected" state (peer restarted with
 *      fresh SDP) — we tear down and rebuild, replaying the queued offer
 *      on the new pc.
 *   4. ICE candidates arriving before setRemoteDescription are queued
 *      and flushed once the remote description is applied.
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

  // Mute intent survives across pc rebuilds + the getUserMedia race.
  const mutedIntentRef = useRef<boolean>(false);

  // Offer received while current pc is non-fresh (peer refreshed), or
  // while our own setup hasn't completed addTrack yet. Replayed on the
  // pc once setup is complete.
  const pendingOfferRef = useRef<string | null>(null);

  // True only between addTrack and unmount/rebuild. OFFERs received
  // before this flips true are queued; processing before addTrack would
  // create a recvonly answer.
  const setupCompleteRef = useRef<boolean>(false);

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

  const flushPendingIce = useCallback(async (pc: RTCPeerConnection) => {
    const queued = pendingIceCandidatesRef.current.splice(0);
    for (const cand of queued) {
      try {
        await pc.addIceCandidate(cand);
      } catch (err) {
        // Candidates from a now-stale pc (different ufrag) legitimately
        // fail here — the fresh pc will receive fresh candidates over STOMP.
        console.warn("[webrtc] flush queued candidate failed", err);
      }
    }
  }, []);

  const processOffer = useCallback(
    async (pc: RTCPeerConnection, sdp: string) => {
      await pc.setRemoteDescription({ type: "offer", sdp });
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      if (answer.sdp) sendSignal("ANSWER", answer.sdp);
      await flushPendingIce(pc);
    },
    [sendSignal, flushPendingIce]
  );

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
      setupCompleteRef.current = false;

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
          // 4s grace — mobile networks briefly blip. If still disconnected
          // after that, assume the peer is gone and rebuild.
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

      // Announce our fresh pc to the peer immediately — before the slow
      // getUserMedia step — so the peer can start its own rebuild in
      // parallel if it's holding a stale pc.
      sendSignal("REINIT", "");

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
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // addTrack is done — safe to answer an OFFER now.
      setupCompleteRef.current = true;

      // Three possible paths:
      //   (a) an OFFER arrived during our setup → answer it on this pc.
      //   (b) initiator → create DataChannel + send first offer.
      //   (c) non-initiator with nothing queued → wait for an OFFER.
      const queuedOffer = pendingOfferRef.current;
      if (queuedOffer) {
        pendingOfferRef.current = null;
        try {
          await processOffer(pc, queuedOffer);
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
      setupCompleteRef.current = false;
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

  const receiveSignal = useCallback(
    (type: WebRtcSignalType, payload: string) => {
      (async () => {
        try {
          if (type === "REINIT") {
            // Peer just (re)mounted. Rebuild if our pc has already committed
            // to any prior handshake — i.e. anything that isn't a pristine
            // fresh pc (signalingState "stable" AND no remoteDescription
            // yet). This covers: a fully connected pc (normal refresh), a
            // pc sitting in ICE grace ("disconnected"), a failed pc, AND
            // the subtler stuck state where we already answered a previous
            // OFFER but ICE never completed (signalingState "have-local-
            // answer" with connectionState "connecting") — which is the
            // state that was making repeated-refresh sessions dead.
            const pc = pcRef.current;
            if (pc) {
              const isPristine =
                pc.signalingState === "stable" && pc.remoteDescription === null;
              if (!isPristine) triggerRebuild();
            }
            return;
          }

          if (type === "OFFER") {
            const pc = pcRef.current;
            if (!pc) {
              pendingOfferRef.current = payload;
              return;
            }
            // A fresh OFFER on an already-established pc means the peer
            // restarted. Rebuild and replay the offer on the new pc.
            const connState = pc.connectionState;
            if (connState === "connected" || connState === "failed" || connState === "disconnected") {
              triggerRebuild(payload);
              return;
            }
            // Setup (addTrack) hasn't finished yet — queue and let setup
            // pick it up after addTrack, so our answer isn't recvonly.
            if (!setupCompleteRef.current) {
              pendingOfferRef.current = payload;
              return;
            }
            // Stale-handshake guard: the ONLY pc state safe to apply a new
            // remote offer on directly is the pristine one (signalingState
            // "stable" AND no remoteDescription yet). Anything else means
            // we already committed to a previous OFFER/ANSWER exchange
            // that never finished — e.g. we sent an ANSWER and are now
            // stuck in "have-local-answer" waiting on an ICE that will
            // never complete because the peer refreshed. Calling
            // setRemoteDescription on such a pc throws InvalidStateError
            // and the try/catch would silently swallow it, leaving the
            // DataChannel permanently dead and producing exactly the
            // symmetric-divergence symptom we were seeing. Rebuild.
            if (pc.signalingState !== "stable" || pc.remoteDescription !== null) {
              triggerRebuild(payload);
              return;
            }
            await processOffer(pc, payload);
          } else if (type === "ICE_RESTART") {
            const pc = pcRef.current;
            if (!pc || !setupCompleteRef.current) return;
            await processOffer(pc, payload);
          } else if (type === "ANSWER") {
            const pc = pcRef.current;
            if (!pc) return;
            if (pc.signalingState === "stable") return;
            await pc.setRemoteDescription({ type: "answer", sdp: payload });
            await flushPendingIce(pc);
          } else if (type === "ICE_CANDIDATE") {
            const candidate = JSON.parse(payload) as RTCIceCandidateInit;
            const pc = pcRef.current;
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
    [processOffer, flushPendingIce, triggerRebuild]
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
