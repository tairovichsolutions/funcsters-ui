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
    const { data } = await refreshHttp.post("/api/auth/refresh-token", {});
    const token = data.accessToken;
    if (!token) {
      // Backend returned a response but without a valid token (e.g. 200 with
      // empty body on an already-invalidated refresh token).
      processQueue("");
      throw new Error("No accessToken in refresh response");
    }
    processQueue(token);
    return token;
  } catch (error) {
    processQueue("");
    throw error;
  } finally {
    isRefreshing = false;
  }
};
