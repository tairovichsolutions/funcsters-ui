export interface LeaderboardStreak {
  currentStreak: {
    count: number;
    startDate: string | null;
    endDate: string | null;
  };
  longestStreak: {
    count: number;
    startDate: string | null;
    endDate: string | null;
  };
}

export interface LeaderboardUser {
  rank: number;
  userId: number;
  username: string;
  avatarUrl: string | null;
  country: string | null;
  countryFlag: string | null;
  challengesSolved: number;
  languages: string[];
  streak: LeaderboardStreak;
  periodXp: number;
  totalXp: number;
  xpSince: string;
  currentUser: boolean;
}

export interface CurrentUserRank {
  rank: number;
  xpEarnedPeriod: number;
  xpNeededForNextRank: number;
  totalChallengesSolved: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
}

export interface LeaderboardResponse {
  currentUserRank: CurrentUserRank;
  leaderboard: LeaderboardUser[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export type LeaderboardPeriod = "weekly" | "monthly" | "all_time";
