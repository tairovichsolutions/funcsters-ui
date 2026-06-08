"use client";
import { useEffect } from "react";
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
import { LobbyNavLink } from "@/features/pair/components/LobbyNavLink";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import PrimaryContainer from "@/components/shared/container/PrimaryContainer";

export const DashboardHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useAuthModal();
  const searchParams = useSearchParams();
  const action = searchParams.get("auth");

  const loggedIn = useIsLoggedIn();
  const { data: userData, isLoading } = useGetUserProfile();
  const isAuthenticated = userData?.data?.authenticated || false;

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

  // Treat as loading if: (1) we know we're logged in but data hasn't arrived yet,
  // or (2) the useIsLoggedIn hook hasn't resolved yet (first render).
  const showSkeleton = (loggedIn && isLoading) || (loggedIn && !userData);

  // const lobbyLink = {
  //   id: "lobby0",
  //   name: "Lobby",
  //   href: '/pair/lobby',
  // }
  return (
    <>
      <div className="w-full dark:bg-[#232629]">
        <PrimaryContainer as="header" className="py-3.5 dark:bg-[#232629]   h-[60px]    flex justify-between items-center">
          <div className="flex xl:gap-7  items-center">
            <div className="xl:-ms-3 ">
              <Logo />
            </div>
            <div className="flex gap-5 items-center">
              {NavItems?.map((tab) => {
                const isActive = pathname === tab?.href;
                return (
                  <NavigationLinks tab={tab} isActive={isActive} key={tab?.id} />
                );
              })}
              {/* {isAuthenticated && <NavigationLinks tab={lobbyLink} isActive={pathname === lobbyLink?.href} key={lobbyLink?.id} />} */}
              {isAuthenticated && <LobbyNavLink />}
            </div>
          </div>

          <div className="flex gap-5">
            {/* <ThemeButton /> */}
            <Button
              size={"icon"}
              variant={"ghost"}
              className="size-9! p-2.5 "
              aria-label="Notifications"
            >
              <SvgColor src={Assets.Svgs.NotificationIcon} />
            </Button>

            {showSkeleton ? (
              <ProfileAvatarSkeleton />
            ) : isAuthenticated ? (
              <ProfileAvatar userData={userData?.data?.user} />
            ) : (
              <>
                <Button onClick={() => openModal("signUp")}>Sign Up</Button>
                <Button onClick={() => openModal("login")} variant={"outline"}>
                  Login
                </Button>
              </>
            )}
          </div>
        </PrimaryContainer>
      </div>
    </>
  );
};
