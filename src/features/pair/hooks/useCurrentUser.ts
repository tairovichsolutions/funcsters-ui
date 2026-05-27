"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axiosClient";

interface UserDto {
  id: number;
  username: string;
  email?: string;
  country?: string;
  countryFlag?: string;
  avatarUrl?: string;
}

/**
 * SECURITY FIX: Fetch the current user via /api/users/me instead of
 * reading the userId cookie and calling /api/users/${userId}.
 *
 * The userId cookie was non-httpOnly and could be tampered with in
 * DevTools, enabling IDOR (Insecure Direct Object Reference) attacks.
 * Now the backend derives the user identity from the JWT token.
 *
 * Result is cached by React Query so the fetch only happens once per session.
 */
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

export function useCurrentUser() {
  const loggedIn = useIsLoggedIn();

  return useQuery({
    queryKey: ["current-user", loggedIn],
    queryFn: async (): Promise<UserDto | null> => {
      if (!loggedIn) return null;
      const { data } = await apiClient.get<{ authenticated: boolean; user?: UserDto }>(
        `/api/users/me`
      );
      return data.authenticated && data.user ? data.user : null;
    },
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    retry: false,
    enabled: loggedIn,
  });
}
