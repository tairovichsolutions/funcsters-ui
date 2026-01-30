"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import { Input } from "@/components/Input";
import { useDebounce } from "@/hooks/useDebounce";
import { ViewSwitch } from "@/containers/Challenges";
import { useTagOptions } from "@/hooks/useTagOptions";
import { Filters } from "@/hooks/useChallengesFilters";
import { TagSelector } from "@/components/TagSelector";
import FilterPills from "@/containers/Challenges/FilterPills";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Difficulty, Status } from "@/screens/ChallengesScreen.constants";

type ViewMode = "card" | "list";

type FiltersType = {
  search?: string;
  difficulty?: string;
  status?: string;
  tags?: any;
};

type ChallengesFiltersBarProps = {
  isFetching: boolean;
  isAuthenticated: boolean;
  currentView: ViewMode;
  filters: Filters;
  setSearch: (value: string) => void;
  setDifficulty: (value: any) => void;
  setStatus: (value: any) => void;
  setTags: (value: any) => void;
  remove: (key: keyof FiltersType, value?: any) => void;
  clearAll: () => void;
};

export const ChallengesFiltersBar = React.memo(
  ({
    isFetching,
    isAuthenticated,
    currentView,
    filters,
    setSearch,
    setDifficulty,
    setStatus,
    setTags,
    remove,
    clearAll,
  }: ChallengesFiltersBarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { tagOptions, tagLabelMap } = useTagOptions();
    const [searchInput, setSearchInput] = React.useState(filters.search || "");
    const debouncedSearch = useDebounce(searchInput, 100);

    React.useEffect(() => {
      setSearchInput(filters.search || "");
    }, [filters.search]);

    React.useEffect(() => {
      setSearch(debouncedSearch);
    }, [debouncedSearch, setSearch]);

    const onToggleView = React.useCallback(() => {
      const next: ViewMode = currentView === "card" ? "list" : "card";
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", next);
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [currentView, pathname, router, searchParams]);

    return (
      <div className="flex flex-col gap-2">
        <div className="flex lg:flex-row flex-col justify-between items-center gap-4">
          <Input
            placeholder="Search challenges..."
            inputClass="bg-white! dark:bg-[#FFFFFF0D]! border-searchInputBorder! px-3! lg:w-full xl:w-[500px]! w-full"
            aria-label="Search challenges"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target?.value ?? "")}
            startIcon="lucide:search"
            startIconClass="text-medium-gray"
            isLoading={isFetching}
            loadingIcon="lucide:loader-2"
          />

          <div className="flex flex-wrap justify-between lg:flex-nowrap lg:justify-end items-center gap-2 w-full">
            <div className="flex gap-2">
              <TagSelector
                className="md:w-36! bg-white! dark:bg-[#FFFFFF0D]!"
                label="Difficulty"
                tags={Difficulty as any}
                value={filters.difficulty}
                onChange={setDifficulty}
              />

              <TagSelector
                className="md:w-36! bg-white! dark:bg-[#FFFFFF0D]!"
                label="Tags"
                tags={tagOptions}
                value={filters.tags}
                onChange={setTags}
              />

              {isAuthenticated && (
                <TagSelector
                  className="md:w-36! bg-white! dark:bg-[#FFFFFF0D]!"
                  label="Status"
                  tags={Status as any}
                  value={filters.status}
                  onChange={setStatus}
                />
              )}
            </div>

            <ViewSwitch value={currentView} onChange={onToggleView} />
          </div>
        </div>

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
            if (key === "search" || key === "difficulty") {
              remove(key);
              return;
            }
            if (key === "status" || key === "tags") {
              remove(key, value);
            }
          }}
        />
      </div>
    );
  }
);
