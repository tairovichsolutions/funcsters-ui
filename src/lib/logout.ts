import axios from "axios";
import { markLoggedOut } from "./refreshToken";
import { QueryClient } from "@tanstack/react-query";

/**
 * Global reference to the React Query client, set once by the
 * ReactQueryProvider on mount. Allows the non-hook logout() function
 * to cancel all in-flight queries and clear the cache before the
 * cookies are removed — preventing a 401-driven refresh from
 * re-establishing the session.
 */
let _queryClient: QueryClient | null = null;

export function registerQueryClient(qc: QueryClient) {
  _queryClient = qc;
}

/**
 * Delete browser-visible cookies to guarantee they're gone even if the
 * /api/auth/logout server route hasn't completed yet or if a
 * simultaneous refresh-token call re-sets them.
 */
function clearClientCookies() {
  if (typeof document === "undefined") return;
  // accessToken is httpOnly so we can't clear it from JS — but userId
  // and any non-httpOnly tokens we can.
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `userId=; path=/; expires=${expires}`;
  // accessToken is httpOnly, we rely on the server route to delete it.
  // But clear any non-httpOnly copies just in case.
  document.cookie = `accessToken=; path=/; expires=${expires}`;
}

export async function logout() {
  // 1. Mark as logged out FIRST so the interceptor stops refreshing.
  markLoggedOut();

  // 2. Stop all React Query polling and in-flight fetches immediately.
  if (_queryClient) {
    _queryClient.cancelQueries();
    _queryClient.clear();
  }

  // 3. Clear client-side cookies immediately.
  clearClientCookies();

  // 4. Call the server to delete httpOnly cookies and invalidate the
  //    refresh token in the database.
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
  } catch {
    // Even if the server call fails, we've already cleared local state.
    // The user will be logged out from the browser's perspective.
  }

  // 5. Hard redirect — window.location.href forces a full page load,
  //    which drops any in-memory state (React Query cache, axios
  //    interceptor queues, STOMP connections, etc.).
  window.location.href = "/challenges";
}
