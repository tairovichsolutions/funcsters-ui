"use client";

import { apiClient } from "@/lib/axiosClient";
import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

export const useMetrics = () => {
  const loggedIn = useIsLoggedIn();

  const fetcher = async () => {
    const { data } = await apiClient.get("/api/metrics");

    return data?.data?.data;
  };

  return useQuery({
    queryKey: [QueryKey.GetMetrics],
    queryFn: fetcher,
    enabled: loggedIn,
  });
};
