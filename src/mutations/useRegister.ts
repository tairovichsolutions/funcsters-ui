import { QueryKey } from "@/constants/queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUpType } from "@/containers/AuthModals/SignUpForm.Modal";
import { apiClient } from "@/lib/axiosClient";
import { clearLoggedOut } from "@/lib/refreshToken";
import { notifyLoginStateChanged } from "@/hooks/useIsLoggedIn";

export const useRigester = () => {
  const client = useQueryClient();
  const rigesterfc = async (payload: signUpType) => {
    const URL = "/api/auth/register";

    const { status, data } = await apiClient.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: rigesterfc,
    onSuccess: () => {
      clearLoggedOut();
      notifyLoginStateChanged();
      setTimeout(() => {
        client.refetchQueries({ queryKey: [QueryKey.GetUserProfile] });
      }, 100);
    },
  });
};
