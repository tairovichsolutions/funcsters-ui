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
  };

  private client: Client | null = null;
  private lobbySubscription: any = null;
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

    let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    // convert https://api.../api to https://api.../ws
    baseUrl = baseUrl.replace(/\/api$/, "");
    if (!baseUrl) baseUrl = "http://localhost:8091";
    
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("STOMP: " + str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to Pairing WebSocket!");
        
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
             requestExpiry: Date.now() + 60 * 1000 // 1 minute to join after approval
           });
           this.setPermission(true);
           this.initSessionSubscription(payload.id);
        });

        this.declinedSub = this.client?.subscribe("/user/queue/pairing/declined", (msg) => {
           this.cancelRequest();
        });
        
        // Listen to Lobby if we are broadcasting
        this.lobbySubscription = this.client?.subscribe("/topic/lobby", (msg) => {});
      },
      onStompError: (frame) => {
        console.error("STOMP Error", frame);
      },
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
      if (this.client) this.client.deactivate();
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
    if (this.sessionSub) this.sessionSub.unsubscribe();
    this.sessionSub = this.client?.subscribe(`/topic/session/${requestId}`, (msg) => {
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
      const res = await apiClient.post("/api/pairing/request", {
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
           const res = await apiClient.post(`/api/pairing/request/${this._state.requestId}/approve/${partnerId}`);
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
          await apiClient.post(`/api/pairing/request/${this._state.requestId}/decline/${partnerId}`);
      } catch (e) {
          console.error(e);
      }
  }

  async endActiveSession() {
      // Instant UI feedback: hide session UI immediately
      this.setPermission(false);
      if (!this._state.requestId) return;
      
      try {
          await apiClient.post(`/api/pairing/session/${this._state.requestId}/end`);
          this.cancelRequest();
      } catch (e) {
          console.error("Failed to end session via API", e);
          // Still cancel locally to allow user to get out of the stuck state
          this.cancelRequest();
      }
  }

  async joinSession(requestId: number) {
      try {
          await apiClient.post(`/api/pairing/session/${requestId}/join`);
      } catch (e) {
          console.error("Failed to signal session join", e);
      }
  }

  setPermission(granted: boolean) {
    this.setState({ hasPermission: granted });
  }

  async rehydrateActiveRequest() {
    try {
      const res = await apiClient.get("/api/pairing/my-request");
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
            await apiClient.delete(`/api/pairing/request/${this._state.requestId}`);
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
    });
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
