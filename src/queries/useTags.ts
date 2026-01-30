"use client";

import { QueryKey } from "@/constants/queryKey";
import { apiClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

export const useTags = () => {
  const fetcher = async () => {
    const { data } = await apiClient.get("/api/tags");
    return data;
  };

  return useQuery({
    queryKey: [QueryKey.GetTags],
    queryFn: fetcher,
  });
};
