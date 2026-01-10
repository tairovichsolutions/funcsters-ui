/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components";
import { Input } from "@/components/Input";
import type { ChallengesTypes } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Navigation } from "@/constants/navigation";
import { Separator } from "@/components/ui/separator";
import { PopoverClose } from "@radix-ui/react-popover";
import { TagSelector } from "@/components/TagSelector";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FilterPills from "@/containers/Challenges/FilterPills";
import { DifficultyChip } from "@/components/ui/difficulty-chip";
import { DataNotAvailable } from "@/components/ui/data-not-available";
import { ProblemListSkeleton } from "@/skeletons/ProblemListSkeleton";
import { Difficulty, Status } from "@/screens/ChallengesScreen.constants";

const PAGE_SIZE = 10;

type ApiTag = {
  id: string;
  label: string;
};

type FiltersState = {
  search: string;
  tags: string[];
  status: string[];
  difficulty: string[];
};

type RemoveFilterFn = (key: keyof FiltersState, value?: string) => void;

interface ProblemListpopoverProps {
  isLoading: boolean;
  data: ChallengesTypes[];
  filters: FiltersState;
  remove: RemoveFilterFn;
  clearAll: () => void;

  tagOptions: ApiTag[];
  tagLabelMap: Record<string, string>;

  setSearch: (value: string) => void;
  setTags: (values: string[]) => void;
  setStatus: (values: string[]) => void;
  setDifficulty: (values: string[]) => void;
}

export const ProblemListpopover = React.memo(
  ({
    data,
    remove,
    setTags,
    filters,
    clearAll,
    setStatus,
    setSearch,
    isLoading,
    tagOptions,
    tagLabelMap,
    setDifficulty,
  }: ProblemListpopoverProps) => {
    const [page, setPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState(filters.search ?? "");

    const debouncedSearchTerm = useDebounce(searchTerm, 700);

    React.useEffect(() => {
      setSearchTerm(filters.search ?? "");
    }, [filters.search]);

    React.useEffect(() => {
      setSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, setSearch]);

    const totalItems = data?.length;

    const totalPages = React.useMemo(
      () =>
        totalItems > 0 ? Math.max(1, Math.ceil(totalItems / PAGE_SIZE)) : 1,
      [totalItems]
    );

    React.useEffect(() => {
      setPage(1);
    }, [filters.search, filters.difficulty, filters.status, filters.tags]);

    const pageItems = React.useMemo(() => {
      if (totalItems === 0) return [];
      const startIndex = (page - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      return data?.slice(startIndex, endIndex);
    }, [data, page, totalItems]);

    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    const hasActiveFilters =
      (filters.search && filters.search.trim()?.length > 0) ||
      filters.difficulty?.length > 0 ||
      filters.status?.length > 0 ||
      (Array.isArray(filters.tags) && filters.tags?.length > 0);

    const handleSearchChange = (e: any) => {
      const val = typeof e === "string" ? e : e?.target?.value ?? "";
      setSearchTerm(val);
    };

    const handlePrev = () => {
      if (hasPrev) setPage((p) => p - 1);
    };

    const handleNext = () => {
      if (hasNext) setPage((p) => p + 1);
    };

    return (
      <div className="flex flex-col w-full">
        <div className="p-4 border-b border-[#0000001A] dark:border-gray-600 sticky top-0 z-10 bg-background">
          <Input
            value={searchTerm}
            startIcon="lucide:search"
            onChange={handleSearchChange}
            placeholder="Search Challenges..."
            inputClass="bg-transparent! px-3! border-searchInputBorder!"
          />

          <div className="flex w-full items-center mt-3 gap-2">
            <div className="grid grid-cols-3 gap-2 flex-1">
              <TagSelector
                label="Difficulty"
                tags={Difficulty as any}
                value={filters.difficulty}
                className="rounded-md text-xs! py-1.5!"
                onChange={(selected: string[]) => setDifficulty(selected)}
              />

              <TagSelector
                label="Status"
                tags={Status as any}
                value={filters.status}
                className="rounded-md text-xs! py-1.5!"
                onChange={(selected: string[]) => setStatus(selected)}
              />

              <TagSelector
                label="Tags"
                tags={tagOptions}
                value={filters.tags}
                className="rounded-md text-xs! py-1.5!"
                onChange={(selected: string[]) => setTags(selected)}
              />
            </div>

            <div className="w-fit flex items-center">
              <Button
                size="icon-sm"
                disabled={!hasPrev}
                onClick={handlePrev}
                className="rounded-l-lg! rounded-r-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="icon-sm"
                onClick={handleNext}
                disabled={!hasNext}
                className="rounded-r-lg! rounded-l-none"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3">
              <FilterPills
                filters={filters}
                labels={{
                  difficulty: {
                    EASY: "Easy",
                    MEDIUM: "Medium",
                    HARD: "Hard",
                    EXPERT: "Expert",
                  },
                  status: {
                    TODO: "To-do",
                    COMPLETED: "Completed",
                    INPROGRESS: "In progress",
                  },
                  tags: tagLabelMap,
                }}
                onClearAll={clearAll}
                onRemove={(key, value) => {
                  if (key === "search") {
                    remove("search");
                    return;
                  }
                  if (
                    key === "difficulty" ||
                    key === "status" ||
                    key === "tags"
                  ) {
                    remove(key, value);
                  }
                }}
              />
            </div>
          )}
        </div>

        <div className="w-full px-4 py-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProblemListSkeleton key={i} />
              ))}
            </>
          ) : pageItems.length === 0 ? (
            <DataNotAvailable />
          ) : (
            <>
              {pageItems.map((item, i) => (
                <div key={item.id ?? i}>
                  <div className="flex justify-between gap-3 py-2">
                    <PopoverClose asChild>
                      <Link href={Navigation.ChallengesDetail(String(item.id))}>
                        <h3 className="text-sm font-medium">{item.title}</h3>
                      </Link>
                    </PopoverClose>
                    <DifficultyChip size="xs" level={item.difficulty} />
                  </div>
                  {i < pageItems.length - 1 && <Separator className="my-1" />}
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center items-center text-xs text-muted-foreground mt-2">
                  Page {page} of {totalPages}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);
