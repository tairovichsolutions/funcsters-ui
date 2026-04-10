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

    // All three conditions must be true for WebRTC to start
    if (!sessionId || !sessionStarted) {
      console.log("[useAudioCall] Skipping — sessionId:", sessionId, "sessionStarted:", sessionStarted);
      return;
    }
    
    const client = pairingStore.getClient();
    if (!client || !client.connected) {
        console.warn("[useAudioCall] STOMP client not connected, skipping audio call init");
        return;
    }

    console.log("[useAudioCall] Starting WebRTC setup for session", sessionId, "mode:", pairingStore.state.mode);

    // Audio element ref for the remote stream to prevent echos and ghost plays
    const remoteAudio = new Audio();
    remoteAudio.autoplay = true;

    const startConnection = async () => {
      // ─── 1. Fetch dynamic TURN relay credentials ───
      const credentials = await pairingStore.getTurnCredentials();
      if (isCancelled) return;

      console.log("[WebRTC] ICE servers config:", JSON.stringify(credentials.iceServers));

      // ─── 2. Create RTCPeerConnection with relay support ───
      const pc = new RTCPeerConnection({
        iceServers: credentials.iceServers,
        iceTransportPolicy: 'all', // Ensure we use relay if needed
      });
      peerConnection.current = pc;

      // ─── 3. Setup DataChannel ───
      if (pairingStore.state.mode === "broadcast") {
        const dc = pc.createDataChannel("yjs", { ordered: true });
        dc.binaryType = "arraybuffer";
        console.log("[WebRTC] Host created DataChannel 'yjs', state:", dc.readyState);
        pairingStore.setDataChannel(dc);
      } else {
        pc.ondatachannel = (event) => {
            if (event.channel.label === "yjs") {
                const dc = event.channel;
                dc.binaryType = "arraybuffer";
                console.log("[WebRTC] Joiner received DataChannel 'yjs', state:", dc.readyState);
                pairingStore.setDataChannel(dc);
            }
        };
      }

      // ─── 4. ICE candidate handler ───
      pc.onicecandidate = (event) => {
        if (event.candidate && client.connected) {
          client.publish({
            destination: `/app/session/${sessionId}/signal`,
            body: JSON.stringify({ senderId: myId, type: "candidate", data: event.candidate }),
          });
        }
      };

      // ─── 5. Remote track handler ───
      pc.ontrack = (event) => {
          console.log("[WebRTC] Received remote track:", event.track.kind);
          if (event.streams && event.streams[0]) {
              setRemoteStream(event.streams[0]);
              remoteAudio.srcObject = event.streams[0];
              // Note: Browser might block autoplay without user interaction
              remoteAudio.play().catch(err => {
                  console.warn("[WebRTC] Remote audio autoplay blocked, waiting for interaction", err);
              });
          }
      };

      pc.onconnectionstatechange = () => {
        console.log("[WebRTC] Connection state:", pc.connectionState);
        if (pc.connectionState === "failed") {
          console.error("[WebRTC] P2P connection FAILED — Restarting ICE...");
          // No automatic restart for now to avoid loops, but logged
        }
      };

      // ─── 6. Listen for WebRTC signals ───
      const pendingCandidates: any[] = [];
      signalSubRef.current = client.subscribe(`/topic/session/${sessionId}/signal`, async (msg) => {
        try {
          const signal: SignalMessage = JSON.parse(msg.body);
          if (signal.senderId === myId) return;

          if (signal.type === "offer") {
             if (isCancelled) return;
             console.log("[WebRTC] Received offer");
             offerReceived.current = true;
             await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
             for (const c of pendingCandidates) await pc.addIceCandidate(new RTCIceCandidate(c));
             pendingCandidates.length = 0;
             const answer = await pc.createAnswer();
             await pc.setLocalDescription(answer);
             if (client.connected) {
                 client.publish({
                     destination: `/app/session/${sessionId}/signal`,
                     body: JSON.stringify({ senderId: myId, type: "answer", data: answer }),
                 });
             }
          } else if (signal.type === "answer") {
             if (isCancelled) return;
             console.log("[WebRTC] Received answer");
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
             console.log("[WebRTC] Received request-offer, sending offer");
             const offer = await pc.createOffer();
             await pc.setLocalDescription(offer);
             if (client.connected) {
                 client.publish({
                     destination: `/app/session/${sessionId}/signal`,
                     body: JSON.stringify({ senderId: myId, type: "offer", data: offer }),
                 });
             }
          }
        } catch (e) {
          console.error("Signal parsing error", e);
        }
      });

      // ─── 7. Add local audio track ───
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        if (isCancelled) {
            stream.getTracks().forEach(t => t.stop());
            return;
        }
        localStream.current = stream;
        stream.getAudioTracks().forEach(t => t.enabled = !isMuted);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        console.log("[WebRTC] Local audio added, muted:", isMuted);
      } catch (e: any) {
        console.warn("[WebRTC] Microphone unavailable:", e.message);
      }

      // ─── 8. Offer initiation ───
      if (pairingStore.state.mode === "broadcast") {
          setTimeout(async () => {
              if (isCancelled || pc.signalingState !== "stable") return;
              console.log("[WebRTC] Host sending initial offer");
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              if (client.connected) {
                  client.publish({
                      destination: `/app/session/${sessionId}/signal`,
                      body: JSON.stringify({ senderId: myId, type: "offer", data: offer })
                  });
              }
          }, 1500);
      } else {
          const reqInterval = setInterval(() => {
              if (isCancelled || offerReceived.current || pc.connectionState === "connected") {
                  clearInterval(reqInterval);
                  return;
              }
              if (client.connected) {
                  console.log("[WebRTC] Joiner requesting offer...");
                  client.publish({
                      destination: `/app/session/${sessionId}/signal`,
                      body: JSON.stringify({ senderId: myId, type: "request-offer", data: null })
                  });
              }
          }, 3000);
      }
    };

    startConnection();

    return () => {
      console.log("[useAudioCall] Cleaning up for session", sessionId);
      isCancelled = true;
      remoteAudio.pause();
      remoteAudio.srcObject = null;
      if (localStream.current) localStream.current.getTracks().forEach(t => t.stop());
      if (peerConnection.current) peerConnection.current.close();
      if (signalSubRef.current) signalSubRef.current.unsubscribe();
      pairingStore.setDataChannel(null);
    };
  }, [sessionId, sessionStarted]);

  return { remoteStream };
}
