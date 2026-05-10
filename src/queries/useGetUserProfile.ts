"use client";

import { QueryKey } from "@/constants/queryKey";
import { apiClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

/**
 * SECURITY FIX: Fetch user profile via /api/users/me instead of
 * /api/users/${userId}. The user identity is now derived from the
 * JWT token on the backend, not from a client-manipulable cookie.
 */
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

export const useGetUserProfile = () => {
  const loggedIn = useIsLoggedIn();

  const GetUserProfileFn = async () => {
    if (!loggedIn) return { status: 401, data: null };
    const { status, data } = await apiClient.get(`/api/users/me`, {
      withCredentials: true,
    });
    return { status, data };
  };

  return useQuery({
    queryKey: [QueryKey.GetUserProfile, loggedIn],
    queryFn: GetUserProfileFn,
    enabled: loggedIn,
  });
};
