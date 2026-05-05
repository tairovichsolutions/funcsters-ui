"use client";

import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axiosClient";

export const useChallengeById = (id?: String) => {
  const fetcher = async () => {
    const { data } = await apiClient.get(`/api/challenges/${id}`);
    return data?.data;
  };

  return useQuery({
    queryKey: [QueryKey.GetChallengeById, id],
    queryFn: fetcher,
    enabled: !!id,
  });
};
