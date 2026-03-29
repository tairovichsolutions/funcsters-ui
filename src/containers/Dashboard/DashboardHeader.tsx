"use client";
import React, { useEffect, useState } from "react";
import { Assets } from "@/constants/assets";
import { Logo } from "@/components/ui/logo";
import { NavigationLinks } from "@/components";
import { ProfileAvatar } from "./ProfileAvatar";
import { NavItems } from "@/constants/navItems";
import { Button } from "@/components/ui/button";
import { SvgColor } from "@/components/ui/svg-color";
import { ThemeButton } from "@/components/ui/theme-button";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProfileAvatarSkeleton } from "@/skeletons/ProfileAvatarSkeleton";

export const DashboardHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useAuthModal();
  const searchParams = useSearchParams();
  const action = searchParams.get("auth");

  const { data: userData, isLoading } = useGetUserProfile();
  const isAuthenticated = userData?.data?.authenticated || false;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!action) return;
    if (action === "login") {
      openModal("login");
    }
    if (action === "signUp") {
      openModal("signUp");
    }
    router.replace("/challenges");
  }, [action, openModal, router]);

  return (
    <header className="py-3.5 h-[60px] w-full px-4 lg:px-12 dashboard-headers-class flex justify-between items-center">
      <div className="flex gap-7 items-center">
        <Logo />
        <div className="flex gap-5 items-center">
          {NavItems?.map((tab) => {
            const isActive = pathname === tab?.href;
            return (
              <NavigationLinks tab={tab} isActive={isActive} key={tab?.id} />
            );
          })}
        </div>
      </div>

      <div className="flex gap-5">
        <ThemeButton />
        <Button
          size={"icon"}
          variant={"ghost"}
          className="size-9! p-2.5"
          aria-label="Notifications"
        >
          <SvgColor src={Assets.Svgs.NotificationIcon} />
        </Button>

        {!mounted || isLoading ? (
          <ProfileAvatarSkeleton />
        ) : isAuthenticated ? (
          <ProfileAvatar userData={userData?.data?.user} />
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => openModal("signUp")}>Sign Up</Button>
            <Button onClick={() => openModal("login")} variant={"outline"}>
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
