import { apiClient } from "@/lib/axiosClient";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getCookie } from "cookies-next";

// Types matching backend DTOs
export interface PairRequestType {
  id: string; // The backend uses Long for ID, we map it to string
  name: string;
  username: string;
  avatarUrl: string;
  occupation: string;
  country: string;
  xp: number;
  languages?: string[];
  programmingLanguage?: string;
  spokenLanguages?: string[];
}

export interface PairingRequestDto {
  id: number;
  hostId: number;
  hostUsername: string;
  hostAvatarUrl?: string;
  hostCountry?: string;
  hostCountryFlag?: string;
  hostOccupation?: string;
  hostXp?: number;
  challengeId: number;
  challengeTitle: string;
  challengeSlug: string;
  challengeDifficulty: string;
  challengeTags?: string[];
  preferredLanguages: string[];
  spokenLanguages: string[];
  focusAreas: string[];
  description?: string;
  status: string;
  partnerId?: number | null;
  partnerUsername?: string | null;
  partnerAvatarUrl?: string | null;
  expiresAt: string;
  isPartnerJoined: boolean;
}

class PairingDemoStore extends EventTarget {
  private _state = {
    isRequesting: false,
    requestExpiry: 0,
    activeChallengeId: "",
    activeChallengeSlug: "",
    activeChallengeTitle: "",
    incomingRequests: [] as PairRequestType[],
    targetUser: null as any | null,
    mode: null as "broadcast" | "join" | null,
    hasPermission: false,
    sessionStarted: false,
    // Real tracking variables
    requestId: null as number | null,
    isConnected: false,
    connectionError: null as string | null,
    dataChannel: null as RTCDataChannel | null,
  };

  private client: Client | null = null;
  private lobbySubscription: any = null;
  private subscriptions: Map<string, any> = new Map();
  private offerSub: any = null;
  private approvedSub: any = null;
  private declinedSub: any = null;
  private sessionSub: any = null;

  get state() {
    return this._state;
  }

  getClient(): Client | null {
    return this.client;
  }

  private setState(updates: Partial<typeof this._state>) {
    this._state = { ...this._state, ...updates };
    this.dispatchEvent(new Event("change"));
  }

