/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useCallback, useMemo } from "react";
import { Assets } from "@/constants/assets";

type OAuthProvider = "google" | "linkedin" | "github";

type SocialButton = {
  name: string;
  image: string;
  provider: OAuthProvider;
};


function buildOAuthRedirectUrl(provider: OAuthProvider) {
  return `https://api.funcsters.io/oauth2/authorization/${provider}`;
}

export const SocialLoginButtons: React.FC = () => {
  const socialButtons = useMemo<SocialButton[]>(
    () => [
      { name: "Google", image: Assets.Images.GoogleImage, provider: "google" },
      {
        name: "LinkedIn",
        image: Assets.Images.LinkendImage,
        provider: "linkedin",
      },
      { name: "Github", image: Assets.Images.GithubImage, provider: "github" },
    ],
    [],
  );

  const handleProviderClick = useCallback((provider: OAuthProvider) => {
    const url = buildOAuthRedirectUrl(provider);
    window.location.assign(url);
  }, []);

  return (
    <div className="flex items-center justify-center gap-3 w-full">
      {socialButtons.map(({ name, image, provider }) => (
        <button
          key={provider}
          type="button"
          onClick={() => handleProviderClick(provider)}
          aria-label={`Continue with ${name}`}
          className="flex w-full items-center justify-center dark:border-[#FFFFFF4D] bg-transparent! dark:bg-input-background! gap-2 border py-2.5 px-3 rounded-lg cursor-pointer hover:bg-gray-100! dark:hover:bg-input-background/50! transition"
        >
          <img
            src={image}
            alt="social_icons"
            aria-hidden="true"
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
