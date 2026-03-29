import { useEffect, useRef, useState } from "react";
import { pairingStore } from "@/mock/pairingStore";

interface SignalMessage {
  senderId: string;
  type: "offer" | "answer" | "candidate";
  data: any;
}

export function useAudioCall(sessionId: number | string | null, isMuted: boolean) {
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const signalSubRef = useRef<any>(null);
  
  // Create a unique ID for this client so it ignores its own signals
  const myId = useRef(Math.random().toString(36).substring(7)).current;

  useEffect(() => {
    let isCancelled = false;

    if (!sessionId || !pairingStore.state.hasPermission || !pairingStore.state.sessionStarted) return;
    
    const client = pairingStore.getClient();
    if (!client || !client.connected) {
        console.warn("STOMP client not connected, skipping audio call init");
        return;
    }

    // 1. Get User Media
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (isCancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
      }
      localStream.current = stream;
      if (isMuted) {
          stream.getAudioTracks().forEach(t => t.enabled = false);
      }
      
      // 2. Setup RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnection.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
              setRemoteStream(event.streams[0]);
              // Auto-play the audio element
              const audio = new Audio();
              audio.srcObject = event.streams[0];
              audio.play().catch(console.error);
          }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && client.connected) {
          client.publish({
            destination: `/app/session/${sessionId}/signal`,
            body: JSON.stringify({ senderId: myId, type: "candidate", data: event.candidate }),
          });
        }
      };

      // 3. Listen for signals
      signalSubRef.current = client.subscribe(`/topic/session/${sessionId}/signal`, async (msg) => {
        try {
          const signal: SignalMessage = JSON.parse(msg.body);
          if (signal.senderId === myId) return; // ignore own

          if (signal.type === "offer") {
             if (isCancelled) return;
             await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
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
             await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
          } else if (signal.type === "candidate") {
             if (isCancelled) return;
             await pc.addIceCandidate(new RTCIceCandidate(signal.data));
          }
        } catch (e) {
          console.error("Signal parsing error", e);
        }
      });

      // 4. Host (or whichever connects first) initiates the offer
      if (pairingStore.state.mode === "broadcast") {
          setTimeout(async () => {
              if (isCancelled) return;
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              if (client.connected) {
                  client.publish({
                      destination: `/app/session/${sessionId}/signal`,
                      body: JSON.stringify({ senderId: myId, type: "offer", data: offer }),
                  });
              } else {
                  console.warn("Cannot publish offer: client not connected");
              }
          }, 2000); // Wait 2s for both to be fully joined in the UI
      }

    }).catch(console.error);

    return () => {
      isCancelled = true;
      if (localStream.current) localStream.current.getTracks().forEach(t => t.stop());
      if (peerConnection.current) peerConnection.current.close();
      if (signalSubRef.current) signalSubRef.current.unsubscribe();
    };
  }, [sessionId]);

  // Handle local mute
  useEffect(() => {
    if (localStream.current) {
        localStream.current.getAudioTracks().forEach(t => t.enabled = !isMuted);
    }
  }, [isMuted]);

  return { remoteStream };
}
