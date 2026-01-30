"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Assets } from "@/constants/assets";
import { ChipSizeTypes, UserProgressTypes } from "@/types";
import { Tooltip } from "./tooltip";

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  withIcon?: boolean;
  withText?: boolean;
  size?: ChipSizeTypes;
  status: UserProgressTypes;
}

const SIZE: Record<ChipSizeTypes, string> = {
  xs: "text-[11px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const THEME: Record<UserProgressTypes, string> = {
  COMPLETED: "text-[#008D0F] ",
  TODO: "text-[#0055FF] ",
  IN_PROGRESS: "text-[#FFA600] ",
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

const TOOLTIP_BG: Record<UserProgressTypes, string> = {
  COMPLETED: "bg-[#008D0F]! text-white!",
  TODO: "bg-[#0055FF]! text-white!",
  IN_PROGRESS: "bg-[#FFA600]! text-white!",
} as const;

export const StatusChip = React.memo(
  ({
    status,
    size = "sm",
    withIcon = true,
    withText = true,
    label,
    className,
    ...rest
  }: StatusChipProps) => {
    const iconSrc = ICONS[status];
    const text = label ?? LABELS[status];

    const iconSize =
      size === "lg"
        ? ` ${withText ? "size-[28px]" : "size-[18px]"}`
        : size === "md"
        ? `${withText ? "size-4" : "size-4.5"}`
        : `${withText ? "size-4" : "size-4.5"}`;

    const chip = (
      <span
        role="status"
        aria-label={`Status: ${text}`}
        className={cn(
          "inline-flex shrink-0  items-center font-semibold gap-1 leading-none select-none ",
          SIZE[size],

          THEME[status],
          className
        )}
        {...rest}
      >
        {withIcon && (
          <Image
            alt={text}
            height={20}
            width={20}
            src={iconSrc}
            className={cn(iconSize, "shrink-0 object-contain")}
          />
        )}
        {withText && <span>{text}</span>}
      </span>
    );

    if (withText) return chip;

    return (
      <Tooltip
        place="top"
        bgColorClass={cn("font-semibold!  rounded-md!", TOOLTIP_BG[status])}
        content={text}
      >
        {chip}
      </Tooltip>
    );
  }
);
