/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey } from "@/constants/queryKey";
import { apiClient } from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  const client = useQueryClient();
  const updateProfilefc = async (payload: any) => {
    const URL = "/api/auth/update-profile";
    const { status, data } = await apiClient.patch(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: updateProfilefc,
    onSuccess: () => {
      client.refetchQueries({ queryKey: [QueryKey.GetUserProfile] });
    },
  });
};
