"use client";

import axios from "axios";
import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";

export const useChallengeById = (id?: string) => {
  const fetcher = async () => {
    const { data } = await axios.get(`/api/challenges/${id}`);
    return data?.data;
  };

  return useQuery({
    queryKey: [QueryKey.GetChallengeById],
    queryFn: fetcher,
  });
};
