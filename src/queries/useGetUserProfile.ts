"use client";

import { QueryKey } from "@/constants/queryKey";
import { axiosClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export const useGetUserProfile = () => {
  const userId = getCookie("userId");

  const GetUserProfileFn = async () => {
    if (!userId) throw new Error("User ID not found");
    const { status, data } = await axiosClient.get(`/api/users/${userId}`, {
      withCredentials: true,
    });
    return { status, data };
  };

  return useQuery({
    queryKey: [QueryKey.GetUserProfile],
    queryFn: GetUserProfileFn,
    enabled: !!userId,
  });
};
