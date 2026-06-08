"use client";

import { cn } from "@/lib";
import * as React from "react";
import { LayoutGrid, List } from "lucide-react";

type View = "card" | "list";

type Props = {
  value: View;
  onChange: (v: View) => void;
  className?: string;
};

export const ViewSwitch = React.memo(
  ({ value, onChange, className }: Props) => {
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        onChange(value === "card" ? "list" : "card");
      }
    };

    return (
      <div
        role="group"
        aria-label="View switch"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={cn(
          "relative h-9 w-24 inline-flex items-center rounded-md border  overflow-hidden dark:border-[#2F3136] border-searchInputBorder bg-transparent",
          " focus:outline-none focus:ring-2 focus:ring-blue-500/30",
          className
        )}
      >
        <div
          aria-hidden
          className={cn(
            "absolute top-0 left-0 h-full w-1/2  transition-transform duration-200",
            "bg-primary"
          )}
          style={{
            transform: value === "card" ? "translateX(0%)" : "translateX(100%)",
          }}
        />

        <button
          type="button"
          aria-pressed={value === "card"}
          onClick={() => onChange("card")}
          className={cn(
            "relative z-10 w-1/2 h-full flex dark:text-white items-center justify-center rounded-full cursor-pointer",
            "transition-colors"
          )}
        >
          <LayoutGrid
            size={18}
            fill={value === "card" ? "#fff" : "#008CFF"}
            color={value === "card" ? "#ffffff" : "#008CFF"}
            className={cn(
        
              value === "card" ? "text-white" : "text-black dark:text-white"
            )}
          />
        </button>

        <button
          type="button"
          aria-pressed={value === "list"}
          onClick={() => onChange("list")}
          className={cn(
            "relative z-10 w-1/2 h-full flex items-center justify-center rounded-md cursor-pointer",
            "transition-colors"
          )}
        >
          <List
            size={18}
            className={cn(
              value === "list" ? "text-white" : "text-black dark:text-white!"
            )}
          />
        </button>
      </div>
    );
  }
);
