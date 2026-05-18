"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { NavItemProps } from "@/constants/navItems";

interface NavigationLinksProps {
  tab: NavItemProps;
  isActive: boolean;
  className?: string;
  underLineClass?: string;
}

export const NavigationLinks = ({
  tab,
  isActive,
  className,
  underLineClass,
}: NavigationLinksProps) => {
  const href: string =
    typeof tab.href === "function" ? tab.href(tab.id) : tab.href;
  return (
    <Link
      href={href}
      className={cn(
        "relative text-[15px]  font-medium text-medium-gray dark:text-white px-1 text-nowrap transition-colors duration-500",
        isActive ? "text-primary" : "hover:text-primary/80",
        className
      )}
    >
      {tab.name}
      {isActive && (
        <motion.div
          layoutId="underline"
          className={cn(
            "absolute -bottom-5 left-0  w-full h-[2.5px] bg-primary",
            underLineClass
          )}
          transition={{ type: "spring", stiffness: 300, damping: 40 }}
        />
      )}
    </Link>
  );
};
