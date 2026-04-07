"use client";

import { getCookie } from "cookies-next";
import { apiClient } from "@/lib/axiosClient";
import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";

export type SortKey = "top_rated" | "most_genius" | "most_solid" | "newest";

export const useCommunitySolutions = (
  challengeId: string | number,
  languageId: string | number,
  enabledFlag: boolean,
  sort: SortKey = "top_rated",
) => {
  const userId = getCookie("userId");
  const fetchSolutions = async () => {
    const { data } = await apiClient.get(`/api/community-solution`, {
      params: { challengeId, languageId, sort },
    });
    return data;
  };

  return useQuery({
    queryKey: [
      QueryKey.GetAllCommunitySolutions,
      challengeId,
      languageId,
      sort,
    ],
    queryFn: fetchSolutions,
    enabled: !!userId && enabledFlag,
  });
};
