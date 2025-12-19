/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useOAuthLogin } from "@/mutations/useOauthLogin";
import { CustomLoading } from "@/components/ui/custom-loading";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const pathname = usePathname();
  const { mutateAsync: oauthLogin, isPending } = useOAuthLogin();

  useEffect(() => {
    if (!code) return;

    const provider = pathname?.split("/").pop()?.toUpperCase();
    const payload: any = {
      code,
      provider,
      payload: {
        redirectUri: process.env.FUNCSTER_APP_URL,
      },
    };

    const handleLogin = async () => {
      try {
        const res = await oauthLogin(payload);

        if (res?.status === 200) {
          toast.success("Social login successfull");
          router.replace("/");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "OAuth login failed");
      }
    };

    handleLogin();
  }, [searchParams, pathname, oauthLogin, router, code]);

  return (
    <div className="p-4 h-dvh w-full">{isPending && <CustomLoading />}</div>
  );
}
