import { QueryKey } from "@/constants/queryKey";
import { loginType } from "@/containers/AuthModals/LoginForm.Modal";
import { apiClient } from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  const client = useQueryClient();
  const loginfc = async (payload: loginType) => {
    const URL = "/api/auth/login";
    const { status, data } = await apiClient.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: loginfc,
    onSuccess: () => {
      client.refetchQueries({ queryKey: [QueryKey.GetUserProfile] });
      client.refetchQueries({ queryKey: [QueryKey.GetMetrics] });
      client.refetchQueries({ queryKey: [QueryKey.GetAllChallenges] });
      client.refetchQueries({ queryKey: [QueryKey.GetChallengeById] });
      client.refetchQueries({ queryKey: [QueryKey.GetMyCommunitySolutions] });
      client.refetchQueries({ queryKey: [QueryKey.GetAllCommunitySolutions] });
    },
  });
};
