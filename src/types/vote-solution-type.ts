export type VoteType =
  | "CLEAN"
  | "CLEVER"
  | "SHORTEST"
  | "EFFICIENT"
  | "BEST_PRACTICES";

export interface VoteDataTypes {
  clean?: number;
  clever?: number;
  shortest?: number;
  efficient?: number;
  bestPractices?: number;
  userVote?: VoteType | null;
}

export interface CommunitySolutionsVoteTypes {
  voteData?: VoteDataTypes;
  solutionId: number | string;
  languageId: number | string;
  challengeId: number | string;
}
