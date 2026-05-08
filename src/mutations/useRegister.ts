import { QueryKey } from "@/constants/queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUpType } from "@/containers/AuthModals/SignUpForm.Modal";
import { apiClient } from "@/lib/axiosClient";

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
      client.refetchQueries({ queryKey: [QueryKey.GetUserProfile] });
    },
  });
};
