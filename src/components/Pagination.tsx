"use client";

import * as React from "react";
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectContent,
  SelectTrigger,
} from "./ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildRange, calcTotalPages, clampToRange, cn } from "@/lib";

type PageChangeHandler = (page: number) => void;
type PageSizeChangeHandler = (size: number) => void;

export type PaginationProps = {
  totalItems: number;
  page: number;
  pageSize: number;
  onPageChange: PageChangeHandler;
  onPageSizeChange?: PageSizeChangeHandler;
  pageSizeOptions?: number[];
  siblingCount?: number;
  className?: string;
  disabled?: boolean;
};

export const Pagination = React.memo(
  ({
    totalItems,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
    siblingCount = 1,
    className = "",
    disabled = false,
  }: PaginationProps) => {
    const totalPages = React.useMemo(
      () => calcTotalPages(totalItems, pageSize),
      [totalItems, pageSize]
    );

    const current = clampToRange(page, 1, totalPages);
    const range = React.useMemo(
      () => buildRange(current, totalPages, siblingCount),
      [current, totalPages, siblingCount]
    );

    const from = totalItems === 0 ? 0 : (current - 1) * pageSize + 1;

    const canPrev = current > 1 && !disabled;
    const canNext = current < totalPages && !disabled;

    const goToPage = (p: number) => {
      const next = clampToRange(p, 1, totalPages);
      if (next !== current && !disabled) onPageChange(next);
    };

    return (
      <div
        className={cn(
          "flex lg:flex-row flex-col w-full items-center justify-center lg:justify-between  gap-3 flex-wrap ",
          className
        )}
      >
        {onPageSizeChange && (
          <div className="lg:flex hidden items-center gap-1">
            <Select onValueChange={(val) => onPageSizeChange?.(Number(val))}>
              <SelectTrigger className=" text-black dark:text-white ">
                {from} / {totalItems} page
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {pageSizeOptions.map((opt) => (
                    <SelectItem key={opt} value={String(opt)}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-7 w-7 rounded-lg border  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            onClick={() => goToPage(current - 1)}
            disabled={!canPrev}
          >
            <ChevronLeft size={17} color="#878787" />
          </button>

          <div className="flex items-center gap-1">
            {range?.map((token, idx) =>
              token === "..." ? (
                <span
                  key={`dots-${idx}`}
                  className="px-2 text-sm text-muted-foreground select-none"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <button
                  key={token}
                  type="button"
                  onClick={() => goToPage(token)}
                  className={[
                    "min-w-7 h-7 p-1 flex justify-center items-center rounded-md  text-sm cursor-pointer text-medium-gray font-semibold",
                    token === current
                      ? "bg-primary text-white border-pribg-primary"
                      : "hover:bg-muted",
                  ].join(" ")}
                  disabled={disabled}
                >
                  {token}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            className="h-7 w-7 rounded-md border  disabled:opacity-50 disabled:cursor-not-allowed  flex items-center justify-center cursor-pointer"
            onClick={() => goToPage(current + 1)}
            disabled={!canNext}
            aria-label="Next page"
          >
            <ChevronRight size={17} color="#878787" />
          </button>
        </div>
      </div>
    );
  }
);
