import { useEffect, useRef, useState } from "react";
import { pairingStore } from "@/mock/pairingStore";

interface SignalMessage {
  senderId: string;
  type: "offer" | "answer" | "candidate" | "request-offer";
  data: any;
}

/**
 * Manages WebRTC peer connection for audio chat AND the YJS DataChannel.
 * 
 * IMPORTANT: `sessionStarted` MUST be passed as a parameter so it's part of
 * the effect dependency array. Previously it was read from pairingStore.state
 * inside the effect but NOT in the deps, meaning the effect would fire once
 * (when sessionId changed) before sessionStarted was true, return early, and
 * then NEVER re-fire when sessionStarted became true.
 */
export function useAudioCall(
  sessionId: number | string | null,
  isMuted: boolean,
  sessionStarted: boolean
) {
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const signalSubRef = useRef<any>(null);
  
  // Create a unique ID for this client so it ignores its own signals
  const myId = useRef(Math.random().toString(36).substring(7)).current;

  // Track if we've successfully established so we don't spam signaling
  const offerReceived = useRef(false);

  // Component-level persistent audio element to prevent garbage collection issues
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !remoteAudioRef.current) {
        remoteAudioRef.current = new Audio();
        remoteAudioRef.current.autoplay = true;
    }
  }, []);

  // Handle local mute
  useEffect(() => {
    if (localStream.current) {
        localStream.current.getAudioTracks().forEach(t => t.enabled = !isMuted);
    }
    // Also update current senders for robustness
    if (peerConnection.current) {
        peerConnection.current.getSenders().forEach(sender => {
            if (sender.track && sender.track.kind === 'audio') {
                sender.track.enabled = !isMuted;
            }
        });
    }
  }, [isMuted]);

  useEffect(() => {
    let isCancelled = false;

    if (!sessionId || !sessionStarted) {
      console.log("[useAudioCall] Waiting for session start...");
      return;
    }
    
    const client = pairingStore.getClient();
    if (!client || !client.connected) return;

    console.log("[useAudioCall] Initializing WebRTC P2P for session", sessionId);

    const startConnection = async () => {
      // ─── 1. Get Microphone FIRST ───
      // We must have the track ready before creating the offer/answer 
      // so the SDP includes the media section.
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        console.log("[WebRTC] Microphone access granted");
      } catch (e: any) {
        console.warn("[WebRTC] Microphone blocked or missing:", e.message);
      }

      if (isCancelled) {
          stream?.getTracks().forEach(t => t.stop());
          return;
      }
      localStream.current = stream;

      // ─── 2. Fetch Relay Credentials ───
      const credentials = await pairingStore.getTurnCredentials();
      if (isCancelled) return;

      // ─── 3. Create PeerConnection ───
      const pc = new RTCPeerConnection({
        iceServers: credentials.iceServers,
        iceTransportPolicy: 'all', 
      });
      peerConnection.current = pc;

      // ─── 4. Add Tracks before any signaling ───
      if (stream) {
          stream.getAudioTracks().forEach(t => t.enabled = !isMuted);
          stream.getTracks().forEach((track) => pc.addTrack(track, stream!));
      }

      // ─── 5. DataChannel Setup ───
      if (pairingStore.state.mode === "broadcast") {
        const dc = pc.createDataChannel("yjs", { ordered: true });
        dc.binaryType = "arraybuffer";
        pairingStore.setDataChannel(dc);
      } else {
        pc.ondatachannel = (event) => {
            if (event.channel.label === "yjs") {
                const dc = event.channel;
                dc.binaryType = "arraybuffer";
                pairingStore.setDataChannel(dc);
            }
        };
      }

      // ─── 6. Handlers ───
      pc.onicecandidate = (event) => {
        if (event.candidate && client.connected) {
          client.publish({
            destination: `/app/session/${sessionId}/signal`,
            body: JSON.stringify({ senderId: myId, type: "candidate", data: event.candidate }),
          });
        }
      };

      pc.ontrack = (event) => {
          console.log("[WebRTC] Received remote track:", event.track.kind);
          if (event.streams && event.streams[0] && remoteAudioRef.current) {
              setRemoteStream(event.streams[0]);
              remoteAudioRef.current.srcObject = event.streams[0];
              remoteAudioRef.current.play().catch(err => {
                  console.warn("[WebRTC] Autoplay blocked - requires interaction", err);
              });
          }
      };

      pc.oniceconnectionstatechange = () => {
        console.log("[WebRTC] ICE state:", pc.iceConnectionState);
        if (pc.iceConnectionState === "failed") {
            pc.restartIce();
        }
      };

      // ─── 7. Signaling ───
      const pendingCandidates: any[] = [];
      signalSubRef.current = client.subscribe(`/topic/session/${sessionId}/signal`, async (msg) => {
        try {
          const signal: SignalMessage = JSON.parse(msg.body);
          if (signal.senderId === myId) return;

          if (signal.type === "offer") {
             if (isCancelled) return;
             offerReceived.current = true;
             await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
             for (const c of pendingCandidates) await pc.addIceCandidate(new RTCIceCandidate(c));
             pendingCandidates.length = 0;
             const answer = await pc.createAnswer();
             await pc.setLocalDescription(answer);
             client.publish({
                 destination: `/app/session/${sessionId}/signal`,
                 body: JSON.stringify({ senderId: myId, type: "answer", data: answer }),
             });
          } else if (signal.type === "answer") {
             if (isCancelled) return;
             await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
             for (const c of pendingCandidates) await pc.addIceCandidate(new RTCIceCandidate(c));
             pendingCandidates.length = 0;
          } else if (signal.type === "candidate") {
             if (isCancelled) return;
             if (!pc.remoteDescription) {
                 pendingCandidates.push(signal.data);
             } else {
                 await pc.addIceCandidate(new RTCIceCandidate(signal.data));
             }
          } else if (signal.type === "request-offer" && pairingStore.state.mode === "broadcast") {
             if (isCancelled || pc.signalingState !== "stable") return;
             const offer = await pc.createOffer();
             await pc.setLocalDescription(offer);
             client.publish({
                 destination: `/app/session/${sessionId}/signal`,
                 body: JSON.stringify({ senderId: myId, type: "offer", data: offer }),
             });
          }
        } catch (e) {
          console.error("[WebRTC] Signaling error", e);
        }
      });

      // ─── 8. Initiate ───
      if (pairingStore.state.mode === "broadcast") {
          // Host sends initial offer
          setTimeout(async () => {
              if (isCancelled || pc.signalingState !== "stable") return;
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              client.publish({
                  destination: `/app/session/${sessionId}/signal`,
                  body: JSON.stringify({ senderId: myId, type: "offer", data: offer })
              });
              console.log("[WebRTC] Host offer sent");
          }, 1000);
      } else {
          // Joiner requests offer if they haven't seen one
          const reqInterval = setInterval(() => {
              if (isCancelled || offerReceived.current || pc.iceConnectionState === "connected") {
                  clearInterval(reqInterval);
                  return;
              }
              if (client.connected) {
                  client.publish({
                      destination: `/app/session/${sessionId}/signal`,
                      body: JSON.stringify({ senderId: myId, type: "request-offer", data: null })
                  });
              }
          }, 2000);
      }
    };

    startConnection();

    return () => {
      console.log("[useAudioCall] Session cleanup...");
      isCancelled = true;
      if (remoteAudioRef.current) {
          remoteAudioRef.current.pause();
          remoteAudioRef.current.srcObject = null;
      }
      if (localStream.current) localStream.current.getTracks().forEach(t => t.stop());
      if (peerConnection.current) peerConnection.current.close();
      if (signalSubRef.current) signalSubRef.current.unsubscribe();
      pairingStore.setDataChannel(null);
    };
  }, [sessionId, sessionStarted]);

  return { remoteStream };
}
