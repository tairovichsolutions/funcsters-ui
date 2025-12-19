"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Assets } from "@/constants/assets";
import { useGetUserProfile } from "@/queries/useGetUserProfile";

interface LogoProp {
  src?: string;
  href?: string;
  width?: number;
  height?: number;
  className?: string;
  imageClass?: string;
}

export const Logo = ({
  href = "/",
  width = 0,
  height = 0,
  className,
  imageClass,
}: LogoProp) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const logoSrc = isDark ? Assets.Svgs.Logo : Assets.Svgs.Logo;

  const { data: userData } = useGetUserProfile();
  const isAuthenticated = userData?.data?.authenticated || false;

  return (
    <Link
      href={`${isAuthenticated ? "/challenges" : href}`}
      className={cn("flex items-center w-fit gap-2 select-none", className)}
      aria-label="Go to home"
    >
      <Image
        priority
        src={logoSrc}
        width={width}
        height={height}
        alt="funcster_logo"
        fetchPriority="high"
        className={cn(
          "w-auto h-9 object-contain mix-blend-difference",
          imageClass
        )}
      />
    </Link>
  );
};
