"use client";

import { QueryKey } from "@/constants/queryKey";
import { axiosClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export const useActivityCalendar = (month?: string) => {
  const userId = getCookie("userId");

  const fetcher = async () => {
    const { data } = await axiosClient.get("/api/activity-calendar", {
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
