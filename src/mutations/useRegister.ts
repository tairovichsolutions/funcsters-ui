/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { QueryKey } from "@/constants/queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRigester = () => {
  const client = useQueryClient();
  const rigesterfc = async (payload: any) => {
    const URL = "/api/auth/register";

    const { status, data } = await axios.post(URL, payload, {
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
