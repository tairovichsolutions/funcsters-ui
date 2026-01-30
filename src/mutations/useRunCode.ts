/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

export const useRunCode = () => {
  const runCodefc = async (payload: any) => {
    const URL = "/api/execution/run";

    const { status, data } = await apiClient.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: runCodefc,
  });
};
