/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import * as React from "react";
import { Input } from "@/components/Input";
import type { ChallengesTypes } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Navigation } from "@/constants/navigation";
import { Separator } from "@/components/ui/separator";
import { PopoverClose } from "@radix-ui/react-popover";
import { TagSelector } from "@/components/TagSelector";
import FilterPills from "@/containers/Challenges/FilterPills";
import { DifficultyChip } from "@/components/ui/difficulty-chip";
import { DataNotAvailable } from "@/components/ui/data-not-available";
import { ProblemListSkeleton } from "@/skeletons/ProblemListSkeleton";
import { Difficulty, Status } from "@/screens/ChallengesScreen.constants";
import { useInView } from "react-intersection-observer";
import { SyncLoader } from "react-spinners";

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
  hasNextPage: boolean;
  clearAll: () => void;
  tagOptions: ApiTag[];
  filters: FiltersState;
  remove: RemoveFilterFn;
  data: ChallengesTypes[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  allChallenges: ChallengesTypes[];
  setSearch: (value: string) => void;
  tagLabelMap: Record<string, string>;
  setTags: (values: string[]) => void;
  setStatus: (values: string[]) => void;
  setDifficulty: (values: string[]) => void;
}

export const ProblemListpopover = React.memo(
  ({
    remove,
    setTags,
    filters,
    clearAll,
    setStatus,
    setSearch,
    isLoading,
    tagOptions,
    tagLabelMap,
    hasNextPage,
    setDifficulty,
    allChallenges,
    fetchNextPage,
    isFetchingNextPage,
  }: ProblemListpopoverProps) => {
    const [searchTerm, setSearchTerm] = React.useState(filters.search ?? "");
    const debouncedSearchTerm = useDebounce(searchTerm, 700);

    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const [rootEl, setRootEl] = React.useState<Element | null>(null);

    React.useEffect(() => {
      setRootEl(scrollRef.current);
    }, []);

    const { ref: sentinelRef, inView } = useInView({
      root: rootEl,
      threshold: 0,
      rootMargin: "150px",
    });

    React.useEffect(() => {
      setSearchTerm(filters.search ?? "");
    }, [filters.search]);

    React.useEffect(() => {
      setSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, setSearch]);

    React.useEffect(() => {
      if (!inView) return;
      if (!hasNextPage) return;
      if (isLoading || isFetchingNextPage) return;

      fetchNextPage();
    }, [inView, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage]);

    const hasActiveFilters =
      (filters.search && filters.search.trim()?.length > 0) ||
      filters.difficulty?.length > 0 ||
      filters.status?.length > 0 ||
      (Array.isArray(filters.tags) && filters.tags?.length > 0);

    const handleSearchChange = (e: any) => {
      const val = typeof e === "string" ? e : e?.target?.value ?? "";
      setSearchTerm(val);
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

        <div
          ref={scrollRef}
          className="w-full px-4 py-2 max-h-[60vh] overflow-y-auto custom-scrollbar"
        >
          {isLoading ? (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProblemListSkeleton key={i} />
              ))}
            </>
          ) : allChallenges.length === 0 ? (
            <DataNotAvailable />
          ) : (
            <>
              {allChallenges.map((item, i) => (
                <div key={item.id ?? i}>
                  <div className="flex justify-between gap-3 py-2">
                    <PopoverClose asChild>
                      <Link href={Navigation.ChallengesDetail(String(item.id))}>
                        <h3 className="text-sm font-medium">{item.title}</h3>
                      </Link>
                    </PopoverClose>
                    <DifficultyChip size="xs" level={item.difficulty} />
                  </div>

                  {i < allChallenges.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))}

              {isFetchingNextPage && (
                <div className="flex justify-center items-center py-6">
                  <SyncLoader speedMultiplier={0.8} size={10} color="#018CFF" />
                </div>
              )}

              <div ref={sentinelRef} className="h-px" />
            </>
          )}
        </div>
      </div>
    );
  }
);
