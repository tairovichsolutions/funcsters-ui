"use client";

import { apiClient } from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useDeleteAccount = () => {
  const client = useQueryClient();
  const router = useRouter();

  const deleteAccountFn = async () => {
    const URL = "/api/users/me";
    const resp = await apiClient.delete(URL, {
      withCredentials: true,
    });

    return { status: resp.status, data: resp.data };
  };

  return useMutation({
    mutationFn: deleteAccountFn,
    onSuccess: () => {
      // Clear all cached queries
      client.clear();
      // Redirect to landing page or home
      router.push("/");
      // Force a hard refresh to ensure all state is reset
      window.location.reload();
    },
    onError: (err: any) => {
      console.error("Account deletion failed", err?.response?.data?.message || err.message);
    },
  });
};
