import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as api from "../api/pairApi";
import type { LobbyFilter } from "../api/pairApi";
import type { CreatePairRequestDto } from "../types";

/**
 * Quick sync check: does the browser have a userId cookie? If not, the user
 * is logged out and none of the pair-programming endpoints will accept the
 * request. We gate all auth-required queries on this so a logged-out visit
 * to /challenges or /landing doesn't spam 401s in the console.
 */
function useHasUserCookie(): boolean {
  const [present, setPresent] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const check = () => setPresent(/(?:^|;\s*)userId=/.test(document.cookie));
    check();
    // Re-check periodically; login/logout on the same tab will flip this.
    const id = window.setInterval(check, 5_000);
    return () => window.clearInterval(id);
  }, []);
  return present;
}

/**
 * With the introduction of global STOMP event subscriptions in PairSessionProvider,
 * we no longer need aggressive polling for real-time updates! The STOMP connection
 * pushes events (e.g., JOIN_ACCEPTED, NEW_JOIN, lobby updates) instantly.
 * 
 * We now rely 100% on event-driven invalidation to keep the UI fresh.
 */
function usePollInterval(): false {
  return false; // Polling disabled, rely entirely on WebSockets
}

export const pairKeys = {
  all: ["pair"] as const,
  lobbyCount: () => [...pairKeys.all, "lobby-count"] as const,
  lobby: (filter: LobbyFilter) => [...pairKeys.all, "lobby", filter] as const,
  myRequest: () => [...pairKeys.all, "me", "request"] as const,
  myJoin: () => [...pairKeys.all, "me", "join"] as const,
  mySession: () => [...pairKeys.all, "me", "session"] as const,
  incomingJoins: (pairRequestId: number) =>
    [...pairKeys.all, "requests", pairRequestId, "joins"] as const,
  session: (id: number) => [...pairKeys.all, "sessions", id] as const,
  iceServers: () => [...pairKeys.all, "ice-servers"] as const,
};

// ---------- read ----------

export function useLobbyCount() {
  const authed = useHasUserCookie();
  const pollMs = usePollInterval();
  return useQuery({
    queryKey: pairKeys.lobbyCount(),
    queryFn: api.fetchLobbyCount,
    staleTime: 2_000,
    enabled: authed,
    refetchInterval: authed ? pollMs : false,
    refetchIntervalInBackground: false,
    // Don't retry on 401 — the interceptor handles token refresh. If
    // the user is logged out, retrying just adds more 401 noise.
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

export function useLobby(filter: LobbyFilter) {
  const authed = useHasUserCookie();
  const pollMs = usePollInterval();
  return useQuery({
    queryKey: pairKeys.lobby(filter),
    queryFn: () => api.fetchLobby(filter),
    staleTime: 2_000,
    enabled: authed,
    refetchInterval: authed ? pollMs : false,
    refetchIntervalInBackground: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

export function useMyActiveRequest() {
  const authed = useHasUserCookie();
  const pollMs = usePollInterval();
  return useQuery({
    queryKey: pairKeys.myRequest(),
    queryFn: api.fetchMyActiveRequest,
    staleTime: 2_000,
    enabled: authed,
    refetchInterval: authed ? pollMs : false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

export function useMyActiveJoin() {
  const authed = useHasUserCookie();
  const pollMs = usePollInterval();
  return useQuery({
    queryKey: pairKeys.myJoin(),
    queryFn: api.fetchMyActiveJoin,
    staleTime: 2_000,
    enabled: authed,
    refetchInterval: authed ? pollMs : false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

export function useMyActiveSession() {
  const authed = useHasUserCookie();
  const pollMs = usePollInterval();
  return useQuery({
    queryKey: pairKeys.mySession(),
    queryFn: api.fetchMyActiveSession,
    staleTime: 2_000,
    enabled: authed,
    refetchInterval: authed ? pollMs : false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

export function useIncomingJoins(pairRequestId: number | undefined) {
  const pollMs = usePollInterval();
  return useQuery({
    queryKey: pairKeys.incomingJoins(pairRequestId ?? 0),
    queryFn: () => api.fetchIncomingJoins(pairRequestId!),
    staleTime: 2_000,
    enabled: pairRequestId != null,
    refetchInterval: pairRequestId != null ? pollMs : false,
    refetchIntervalInBackground: false,
  });
}

export function useSession(sessionId: number | undefined) {
  return useQuery({
    queryKey: pairKeys.session(sessionId ?? 0),
    queryFn: () => api.fetchSession(sessionId!),
    enabled: sessionId != null,
  });
}

export function useIceServers(enabled = true) {
  const authed = useHasUserCookie();
  return useQuery({
    queryKey: pairKeys.iceServers(),
    queryFn: api.fetchIceServers,
    // Backend HMAC creds are scoped 1h; fetch fresh per session start.
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
    // Only fetch when explicitly needed (an active session) AND authenticated.
    // Caller passes `enabled=false` when no session is active so we don't hit
    // the endpoint on every page load.
    enabled: authed && enabled,
  });
}

// ---------- write ----------

function useInvalidator() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: pairKeys.all });
  };
}

export function useCreatePairRequest() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: (dto: CreatePairRequestDto) => api.createPairRequest(dto),
    onSuccess: invalidate,
  });
}

export function useCancelPairRequest() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: (id: number) => api.cancelPairRequest(id),
    onSuccess: invalidate,
  });
}

export function useCreateJoinRequest() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: (pairRequestId: number) => api.createJoinRequest(pairRequestId),
    onSuccess: invalidate,
  });
}

export function useCancelJoinRequest() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: (joinRequestId: number) => api.cancelJoinRequest(joinRequestId),
    onSuccess: invalidate,
  });
}

export function useAcceptJoin() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: (joinRequestId: number) => api.acceptJoin(joinRequestId),
    onSuccess: invalidate,
  });
}

export function useRejectJoin() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: (joinRequestId: number) => api.rejectJoin(joinRequestId),
    onSuccess: invalidate,
  });
}

export function useAcceptGuidelines() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: (sessionId: number) => api.acceptGuidelines(sessionId),
    onSuccess: invalidate,
  });
}

export function useLeaveSession() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: (sessionId: number) => api.leaveSession(sessionId),
    onSuccess: invalidate,
  });
}