  // We MUST make initStompClient async because it needs to fetch the token from the proxy.
  private async initStompClient() {
    if (this.client && this.client.active) return;
    
    let token = "";
    try {
      const { data } = await apiClient.get("/api/auth/token");
      token = data.accessToken;
    } catch(e) {
      console.error("Could not fetch WebSocket STOMP token", e);
      return;
    }

    let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8091";
    // strip everything after /api if present, or just use the base
    let wsBaseUrl = baseUrl;
    if (baseUrl.includes("/api")) {
      wsBaseUrl = baseUrl.split("/api")[0];
    }
    
    const socketUrl = `${wsBaseUrl}/ws`.replace(/([^:]\/)\/+/g, "$1"); // remove double slashes except after protocol
    console.log("[STOMP] Initializing connection to:", socketUrl);
    
    this.client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("[STOMP Debug]: " + str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("[STOMP] Connected Successfully!");
        this.setState({ isConnected: true, connectionError: null });
        
        this.offerSub = this.client?.subscribe("/user/queue/pairing/offer", (msg) => {
           if (this._state.mode !== "broadcast") return;
           const payload = JSON.parse(msg.body);
           const req: PairRequestType = {
               id: payload.partnerId.toString(),
               name: payload.partnerUsername,
               username: payload.partnerUsername,
               avatarUrl: payload.partnerAvatarUrl || `https://ui-avatars.com/api/?name=${payload.partnerUsername}`,
               occupation: "Developer",
               country: "Earth",
               xp: 0,
               languages: ["TypeScript"],
               programmingLanguage: "TypeScript",
           };
           this.setState({ incomingRequests: [...this._state.incomingRequests, req] });
        });

        this.approvedSub = this.client?.subscribe("/user/queue/pairing/approved", (msg) => {
           if (this._state.mode !== "join") return;
           const payload = JSON.parse(msg.body);
           this.setState({ 
             requestId: payload.id,
             requestExpiry: new Date(payload.expiresAt).getTime()
           });
           this.setPermission(true);
           this.initSessionSubscription(payload.id);
        });

        this.declinedSub = this.client?.subscribe("/user/queue/pairing/declined", (msg) => {
           this.cancelRequest();
        });
        
        // Listen to Lobby if we are broadcasting
        this.lobbySubscription = this.client?.subscribe("/topic/lobby", (msg) => {});

        // Re-subscribe to active session topic if rehydrated
        if (this._state.requestId && this._state.hasPermission) {
            console.log("Re-subscribing to live session topic", this._state.requestId);
            this.initSessionSubscription(this._state.requestId);
        }
      },
      onStompError: (frame) => {
        console.error("[STOMP] Protocol Error", frame);
        this.setState({ isConnected: false, connectionError: "STOMP protocol error" });
      },
      onWebSocketError: (event) => {
        console.error("[STOMP] WebSocket Error", event);
        this.setState({ isConnected: false, connectionError: "WebSocket connection failed" });
      },
      onDisconnect: () => {
        console.log("[STOMP] Disconnected");
        this.setState({ isConnected: false });
      }
    });
    
    this.client.activate();
  }

  private stopStompClient() {
    try {
      if (this.lobbySubscription) this.lobbySubscription.unsubscribe();
      if (this.offerSub) this.offerSub.unsubscribe();
      if (this.approvedSub) this.approvedSub.unsubscribe();
      if (this.declinedSub) this.declinedSub.unsubscribe();
      if (this.sessionSub) this.sessionSub.unsubscribe();
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions.clear();
      if (this.client) this.client.deactivate();
      this.setState({ isConnected: false });
    } catch (e) {
      console.warn("Error stopping STOMP client", e);
    }
    this.lobbySubscription = null;
    this.offerSub = null;
    this.approvedSub = null;
    this.declinedSub = null;
    this.sessionSub = null;
    this.client = null;
  }

  private initSessionSubscription(requestId: number) {
    if (!this.client || !this.client.connected) {
        console.warn("Cannot subscribe to session: STOMP client not connected");
        return;
    }
    if (this.sessionSub) this.sessionSub.unsubscribe();
    
    console.log("Subscribing to session topic:", `/topic/session/${requestId}`);
    
    // 1. Session-Specific Notifications (JOIN_REQUEST, etc.)
    if (this._state.requestId) {
      const sessionTopic = `/topic/pairing/notifications/${this._state.requestId}`;
      this.subscriptions.set(sessionTopic, this.client.subscribe(sessionTopic, (msg) => {
        const payload = JSON.parse(msg.body);
        if (payload.type === "JOIN_REQUEST") {
          this.rehydrateActiveRequest();
        }
      }));
    }

    // 2. Personal Notifications (DECLINED, etc.)
    const userQueue = `/user/topic/pairing/request`;
    this.subscriptions.set(userQueue, this.client.subscribe(userQueue, (msg) => {
      const payload = JSON.parse(msg.body);
      if (payload.type === "SESSION_ENDED") {
        this.cancelRequest();
      }
    }));

    this.sessionSub = this.client.subscribe(`/topic/session/${requestId}`, (msg) => {
      const payload = JSON.parse(msg.body);
      if (payload.type === "SESSION_ENDED") {
        this.cancelRequest();
      } else if (payload.type === "PARTNER_JOINED") {
        this.setState({ sessionStarted: true });
      }
    });
  }

  async startBroadcast(id: string, slug: string, title: string, payloadData?: any) {
    try {
      const focusList = payloadData?.focuses || [];
      const mappedFocuses = focusList.map((f: string) => {
          if (f.toLowerCase().includes("syntax")) return "SYNTAX";
          if (f.toLowerCase().includes("debug")) return "DEBUGGING";
          return "LOGIC";
      });

      const preferredLangs = payloadData?.programmingLanguages || ["JavaScript"];
      const spokenLangs = payloadData?.spokenLanguages || ["English"];

      await this.initStompClient();
      const res = await apiClient.post("/api/v1/pairing/request", {
        challengeId: parseInt(id),
        focusAreas: mappedFocuses,
        preferredLanguages: preferredLangs,
        spokenLanguages: spokenLangs,
        description: payloadData?.description || "",
      });
      const data: PairingRequestDto = res.data.data;
      
      this.setState({
        isRequesting: true,
        mode: "broadcast",
        requestExpiry: new Date(data.expiresAt).getTime(),
        activeChallengeId: id,
        activeChallengeSlug: slug,
        activeChallengeTitle: title,
        incomingRequests: [],
        targetUser: null,
        requestId: data.id,
      });
    } catch (e) {
      console.error("Failed to start broadcast", e);
    }
  }

  // Partner decides to join a host
  async requestToJoin(requestId: string, id: string, slug: string, title: string, user: any) {
    await this.initStompClient();
    
    this.setState({
      isRequesting: true,
      mode: "join",
      requestExpiry: Date.now() + 2 * 60 * 1000,
      activeChallengeId: id,
      activeChallengeSlug: slug,
      activeChallengeTitle: title,
      targetUser: user,
      incomingRequests: [],
      hasPermission: false, 
      requestId: parseInt(requestId), // Store backend request ID
    });

    // Send the join offer via WebSocket!
    if (this.client && this.client.connected) {
       this.client.publish({ destination: `/app/pairing/offer/${requestId}`, body: "{}" });
    } else {
       // Quick wait hack if connecting
       setTimeout(() => {
           this.client?.publish({ destination: `/app/pairing/offer/${requestId}`, body: "{}" });
       }, 500);
    }
  }
  
  // Host accepts a partner
   async acceptPartner(partnerId: string) {
       if (!this._state.requestId) return;
       try {
           const res = await apiClient.post(`/api/v1/pairing/request/${this._state.requestId}/approve/${partnerId}`);
           const data: PairingRequestDto = res.data.data;
           this.setPermission(true);
           this.setState({ sessionStarted: data.isPartnerJoined });
           this.initSessionSubscription(this._state.requestId);
       } catch (e) {
           console.error(e);
       }
   }

  async declinePartner(partnerId: string) {
      if (!this._state.requestId) return;
      try {
          await apiClient.post(`/api/v1/pairing/request/${this._state.requestId}/decline/${partnerId}`);
      } catch (e) {
          console.error(e);
      }
  }

  async endActiveSession() {
      // Instant UI feedback: hide session UI immediately
      this.setPermission(false);
      if (!this._state.requestId) return;
      
      try {
          await apiClient.post(`/api/v1/pairing/session/${this._state.requestId}/end`);
          this.cancelRequest();
      } catch (e) {
          console.error("Failed to end session via API", e);
          // Still cancel locally to allow user to get out of the stuck state
          this.cancelRequest();
      }
  }

  async joinSession(requestId: number) {
      try {
          await apiClient.post(`/api/v1/pairing/session/${requestId}/join`);
      } catch (e) {
          console.error("Failed to signal session join", e);
      }
  }

  setPermission(granted: boolean) {
    this.setState({ hasPermission: granted });
  }

  setDataChannel(dc: RTCDataChannel | null) {
    if (dc) {
      dc.binaryType = "arraybuffer";
    }
    this.setState({ dataChannel: dc });
  }

  async rehydrateActiveRequest() {
    try {
      const res = await apiClient.get("/api/v1/pairing/my-request");
      const data: PairingRequestDto = res.data.data;
      if (data) {
        const myUserId = getCookie("userId");
        const isHost = data.hostId.toString() === myUserId;
        
        if (!this.client || !this.client.active) {
            await this.initStompClient();
        }
        
        let targetUser = null;
        if (isHost && data.partnerId) {
            targetUser = {
                id: String(data.partnerId),
                username: data.partnerUsername,
                avatarUrl: data.partnerAvatarUrl || `https://ui-avatars.com/api/?name=${data.partnerUsername}`,
            };
        } else if (!isHost) {
            targetUser = {
                id: String(data.hostId),
                username: data.hostUsername,
                avatarUrl: data.hostAvatarUrl || `https://ui-avatars.com/api/?name=${data.hostUsername}`,
            };
        }

        this.setState({
          isRequesting: true,
          mode: isHost ? "broadcast" : "join",
          requestExpiry: new Date(data.expiresAt).getTime(),
          activeChallengeId: String(data.challengeId),
          activeChallengeSlug: data.challengeSlug,
          activeChallengeTitle: data.challengeTitle,
          requestId: data.id,
          targetUser: targetUser,
          hasPermission: data.status === "ACTIVE",
          sessionStarted: data.isPartnerJoined || false,
        });

        if (data.status === "ACTIVE") {
            this.initSessionSubscription(data.id);
        }
      }
    } catch (e) {
      // Not logged in or no request found - silent
    }
  }

  async cancelRequest() {
    if (this._state.requestId && this._state.mode === "broadcast") {
        try {
            await apiClient.delete(`/api/v1/pairing/request/${this._state.requestId}`);
        } catch (e) {
            console.error(e);
        }
    }
    this.stopStompClient();
    this.setState({
      isRequesting: false,
      requestExpiry: 0,
      mode: null,
      targetUser: null,
      incomingRequests: [],
      hasPermission: false,
      sessionStarted: false,
      requestId: null,
      dataChannel: null,
    });
  }

  async getTurnCredentials() {
    try {
      const res = await apiClient.get("/api/v1/pairing/turn-credentials");
      return res.data.data;
    } catch (e) {
      console.error("Failed to fetch TURN credentials, falling back to STUN only", e);
      return {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      };
    }
  }
}

export const pairingStore = new PairingDemoStore();

import { useSyncExternalStore } from "react";

export function usePairingStore() {
  return useSyncExternalStore(
    (callback) => {
      pairingStore.addEventListener("change", callback);
      return () => pairingStore.removeEventListener("change", callback);
    },
    () => pairingStore.state,
    () => pairingStore.state
  );
}
