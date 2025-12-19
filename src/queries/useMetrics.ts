"use client";

import { axiosClient } from "@/lib/axiosClient";
import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export const useMetrics = () => {
  const userId = getCookie("userId");

  const fetcher = async () => {
    const { data } = await axiosClient.get("/api/metrics");

    return data?.data?.data;
  };

  return useQuery({
    queryKey: [QueryKey.GetMetrics],
    queryFn: fetcher,
    enabled: !!userId,
  });
};
