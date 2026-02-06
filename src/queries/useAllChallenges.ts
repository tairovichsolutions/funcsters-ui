"use client";

import { QueryKey } from "@/constants/queryKey";
import { apiClient } from "@/lib/axiosClient";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ChallengeQueryParams } from "@/hooks/useChallengesFilters";

const PAGE_SIZE = 16;

export const useInfiniteChallenges = (params: ChallengeQueryParams = {}) => {
  const fetchPage = async ({ pageParam = 0 }: { pageParam?: number }) => {
    const sp = new URLSearchParams();

    sp.set("page", String(pageParam));
    sp.set("size", String(PAGE_SIZE));

    if (params.search) sp.set("search", params.search);
    if (params.difficulties) sp.set("difficulties", params.difficulties);
    if (params.status) sp.set("statuses", params.status);
    if (params.tags) sp.set("tags", params.tags);

    const url = `/api/all-challanges?${sp.toString()}`;
    const { data } = await apiClient.get(url);
    const challenges = data?.data?.challenges ?? [];
    const hasMore = challenges.length === PAGE_SIZE;

    return {
      challenges,
      nextPage: hasMore ? pageParam + 1 : undefined,
    };
  };

  return useInfiniteQuery({
    queryKey: [QueryKey.GetAllChallenges, params],
    queryFn: fetchPage,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
