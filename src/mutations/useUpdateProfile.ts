/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey } from "@/constants/queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateProfile = () => {
  const client = useQueryClient();
  const updateProfilefc = async (payload: any) => {
    const URL = "/api/auth/update-profile";
    const { status, data } = await axios.patch(URL, payload, {
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
