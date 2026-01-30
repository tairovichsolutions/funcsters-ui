// lib/auth/refreshToken.ts
import axios from "axios";

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

const processQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

const refreshHttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FUNCSTER_BACKEND_URL, // client-safe env var
  withCredentials: true,
});

export const refreshAccessToken = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve) => refreshQueue.push(resolve));
  }

  isRefreshing = true;

  try {
    const { data } = await refreshHttp.post("/api/auth/refresh-token", {});
    // If you store access token in a cookie, ideally set it server-side (httpOnly).
    // If you're storing it client-side, setCookie here (but NOT httpOnly).
    processQueue(data.accessToken);
    return data.accessToken;
  } catch (error) {
    processQueue("");
    throw error;
  } finally {
    isRefreshing = false;
  }
};
