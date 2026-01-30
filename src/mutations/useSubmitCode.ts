/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey } from "@/constants/queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axiosClient";

export const useSubmitCode = () => {
  const client = useQueryClient();

  const submitCodefc = async (payload: any) => {
    const URL = "/api/execution/submit";

    const { status, data } = await apiClient.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: submitCodefc,
    onSuccess: () => {
      client.refetchQueries({ queryKey: [QueryKey.GetMyCommunitySolutions] });
      client.refetchQueries({ queryKey: [QueryKey.GetChallengeById] });
      client.refetchQueries({ queryKey: [QueryKey.GetMetrics] });
    },
  });
};
