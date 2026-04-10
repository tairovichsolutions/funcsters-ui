"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChipSizeTypes, TagChipVariantType } from "@/types";

export interface TagChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  size?: ChipSizeTypes;
  variant?: TagChipVariantType;
}

const SIZE: Record<ChipSizeTypes, string> = {
  xs: "text-xs px-[4px]",
  sm: "text-xs px-[16px] py-[6px]",
  md: "text-sm px-[18px] py-[7px]",
  lg: "text-base px-[18px] py-[7px]",
};

const THEME: Record<TagChipVariantType, string> = {
  blue: "bg-[#0050921A] text-[#005092] dark:text-primary",
  gray: "bg-[#0000000F] text-[#00000099]",
  green: "bg-[#16A34A1A] text-[#16A34A]",
  amber: "bg-[#FFA6001A] text-[#FFA600]",
  red: "bg-[#EE39391A] text-[#EE3939]",
};

export const TagChip = ({
  children,
  size = "sm",
  variant = "blue",
  className,
  ...rest
}: TagChipProps) => {
  return (
    <span
      className={cn(
        "rounded-[6px] w-fit leading-none! h-fit inline-flex items-center elect-none",
        SIZE[size],
        THEME[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};
