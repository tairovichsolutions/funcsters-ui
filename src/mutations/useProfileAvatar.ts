"use client";

import { QueryKey } from "@/constants/queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axiosClient";

type UploadAvatarVariables = {
  id: string;
  file: File;
};

type UploadAvatarResponse = {
  status: number;
  data: unknown;
};

export const useProfileAvatar = () => {
  const client = useQueryClient();

  const profileAvatar = async (
    variables: UploadAvatarVariables,
  ): Promise<UploadAvatarResponse> => {
    const { id, file } = variables;

    const formData = new FormData();
    formData.append("file", file);

    const url = `/api/auth/profile-avatar/${id}`;

    const { status, data } = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: profileAvatar,
    onSuccess: () => {
      client.refetchQueries({ queryKey: [QueryKey.GetUserProfile] });
    },
  });
};
