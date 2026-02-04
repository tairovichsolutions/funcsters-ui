"use client";
import React from "react";
import { cn } from "@/lib/utils";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface TooltipType {
  children: React.ReactNode;
  content: React.ReactNode;
  enabled?: boolean;
  place?:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";
  trigger?: "hover" | "click";
  variant?: "light" | "dark";
  delayShow?: number;
  delayHide?: number;
  className?: string;
  bgColorClass?: string;
  childrenClass?: string;
}

export const Tooltip = React.memo(function Tooltip({
  content,
  children,
  enabled = true,
  className,
  childrenClass,
  place = "top",
  delayShow = 150,
  delayHide = 100,
  trigger = "hover",
  variant = "light",
  bgColorClass = "dark:!bg-gray-700 !bg-[#005092] !text-white",
}: TooltipType) {
  const tooltipId = React.useId();

  return (
    <>
      <span
        {...(enabled ? { "data-tooltip-id": tooltipId } : {})}
        className={cn(
          "block min-w-0",
          childrenClass,
        )}
      >
        {children}
      </span>

      {enabled ? (
        <ReactTooltip
          place={place}
          id={tooltipId}
          variant={variant}
          delayShow={delayShow}
          delayHide={delayHide}
          openOnClick={trigger === "click"}
          className={cn(
            "rounded-lg! text-[11px]! py-1.5! px-4 z-99999!",
            bgColorClass,
            className,
          )}
          render={() => (
            <div className="max-w-[350px] whitespace-normal ">
              {content}
            </div>
          )}
        />
      ) : null}
    </>
  );
});
