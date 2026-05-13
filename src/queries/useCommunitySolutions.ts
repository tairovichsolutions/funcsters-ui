"use client";

import { apiClient } from "@/lib/axiosClient";
import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

export type SortKey = "top_rated" | "most_genius" | "most_solid" | "newest";

export const useCommunitySolutions = (
  challengeId: string | number,
  languageId: string | number,
  enabledFlag: boolean,
  sort: SortKey = "top_rated",
) => {
  const loggedIn = useIsLoggedIn();
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
    enabled: loggedIn && enabledFlag,
  });
};
