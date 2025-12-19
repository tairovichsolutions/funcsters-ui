"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Scrollable } from "@/components";
import type { Filters } from "@/hooks/useChallengesFilters";

interface FilterPillsTypes {
  filters: Filters;
  labels?: {
    difficulty?: Record<string, string>;
    status?: Record<string, string>;
    tags?: Record<string, string>;
  };
  onClearAll: () => void;
  onRemove: (key: keyof Filters, value?: string) => void;
}

export const FilterPills = React.memo(
  ({ filters, labels = {}, onClearAll, onRemove }: FilterPillsTypes) => {
    const items: { key: keyof Filters; id: string; label: string }[] = [];

    if (filters.search) {
      items.push({
        key: "search",
        id: "search",
        label: `Search: ${filters.search}`,
      });
    }

    (filters.difficulty || []).forEach((d) => {
      const label = labels.difficulty?.[d] ?? d;
      items.push({
        key: "difficulty",
        id: d,
        label: `Difficulty: ${label}`,
      });
    });

    (filters.status || []).forEach((s) => {
      const label = labels.status?.[s] ?? s;
      items.push({
        key: "status",
        id: s,
        label: `Status: ${label}`,
      });
    });

    (filters.tags || []).forEach((t) => {
      const label = labels.tags?.[t] ?? t;
      items.push({
        key: "tags",
        id: t,
        label: `#${label}`,
      });
    });

    if (items?.length === 0) return null;

    return (
      <div className="flex  overflow-hidden text-nowrap items-center mt-2 font-semibold">
        <Scrollable className="  w-fit  overflow-x-auto ">
          <div className="flex! gap-2! pr-4">
            {items?.map((it) => (
              <span
                key={`${it?.key}:${it?.id}`}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-filterChipBackground! text-xs"
              >
                <span>{it.label}</span>

                <button
                  className="cursor-pointer p-0.5 hover:bg-red-200 dark:hover:bg-red-600/20 hover:text-red-600 rounded-full"
                  onClick={() =>
                    onRemove(it?.key, it?.id === "search" ? undefined : it?.id)
                  }
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </Scrollable>

        <button
          onClick={onClearAll}
          className="ml-2 text-xs underline cursor-pointer hover:bg-filterChipBackground! py-1.5 px-3 rounded-full"
        >
          Clear Filter
        </button>
      </div>
    );
  }
);

export default FilterPills;
