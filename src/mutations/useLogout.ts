"use client";

import { useMutation } from "@tanstack/react-query";
import { logout } from "@/lib/logout";

/**
 * Logout mutation that delegates to the centralized logout() function.
 * The old implementation called apiClient (which goes through the
 * interceptor) and only cleared the React Query cache on success — but
 * the interceptor's 401 handling could re-authenticate the user before
 * the cache was cleared, creating an impossible-to-logout loop.
 *
 * The new logout() function marks the session as logged-out FIRST,
 * cancels all queries, clears cookies, and then calls the server.
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await logout();
      // logout() already does a hard redirect, so we'll never reach here
      // in normal operation. Return a value for type safety.
      return { status: 200, data: { success: true } };
    },
    onError: (err) => {
      console.error("Logout failed", err?.message ?? err);
    },
  });
};
