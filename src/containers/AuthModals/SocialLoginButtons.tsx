/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import toast from "react-hot-toast";
import { Assets } from "@/constants/assets";
import { OAuthProvider } from "@/mutations/useOauthLogin";
import { useAuthorizationUrl } from "@/queries/useAuthorizationUrl";

export const SocialLoginButtons: React.FC = () => {
  const googleQuery = useAuthorizationUrl("GOOGLE", false);
  const githubQuery = useAuthorizationUrl("GITHUB", false);
  const linkedinQuery = useAuthorizationUrl("LINKEDIN", false);

  const handleProviderClick = async (provider: OAuthProvider) => {
    try {
      const query =
        provider === "GOOGLE"
          ? googleQuery
          : provider === "LINKEDIN"
          ? linkedinQuery
          : githubQuery;

      const result = await query.refetch();

      const url = result.data?.data;
      if (!url) {
        toast.error(`Authorization URL not available for ${provider}`);
        return;
      }

      // eslint-disable-next-line react-hooks/immutability
      window.location.href = url;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to fetch authorization URL for ${provider}`
      );
    }
  };

  const socialButtons = [
    {
      name: "Google",
      image: Assets.Images.GoogleImage,
      provider: "GOOGLE" as OAuthProvider,
    },
    {
      name: "LinkedIn",
      image: Assets.Images.LinkendImage,
      provider: "LINKEDIN" as OAuthProvider,
    },
    {
      name: "Github",
      image: Assets.Images.GithubImage,
      provider: "GITHUB" as OAuthProvider,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-3 w-full">
      {socialButtons.map(({ name, image, provider }) => (
        <button
          key={name}
          type="button"
          onClick={() => handleProviderClick(provider)}
          className="flex w-full items-center justify-center dark:border-[#FFFFFF4D] bg-transparent!  dark:bg-input-background!  gap-2 border py-2.5 px-3 rounded-lg cursor-pointer hover:bg-gray-100! dark:hover:bg-input-background/50! transition"
        >
          <img
            src={image}
            alt={name}
            className="h-5 rounded-full object-contain"
          />
          <span className="text-medium-gray dark:text-white font-normal text-xs">
            {name}
          </span>
        </button>
      ))}
    </div>
  );
};
