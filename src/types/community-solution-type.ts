export type AuthorType = {
  xp: number;
  name: string;
  authorId: number;
  country: string | null;
  avatarUrl: string | null;
  occupation: string | null;
  countryFlag: string | null;
};

export type SolutionInfoType = {
  code: string;
  language: string;
  memoryKb: number;
  runtimeMs: number;
  solutionId: number;
  submittedAgo: string;
  commentsCount?: number;
};

export type CommunityVotesType = {
  genius: number;
  solid: number;
  meh: number;
  currentUserVote: string | null;
};

export type CommunitySolutionType = {
  hidden: boolean;
  author: AuthorType;
  canDelete: boolean;
  votes: CommunityVotesType;
  canToggleVisibility: boolean;
  solutionInfo: SolutionInfoType;
};

export type AllChallengesResponse = {
  timestamp: string;
  status: number;
  message: string;
  data: {
    pageSize: number;
    hasMore: boolean;
    currentPage: number;
    generatedAt: string;
    community: CommunitySolutionType[];
  };
  paginated: boolean;
};

export type MyChallengeResponse = {
  status: number;
  message: string;
  timestamp: string;
  paginated: boolean;
  data: CommunitySolutionType;
};
