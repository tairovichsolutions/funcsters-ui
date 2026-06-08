"use client";

import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "@/lib/axiosClient";

/**
 * STOMP-over-WebSocket client hook. Cookies carry the JWT on the /ws upgrade
 * (JwtHandshakeInterceptor on the backend reads the "accessToken" cookie).
 * Same-origin URL via Next rewrite so cookies are sent automatically.
 *
 * Usage:
 *   const stomp = useStompPair({ enabled: true });
 *   useEffect(() => {
 *     if (!stomp.connected) return;
 *     const sub = stomp.subscribe("/topic/pair/42/control", (msg) => { ... });
 *     return () => sub.unsubscribe();
 *   }, [stomp.connected]);
 *
 *   stomp.publish("/app/pair/42/signal", { type: "OFFER", payload: sdp });
 */
export interface UseStompPairOptions {
  enabled?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: unknown) => void;
}

export interface StompPairClient {
  connected: boolean;
  subscribe: (destination: string, onMessage: (msg: IMessage) => void) => StompSubscription | null;
  publish: (destination: string, body: unknown) => void;
}

function buildWsUrl(): string {
  if (typeof window === "undefined") return "";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/ws`;
}

export function useStompPair(opts: UseStompPairOptions = {}): StompPairClient {
  const { enabled = true, onConnect, onDisconnect, onError } = opts;
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const client = new Client({
      brokerURL: buildWsUrl(),
      reconnectDelay: 2_000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      onConnect: () => {
        setConnected(true);
        onConnect?.();
      },
      onDisconnect: () => {
        setConnected(false);
        onDisconnect?.();
      },
      onStompError: (frame) => {
        onError?.(new Error(frame.headers.message ?? "STOMP error"));
        // Force Axios to intercept the failure and either refresh the token
        // or log the user out, breaking the infinite WS retry loop.
        apiClient.get("/api/users/me").catch(() => {});
      },
      onWebSocketError: (evt) => {
        onError?.(evt);
        // Force Axios to intercept the failure and either refresh the token
        // or log the user out, breaking the infinite WS retry loop.
        apiClient.get("/api/users/me").catch(() => {});
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      clientRef.current = null;
      setConnected(false);
      client.deactivate().catch(() => {});
    };
    // onConnect/onDisconnect/onError captured at mount time intentionally;
    // callers that need live handlers can wrap them in refs themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const subscribe = useCallback(
    (destination: string, onMessage: (msg: IMessage) => void): StompSubscription | null => {
      const client = clientRef.current;
      if (!client || !client.connected) return null;
      return client.subscribe(destination, onMessage);
    },
    []
  );

  const publish = useCallback((destination: string, body: unknown) => {
    const client = clientRef.current;
    if (!client || !client.connected) return;
    client.publish({
      destination,
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  }, []);

  // Return identity must be stable across renders of the calling component;
  // otherwise downstream useEffects that list `stomp` in their deps will
  // tear down + re-create STOMP subscriptions on every parent render. Under
  // rapid refresh the PairSessionProvider re-renders many times while data
  // hydrates, and a churning signal subscription drops any OFFER/ANSWER
  // that lands in the UNSUBSCRIBE→SUBSCRIBE gap — exactly the stuck-
  // handshake failure mode we were hitting on the 2nd/3rd refresh.
  return useMemo(
    () => ({ connected, subscribe, publish }),
    [connected, subscribe, publish]
  );
}
