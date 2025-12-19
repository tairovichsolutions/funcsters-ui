"use client";
import axios from "axios";
import { QueryKey } from "@/constants/queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type OAuthProvider = "GOOGLE" | "GITHUB" | "LINKEDIN";

interface OAuthLoginPayload {
  provider: OAuthProvider;
}

export const useOAuthLogin = () => {
  const client = useQueryClient();

  const oauthLoginFn = async (payload: OAuthLoginPayload) => {
    const URL = "/api/auth/oauth2/login";
    const { status, data } = await axios.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: oauthLoginFn,
    onSuccess: () => {
      client.refetchQueries({ queryKey: [QueryKey.GetUserProfile] });
    },
  });
};
