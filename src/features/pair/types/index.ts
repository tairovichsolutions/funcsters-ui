// Mirrors backend DTOs in io.funcsters.pair.dto
// Keep these in sync with PairRequestCardDto.java, PairJoinRequestDto.java,
// PairSessionDto.java, IceServerDto.java, PairControlEvent.java.

export type PairFocusArea =
  | "DEBUGGING"
  | "REFACTORING"
  | "LEARNING"
  | "OPTIMIZATION"
  | "GENERAL";

export type PairRequestStatus =
  | "BROADCASTING"
  | "AWAITING_JOINER"
  | "MATCHED"
  | "EXPIRED"
  | "CANCELED";

export type PairJoinRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED_BY_HOST"
  | "CANCELED"
  | "EXPIRED";

export type PairSessionStatus = "AWAITING_GUIDELINES" | "ACTIVE" | "ENDED";

export interface PairRequestCardDto {
  description?: string;
  occupation?:string;
  xp?:string;
  id: number;
  hostUsername: string;
  hostCountry: string | null;
  hostCountryFlag: string | null;
  challengeId: number;
  challengeSlug: string;
  challengeTitle: string;
  challengeDifficulty: string | null;
  languageId: number;
  languageName: string;
  focusArea: PairFocusArea;
  spokenLanguages: string[];
  status: PairRequestStatus;
  createdAtEpochMs: number;
  expiresAtEpochMs: number;
}

export interface PairJoinRequestDto {
  id: number;
  joinerOccupation:string;
  joinedCountryFlag:string;
  xp:number|string;
  pairRequestId: number;
  joinerUsername: string;
  joinerCountry: string | null;
  status: PairJoinRequestStatus;
  createdAtEpochMs: number;
  expiresAtEpochMs: number;
}

export interface PairSessionDto {
  id: number;
  pairRequestId: number;
  hostUsername: string;
  joinerUsername: string;
  challengeId: number;
  challengeSlug: string;
  challengeTitle: string;
  languageId: number;
  languageName: string;
  status: PairSessionStatus;
  acceptedAtEpochMs: number;
  guidelinesAcceptedAtEpochMs: number | null;
  startedAtEpochMs: number | null;
  endsAtEpochMs: number | null;
}

export interface IceServerDto {
  urls: string[];
  username: string | null;
  credential: string | null;
}

export interface CreatePairRequestDto {
  challengeId: number;
  description?: string;
  languageId: number;
  focusArea: PairFocusArea;
  spokenLanguages: string[];
}

export type PairControlEventType =
  | "SESSION_STARTED"
  | "SESSION_ENDED"
  | "PEER_LEFT"
  | "JOIN_ACCEPTED"
  | "JOIN_REJECTED"
  | "JOIN_EXPIRED"
  | "NEW_JOIN"
  | "INCOMING_JOIN"
  | "REQUEST_EXPIRED";

export interface PairControlEvent {
  type: PairControlEventType;
  sessionId: number | null;
  pairRequestId: number | null;
  reason: string | null;
  atEpochMs: number;
}

export type WebRtcSignalType =
  | "OFFER"
  | "ANSWER"
  | "ICE_CANDIDATE"
  | "ICE_RESTART"
  // Sent once per fresh useWebRTCSession mount. If the peer is still
  // holding a stale pc (connected state), they rebuild immediately instead
  // of waiting for ICE to time out (~10s). Backend treats `type` as an
  // opaque string so no server change is needed.
  | "REINIT";

export interface PairSignalMessage {
  type: WebRtcSignalType;
  payload: string;
  from: string;
}
