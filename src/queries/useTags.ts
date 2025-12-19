"use client";

import { QueryKey } from "@/constants/queryKey";
import { axiosClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

export const useTags = () => {
  const fetcher = async () => {
    const { data } = await axiosClient.get("/api/tags");
    return data;
  };

  return useQuery({
    queryKey: [QueryKey.GetTags],
    queryFn: fetcher,
  });
};
