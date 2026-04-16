"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axiosClient";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

interface UserDto {
  id: number;
  username: string;
  email?: string;
  country?: string;
  countryFlag?: string;
  avatarUrl?: string;
}

/**
 * Reads the userId from the non-httpOnly cookie (set at login) and fetches
 * the current user's profile via the existing /api/users/[id] route.
 * Result is cached by React Query so the fetch only happens once per session.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async (): Promise<UserDto | null> => {
      const userId = readCookie("userId");
      if (!userId) return null;
      const { data } = await apiClient.get<{ authenticated: boolean; user?: UserDto }>(
        `/api/users/${userId}`
      );
      return data.authenticated && data.user ? data.user : null;
    },
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}
