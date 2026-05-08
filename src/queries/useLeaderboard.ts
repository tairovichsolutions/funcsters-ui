"use client";

import { QueryKey } from "@/constants/queryKey";
import { apiClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import type { LeaderboardPeriod, LeaderboardResponse } from "@/types/leaderboard-types";

export const useLeaderboard = (period: LeaderboardPeriod = "all_time", country: string = "") => {
  const fetcher = async (): Promise<LeaderboardResponse> => {
    const params: Record<string, string | number> = {
      period,
      page: 0,
      size: 150,
    };
    if (country) {
      params.country = country;
    }

    const { data } = await apiClient.get("/api/leaderboard", { params });

    return data?.data;
  };

  return useQuery({
    queryKey: [QueryKey.GetLeaderboard, period, country],
    queryFn: fetcher,
  });
};
