"use client";

import { apiClient } from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const client = useQueryClient();

  const logoutFn = async () => {
    const URL = "/api/auth/logout";
    const resp = await apiClient.post(
      URL,
      {},
      {
        withCredentials: true,
      },
    );

    return { status: resp.status, data: resp.data };
  };

  return useMutation({
    mutationFn: logoutFn,
    onSuccess: (_data) => {
      client.clear();
    },
    onError: (err) => {
      console.error("Logout failed", err?.message ?? err);
    },
  });
};
