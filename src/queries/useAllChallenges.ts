"use client";

import { QueryKey } from "@/constants/queryKey";
import { axiosClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import type { ChallengeQueryParams } from "@/hooks/useChallengesFilters";

export const useAllChallenges = (params: ChallengeQueryParams = {}) => {
  const fetcher = async () => {
    const sp = new URLSearchParams();

    if (params.search) sp.set("search", params.search);
    if (params.difficulties) sp.set("difficulties", params.difficulties);
    if (params.status) sp.set("statuses", params.status);
    if (params.tags) sp.set("tags", params.tags);

    const qs = sp.toString();
    const url = `/api/all-challanges${qs ? `?${qs}` : ""}`;

    const { data } = await axiosClient.get(url);
    return data?.data?.challenges;
  };

  return useQuery({
    queryKey: [QueryKey.GetAllChallenges, params],
    queryFn: fetcher,
  });
};
