"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Assets } from "@/constants/assets";
import { ChipSizeTypes, UserProgressTypes } from "@/types";

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  withIcon?: boolean;
  size?: ChipSizeTypes;
  status: UserProgressTypes;
}

const SIZE: Record<ChipSizeTypes, string> = {
  xs: "text-[11px] px-[14px] py-[5.6px]",
  sm: "text-xs px-[9px] py-[6px]",
  md: "text-sm px-[18px] py-[7px]",
  lg: "text-base px-[18px] py-[7px]",
};

const THEME: Record<UserProgressTypes, string> = {
  COMPLETED: "text-[#008D0F] bg-[#008D0F1A]",
  TODO: "text-[#0055FF]",
  IN_PROGRESS: "text-[#FFA600]",
} as const;

const LABELS: Record<UserProgressTypes, string> = {
  COMPLETED: "Completed",
  TODO: "Todo",
  IN_PROGRESS: "In progress",
} as const;

const ICONS: Record<UserProgressTypes, string> = {
  COMPLETED: Assets.Svgs.Completed,
  TODO: Assets.Svgs.Todo,
  IN_PROGRESS: Assets.Svgs.InProgress,
} as const;

export const StatusChip = React.memo(
  ({
    status,
    size = "sm",
    withIcon = true,
    label,
    className,
    ...rest
  }: StatusChipProps) => {
    const iconSrc = ICONS[status];

    const iconSize =
      size === "lg" ? "size-[18px]" : size === "md" ? "size-4" : "size-4";

    return (
      <span
        role="status"
        aria-label={`Status: ${label ?? LABELS[status]}`}
        className={cn(
          "inline-flex shrink-0  rounded-md py-2 items-center leading-none! h-fit gap-1 font-semibold select-none transition-colors",
          SIZE[size],
          THEME[status],
          className
        )}
        {...rest}
      >
        {withIcon && (
          <Image
            alt={iconSrc}
            height={20}
            width={20}
            src={iconSrc}
            className={cn(iconSize, "shrink-0 object-contain")}
          />
        )}
        <span>{label ?? LABELS[status]}</span>
      </span>
    );
  }
);
