"use client";

import { cn } from "@/lib";
import { getCookie } from "cookies-next";
import { Iconify } from "@/components/ui/iconify";
import { ChallengesItems } from "@/constants/navItems";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { usePathname, useParams, useRouter } from "next/navigation";

export const ChallengesSubNav = () => {
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();
  const userId = getCookie("userId");
  const { openModal } = useAuthModal();

  const protectedTabNames = ["Community Solutions", "Thinking Assistant"];

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    href: string,
    itemName: string
  ) => {
    const isProtected = protectedTabNames.includes(itemName);

    if (isProtected && !userId) {
      e.preventDefault();
      openModal("loginRequiredModal");
      return;
    }

    router.push(href);
  };

  return (
    <div className="relative w-full items-center bg-[#0050921A] dark:bg-[#FFFFFF1A] grid grid-cols-3 gap-1.5 p-1.5 rounded-[7.99px]! overflow-hidden">
      {ChallengesItems.map((item, i) => {
        const href =
          typeof item.href === "function" ? item.href(id as string) : item.href;
        const isActive = pathname === href;

        return (
          <button
            key={i}
            type="button"
            onClick={(e) => handleClick(e, href, item.name)}
            className={cn(
              "relative text-[#737B83] dark:text-[#91989D] px-2 w-full justify-center flex items-center gap-2 cursor-pointer text-xs py-2 rounded-[7.99px]! transition-colors duration-200",
              isActive
                ? "text-white! font-semibold"
                : "hover:bg-[#008CFF]/10 font-medium"
            )}
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  layoutId="activeTabBg"
                  className="absolute inset-0 rounded-md bg-[#008CFF]"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </AnimatePresence>

            <Iconify
              iconName={item.icon}
              className={cn("size-[18px]! z-10 shrink-0 ")}
            />
            <span className="relative z-10 text-nowrap truncate">
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
