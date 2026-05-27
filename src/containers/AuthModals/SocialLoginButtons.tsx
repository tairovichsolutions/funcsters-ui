/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useCallback, useMemo } from "react";
import { Assets } from "@/constants/assets";
import { OAUTH2_BASE_URL } from "@/constants/oauth";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearLoggedOut } from "@/lib/refreshToken";
import { notifyLoginStateChanged } from "@/hooks/useIsLoggedIn";

type OAuthProvider = "google" | "linkedin" | "github";

type SocialButton = {
  name: string;
  image: string;
  provider: OAuthProvider;
};

function buildOAuthRedirectUrl(provider: OAuthProvider) {
  return `${OAUTH2_BASE_URL}/oauth2/authorization/${provider}?display=popup`;
}

export const SocialLoginButtons: React.FC = () => {
  const { setAuthError, closeModal } = useAuthModal();
  const router = useRouter();

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

  const handleProviderClick = useCallback(
    (provider: OAuthProvider) => {
      setAuthError(null);
      const url = buildOAuthRedirectUrl(provider);

      // Calculate popup position
      const width = 500;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        url,
        "oauth-popup",
        `width=${width},height=${height},left=${left},top=${top},status=no,location=no`,
      );

      if (!popup) {
        toast.error("Popup blocked! Please allow popups for this site.");
        return;
      }

      // Listener for popup results
      const messageListener = async (event: MessageEvent) => {
        // SECURITY: Only accept messages from our backend origin
        // Use URL constructor to normalize origins (removes trailing slashes)
        const expectedOrigin = new URL(OAUTH2_BASE_URL).origin;
        if (event.origin !== expectedOrigin) return;

        if (event.data?.type === "PORTAL_AUTH_RESULT") {
          window.removeEventListener("message", messageListener);
          const { status, message } = event.data;

          if (status === "success") {
            if (message.startsWith("data=")) {
              // Standard login success -> handle via our callback API
              const dataStr = message.replace("data=", "");
              const tokenData = JSON.parse(decodeURIComponent(dataStr));

              try {
                const res = await fetch("/api/auth/oauth2/callback", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(tokenData),
                });
                if (res.ok) {
                  closeModal();
                  clearLoggedOut();
                  notifyLoginStateChanged();
                  router.refresh();
                } else {
                  toast.error("Failed to complete social login.");
                }
              } catch {
                toast.error("Failed to complete social login.");
              }
            }
          } else {
            // Error case (e.g. email_exists)
            setAuthError(message);
          }
        }
      };

      window.addEventListener("message", messageListener);
    },
    [setAuthError, closeModal, router],
  );

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
