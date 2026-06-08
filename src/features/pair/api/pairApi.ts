import { apiClient } from "@/lib/axiosClient";
import type {
  CreatePairRequestDto,
  IceServerDto,
  PairJoinRequestDto,
  PairRequestCardDto,
  PairSessionDto,
} from "../types";

// Backend wraps all responses in { success, status, message, data, ... }
interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

interface PageEnvelope<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const BASE = "/api/pair";

async function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const { data } = await promise;
  // Backend returns { data: null } for "no active X" endpoints. Preserve null
  // explicitly so TanStack Query v5 doesn't raise the "cannot be undefined"
  // warning when downstream queryFns return this value directly.
  return (data?.data ?? null) as T;
}

// ---------- pair requests ----------

export async function createPairRequest(dto: CreatePairRequestDto): Promise<PairRequestCardDto> {
  return unwrap(apiClient.post<ApiEnvelope<PairRequestCardDto>>(`${BASE}/requests`, dto));
}

export async function cancelPairRequest(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/requests/${id}`);
}

export async function fetchMyActiveRequest(): Promise<PairRequestCardDto | null> {
  return unwrap(apiClient.get<ApiEnvelope<PairRequestCardDto | null>>(`${BASE}/me/active-request`));
}

export interface LobbyFilter {
  country?: string;
  languageId?: number;
  difficulty?: string;
  spokenLanguage?: string;
  page?: number;
  size?: number;
}

export async function fetchLobby(filter: LobbyFilter = {}): Promise<PageEnvelope<PairRequestCardDto>> {
  const params = new URLSearchParams();
  if (filter.country) params.set("country", filter.country);
  if (filter.languageId != null) params.set("languageId", String(filter.languageId));
  if (filter.difficulty) params.set("difficulty", filter.difficulty);
  if (filter.spokenLanguage) params.set("spokenLanguage", filter.spokenLanguage);
  params.set("page", String(filter.page ?? 0));
  params.set("size", String(filter.size ?? 20));
  return unwrap(
    apiClient.get<ApiEnvelope<PageEnvelope<PairRequestCardDto>>>(
      `${BASE}/requests?${params.toString()}`
    )
  );
}

export async function fetchLobbyCount(): Promise<number> {
  return unwrap(apiClient.get<ApiEnvelope<number>>(`${BASE}/lobby/count`));
}

// ---------- join requests ----------

export async function createJoinRequest(pairRequestId: number): Promise<PairJoinRequestDto> {
  return unwrap(apiClient.post<ApiEnvelope<PairJoinRequestDto>>(`${BASE}/requests/${pairRequestId}/joins`));
}

export async function cancelJoinRequest(joinRequestId: number): Promise<void> {
  await apiClient.delete(`${BASE}/joins/${joinRequestId}`);
}

export async function fetchMyActiveJoin(): Promise<PairJoinRequestDto | null> {
  return unwrap(apiClient.get<ApiEnvelope<PairJoinRequestDto | null>>(`${BASE}/me/active-join`));
}

export async function fetchIncomingJoins(pairRequestId: number): Promise<PairJoinRequestDto[]> {
  return unwrap(
    apiClient.get<ApiEnvelope<PairJoinRequestDto[]>>(`${BASE}/requests/${pairRequestId}/joins`)
  );
}

export async function acceptJoin(joinRequestId: number): Promise<PairSessionDto> {
  return unwrap(apiClient.post<ApiEnvelope<PairSessionDto>>(`${BASE}/joins/${joinRequestId}/accept`));
}

export async function rejectJoin(joinRequestId: number): Promise<void> {
  await apiClient.post(`${BASE}/joins/${joinRequestId}/reject`);
}

// ---------- sessions ----------

export async function fetchSession(sessionId: number): Promise<PairSessionDto> {
  return unwrap(apiClient.get<ApiEnvelope<PairSessionDto>>(`${BASE}/sessions/${sessionId}`));
}

export async function acceptGuidelines(sessionId: number): Promise<PairSessionDto> {
  return unwrap(
    apiClient.post<ApiEnvelope<PairSessionDto>>(`${BASE}/sessions/${sessionId}/accept-guidelines`)
  );
}

export async function leaveSession(sessionId: number): Promise<void> {
  await apiClient.post(`${BASE}/sessions/${sessionId}/leave`);
}

export async function fetchMyActiveSession(): Promise<PairSessionDto | null> {
  return unwrap(apiClient.get<ApiEnvelope<PairSessionDto | null>>(`${BASE}/me/active-session`));
}

// ---------- ICE servers ----------

export async function fetchIceServers(): Promise<IceServerDto[]> {
  return unwrap(apiClient.get<ApiEnvelope<IceServerDto[]>>(`${BASE}/ice-servers`));
}
