/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey } from "@/constants/queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useLogin = () => {
  const client = useQueryClient();
  const loginfc = async (payload: any) => {
    const URL = "/api/auth/login";
    const { status, data } = await axios.post(URL, payload, {
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
      client.refetchQueries({ queryKey: [QueryKey.GetAllChallenges] });
      client.refetchQueries({ queryKey: [QueryKey.GetChallengeById] });
      client.refetchQueries({ queryKey: [QueryKey.GetMyCommunitySolutions] });
      client.refetchQueries({ queryKey: [QueryKey.GetAllCommunitySolutions] });
    },
  });
};
