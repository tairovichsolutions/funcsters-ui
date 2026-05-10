"use client";
import { getCookie } from "cookies-next";
import { refreshAccessToken, isMarkedLoggedOut } from "./refreshToken";
import { apiClient } from "./axiosClient";

apiClient.interceptors.request.use((config) => {
  // If a logout is in progress, skip attaching the token entirely so
  // subsequent requests fail fast rather than looking authenticated.
  if (isMarkedLoggedOut()) {
    return config;
  }

  const token = getCookie("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // If the user has initiated logout, do NOT attempt a refresh. Let
    // the 401 propagate so React Query marks the queries as failed and
    // stops polling. This breaks the race where polling re-authenticates
    // the user after logout.
    if (isMarkedLoggedOut()) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        // The httpOnly accessToken cookie has been updated by the server
        // route. Next.js API routes read from the cookie store, not from
        // the Authorization header, so simply retrying is sufficient.
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — do NOT call logout() from here. The
        // refresh failure during logout is expected and calling
        // logout again would create an infinite loop. Simply reject
        // so the caller (React Query, mutation, etc.) handles it.
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
