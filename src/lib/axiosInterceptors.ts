"use client";
import { getCookie } from "cookies-next";
import { refreshAccessToken } from "./refreshToken";
import { logout } from "./logout";
import { apiClient } from "./axiosClient";

apiClient.interceptors.request.use((config) => {
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        await logout();
      }
    }

    return Promise.reject(error);
  },
);
