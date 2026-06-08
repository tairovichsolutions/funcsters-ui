import axios from "axios";

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

/**
 * Global flag that prevents the refresh-token flow from running after
 * the user has initiated a logout. Without this guard, the pair-polling
 * queries (firing every 3 s) race against logout: the interceptor sees a
 * 401, calls refreshAccessToken(), which successfully obtains a new
 * access-token and re-sets the cookies — making it impossible to log out.
 *
 * Set to `true` by the logout flow BEFORE the actual /api/auth/logout call.
 * Reset to `false` only on explicit login.
 */
let _loggedOut = false;

export function markLoggedOut() {
  _loggedOut = true;
}

export function clearLoggedOut() {
  _loggedOut = false;
}

export function isMarkedLoggedOut(): boolean {
  return _loggedOut;
}

const processQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

const refreshHttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FUNCSTER_BACKEND_URL, 
  withCredentials: true,
});

export const refreshAccessToken = async (): Promise<string> => {
  // If the user is logging out, do NOT try to refresh. Reject immediately
  // so the interceptor's catch branch does not attempt a second logout.
  if (_loggedOut) {
    throw new Error("Logged out – refresh suppressed");
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push((token) => {
        if (!token) {
          reject(new Error("Refresh failed"));
        } else {
          resolve(token);
        }
      });
    });
  }

  isRefreshing = true;

  try {
    const { data, status } = await refreshHttp.post("/api/auth/refresh-token", {});

    // The server route updates the httpOnly accessToken cookie.
    // We no longer receive the raw token in the response body (stripped
    // for XSS safety). The interceptor's retry works because Next.js API
    // routes read the updated cookie — not the Authorization header.
    if (status !== 200 || data?.message) {
      processQueue("");
      throw new Error(data?.message || "Refresh failed");
    }

    // Return a truthy sentinel so the interceptor knows to retry.
    // The actual auth is handled by the httpOnly cookie.
    processQueue("refreshed");
    return "refreshed";
  } catch (error) {
    processQueue("");
    throw error;
  } finally {
    isRefreshing = false;
  }
};
