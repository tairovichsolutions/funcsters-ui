"use client";

import React from "react";
import { cn } from "@/lib";
import { ChipSizeTypes, DifficultyLevelTypes } from "@/types";

const SIZE: Record<ChipSizeTypes, string> = {
  xs: "text-[11px] px-[14px] py-[5px]",
  sm: "text-xs px-[16px] py-[6px]",
  md: "text-sm px-[18px] py-[7px]",
  lg: "text-base px-[18px] py-[7px]",
};
const THEME: Record<DifficultyLevelTypes, string> = {
  EASY: "border-[#008D0F33] bg-[#5DBD2D1A] text-[#5DBD2D]",
  MEDIUM: "border-[#FFA60033] bg-[#FFA6001A] text-[#FFA600]",
  HARD: "border-[#D73D3D33] bg-[#D73D3D1A] text-[#D73D3D]",
  EXPERT: "border-[#6B4EFF33] bg-[#6B4EFF1A] text-[#6B4EFF]",
};

const LABELS: Record<DifficultyLevelTypes, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
  EXPERT: "Expert",
};

export interface DifficultyChipProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  level: DifficultyLevelTypes;
  size?: ChipSizeTypes;
}

export const DifficultyChip = React.memo(
  ({ level, size = "sm", className, ...rest }: DifficultyChipProps) => {
    return (
      <span
        role="status"
        aria-label={`Difficulty: ${LABELS[level]}`}
        className={cn(
          "inline-flex h-fit leading-none! select-none items-center rounded-[21px] border font-medium transition-colors",
          SIZE[size],
          THEME[level],
          className
        )}
        {...rest}
      >
        {LABELS[level]}
      </span>
    );
  }
);
