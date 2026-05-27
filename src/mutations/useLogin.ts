import { QueryKey } from "@/constants/queryKey";
import { loginType } from "@/containers/AuthModals/LoginForm.Modal";
import { apiClient } from "@/lib/axiosClient";
import { clearLoggedOut } from "@/lib/refreshToken";
import { notifyLoginStateChanged } from "@/hooks/useIsLoggedIn";
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
      // Clear the logged-out flag so the interceptor resumes normal
      // token-refresh behavior for the newly authenticated session.
      clearLoggedOut();
      // Notify all useIsLoggedIn consumers that the cookie has changed
      notifyLoginStateChanged();
      // Wait for React's state update to propagate (loggedIn → true)
      // before refetching queries that depend on it being enabled
      setTimeout(() => {
        client.refetchQueries({ queryKey: [QueryKey.GetUserProfile] });
        client.refetchQueries({ queryKey: [QueryKey.GetMetrics] });
        client.refetchQueries({ queryKey: [QueryKey.GetAllChallenges] });
        client.refetchQueries({ queryKey: [QueryKey.GetChallengeById] });
        client.refetchQueries({ queryKey: [QueryKey.GetMyCommunitySolutions] });
        client.refetchQueries({ queryKey: [QueryKey.GetAllCommunitySolutions] });
      }, 100);
    },
  });
};
