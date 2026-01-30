export type VoteType = "GENIUS" | "SOLID" | "MEH";

export interface VoteDataTypes {
  genius?: number;
  solid?: number;
  meh?: number;
  currentUserVote: string | null;
}

export interface CommunitySolutionsVoteTypes {
  voteData?: VoteDataTypes;
  solutionId: number | string;
  languageId: number | string;
  challengeId: number | string;
}
