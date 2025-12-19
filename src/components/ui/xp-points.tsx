import { cn } from "@/lib";
import Image from "next/image";
import React, { ReactNode } from "react";
import { Assets } from "@/constants/assets";

interface XPPointsProps {
  children: ReactNode;
  className?: string;
  variant?: "xs" | "sm";
}

export const XPPoints = React.memo(
  ({ children, className, variant = "sm", ...props }: XPPointsProps) => {
    return (
      <div
        className={cn(
          "flex items-center text-nowrap shrink-0 font-semibold text-[#FF9E2B] border border-[#FF9E2B] bg-[#FF9E2B33] rounded-[27px]",
          {
            "text-xs gap-1.5 py-2 pl-1.5 pr-3 h-[26px]!": variant === "xs",
            "text-sm gap-1 py-1.5 pl-1.5 pr-4": variant === "sm",
          },
          className
        )}
        {...props}
      >
        <Image
          src={Assets.Svgs.XpCoin}
          alt="xp_coin"
          width={variant === "xs" ? 14 : 20}
          height={variant === "xs" ? 14 : 20}
        />
        {children}
      </div>
    );
  }
);
