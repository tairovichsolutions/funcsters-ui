"use client";

import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axiosClient";

export const useAuthorizationUrl = (
  provider?: string,
  enabled: boolean = true,
) => {
  const queryFn = async () => {
    const { data } = await apiClient.get(
      `/api/auth/oauth2/authorization-url/${provider}`,
    );

    return data?.data;
  };

  return useQuery({
    queryKey: [QueryKey.GetAuthorizationUrl],
    queryFn,
    enabled,
  });
};
