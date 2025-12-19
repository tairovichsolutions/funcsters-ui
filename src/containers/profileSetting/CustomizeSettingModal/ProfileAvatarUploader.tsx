"use client";

import React from "react";
import { ImageUploader } from "@/components";

type ProfileAvatarUploaderProps = {
  username?: string;
  avatarUrl?: string | null;
  pendingFile?: File | null;
  onChange: (file: File | null) => void;
  loading?: boolean;
};

export const ProfileAvatarUploader: React.FC<ProfileAvatarUploaderProps> = ({
  username,
  avatarUrl,
  pendingFile,
  onChange,
  loading = false,
}) => {
  const fallbackLetter = username?.[0]?.toUpperCase() ?? "";

  const imageProp: string | File | null =
    pendingFile ??
    (avatarUrl
      ? avatarUrl.startsWith("http")
        ? avatarUrl
        : `http://www.funcsters.io/static${avatarUrl}`
      : null);

  return (
    <div>
      <ImageUploader
        image={imageProp}
        onChange={onChange}
        loading={loading}
        fallbackLetter={fallbackLetter}
      />
    </div>
  );
};
