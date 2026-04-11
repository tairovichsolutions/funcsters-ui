"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { setCookie } from "cookies-next/client";
import { CustomLoading } from "@/components/ui/custom-loading";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  const redirectUrl = localStorage.getItem("redirectUrl");

  useEffect(() => {
    if (!code) return;

    const run = async () => {
      try {
        const decoded = decodeURIComponent(code);

        const parsedData = JSON.parse(decoded);

        const { accessToken, id } = parsedData;

        setCookie("accessToken", accessToken, {
          path: "/",
          secure: true,
          sameSite: "lax",
          httpOnly: false,
          maxAge: 60 * 60,
        });

        setCookie("userId", String(id), {
          path: "/",
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60,
          httpOnly: false,
        });

        router.replace(redirectUrl || "/");

        localStorage.removeItem("redirectUrl");
      } catch (error) {
        console.error("OAuth Decode/Parse Error:", error);
      }
    };

    run();
  }, [code, router, redirectUrl]);

  return (
    <div className="p-4 h-dvh w-full">
      <CustomLoading />
    </div>
  );
}
