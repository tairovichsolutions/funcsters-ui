import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/pairApi";
import type { LobbyFilter } from "../api/pairApi";
import type { CreatePairRequestDto } from "../types";

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
  return useQuery({
    queryKey: pairKeys.lobbyCount(),
    queryFn: api.fetchLobbyCount,
    staleTime: 10_000,
  });
}

export function useLobby(filter: LobbyFilter) {
  return useQuery({
    queryKey: pairKeys.lobby(filter),
    queryFn: () => api.fetchLobby(filter),
    staleTime: 5_000,
  });
}

export function useMyActiveRequest() {
  return useQuery({
    queryKey: pairKeys.myRequest(),
    queryFn: api.fetchMyActiveRequest,
    staleTime: 5_000,
  });
}

export function useMyActiveJoin() {
  return useQuery({
    queryKey: pairKeys.myJoin(),
    queryFn: api.fetchMyActiveJoin,
    staleTime: 5_000,
  });
}

export function useMyActiveSession() {
  return useQuery({
    queryKey: pairKeys.mySession(),
    queryFn: api.fetchMyActiveSession,
    staleTime: 5_000,
  });
}

export function useIncomingJoins(pairRequestId: number | undefined) {
  return useQuery({
    queryKey: pairKeys.incomingJoins(pairRequestId ?? 0),
    queryFn: () => api.fetchIncomingJoins(pairRequestId!),
    enabled: pairRequestId != null,
    refetchInterval: 5_000,
  });
}

export function useSession(sessionId: number | undefined) {
  return useQuery({
    queryKey: pairKeys.session(sessionId ?? 0),
    queryFn: () => api.fetchSession(sessionId!),
    enabled: sessionId != null,
  });
}

export function useIceServers() {
  return useQuery({
    queryKey: pairKeys.iceServers(),
    queryFn: api.fetchIceServers,
    // Backend HMAC creds are scoped 1h; fetch fresh per session start.
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
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
