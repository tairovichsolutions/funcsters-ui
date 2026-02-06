"use client";

import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { apiClient } from "@/lib/axiosClient";

export const useMyCommunitySolutions = (
  challengeId: string | number,
  languageId: string | number,
  enabledFlag: boolean,
) => {
  const userId = getCookie("userId");
  const fetchSolutions = async () => {
    const { data } = await apiClient.get(`/api/my-community-solution`, {
      params: { challengeId, languageId },
    });
    return data;
  };

  return useQuery({
    queryKey: [QueryKey.GetMyCommunitySolutions, challengeId, languageId],
    queryFn: fetchSolutions,
    enabled: !!userId && enabledFlag,
  });
};
