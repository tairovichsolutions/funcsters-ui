"use client";

import { apiClient } from "@/lib/axiosClient";
import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

export const useActivityCalendar = (month?: string) => {
  const loggedIn = useIsLoggedIn();

  const fetcher = async () => {
    const { data } = await apiClient.get("/api/activity-calendar", {
      params: month ? { month } : undefined,
    });
    return data?.data;
  };

  return useQuery({
    queryKey: [QueryKey.GetActivityCalendar, month],
    queryFn: fetcher,
    enabled: loggedIn,
  });
};
