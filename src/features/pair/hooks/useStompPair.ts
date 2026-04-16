"use client";

import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";

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
      },
      onWebSocketError: (evt) => {
        onError?.(evt);
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

  return { connected, subscribe, publish };
}
