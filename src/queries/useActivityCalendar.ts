"use client";

import { getCookie } from "cookies-next";
import { apiClient } from "@/lib/axiosClient";
import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";

export const useActivityCalendar = (month?: string) => {
  const userId = getCookie("userId");

  const fetcher = async () => {
    const { data } = await apiClient.get("/api/activity-calendar", {
      params: month ? { month } : undefined,
    });
    return data?.data;
  };

  return useQuery({
    queryKey: [QueryKey.GetActivityCalendar, month],
    queryFn: fetcher,
    enabled: !!userId,
  });
};
