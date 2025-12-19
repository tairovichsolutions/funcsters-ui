"use client";

import axios from "axios";
import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export const useCommunitySolutions = (
  challengeId: string | number,
  languageId: string | number,
  enabledFlag: boolean
) => {
  const userId = getCookie("userId");
  const fetchSolutions = async () => {
    const { data } = await axios.get(`/api/community-solution`, {
      params: { challengeId, languageId },
    });
    return data;
  };

  return useQuery({
    queryKey: [QueryKey.GetAllCommunitySolutions, challengeId, languageId],
    queryFn: fetchSolutions,
    enabled: !!userId && enabledFlag,
  });
};
