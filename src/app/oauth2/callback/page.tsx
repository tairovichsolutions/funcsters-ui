"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CustomLoading } from "@/components/ui/custom-loading";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) return;

    const run = async () => {
      try {
        const decoded = decodeURIComponent(code);
        const parsedData = JSON.parse(decoded);
        const { accessToken, id } = parsedData;

        // POST to our server-side API route so cookies are set httpOnly
        const res = await fetch("/api/auth/oauth2/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken, id }),
        });

        if (!res.ok) {
          console.error("OAuth2 callback route failed:", await res.text());
          return;
        }

        const redirectUrl = localStorage.getItem("redirectUrl");
        router.replace(redirectUrl || "/");
        localStorage.removeItem("redirectUrl");
      } catch (error) {
        console.error("OAuth Decode/Parse Error:", error);
      }
    };

    run();
  }, [code, router]);

  return (
    <div className="p-4 h-dvh w-full">
      <CustomLoading />
    </div>
  );
}
