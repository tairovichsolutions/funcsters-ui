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

export const ChallengesFiltersBarV2 = React.memo(
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
                <div className="border rounded-2xl ">
                    <div className="flex   flex-col justify-between items-center ">

                        <div className="bg-white p-4 rounded-t-2xl border-[#EFF0F3] w-full">
                            <Input
                                placeholder="Search challenges..."
                                inputClass="bg-[#F5F6F8]!  dark:bg-[#FFFFFF0D]! border-searchInputBorder! px-3! lg:w-full  w-full"
                                aria-label="Search challenges"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target?.value ?? "")}
                                startIcon="lucide:search"
                                startIconClass="text-medium-gray"
                                isLoading={isFetching}
                                loadingIcon="lucide:loader-2"
                            />
                        </div>


                        <div className="flex flex-wrap  rounded-b-2xl border border-[#EFF0F3] py-2 p-4  justify-between lg:flex-nowrap  items-center gap-2 w-full">
                            <div className="flex flex-wrap justify-between lg:flex-nowrap items-center gap-2 w-full">
                                <div className="flex items-center rounded-none">
                                    <TagSelector
                                        className="rounded-none px-0! w-max border-0 justify-start bg-transparent! dark:bg-[#FFFFFF0D]!"
                                        label="Difficulty"
                                        tags={Difficulty as any}
                                        value={filters.difficulty}
                                        onChange={setDifficulty}
                                    />

                                    {/* Line 1: Always visible between Difficulty and Tags */}
                                    <div className="h-6 w-[1px] bg-gray-300 dark:bg-white/20" />

                                    <TagSelector
                                        className="rounded-none w-max border-0 justify-start bg-transparent! dark:bg-[#FFFFFF0D]!"
                                        label="Tags"
                                        tags={tagOptions}
                                        value={filters.tags}
                                        onChange={setTags}
                                    />

                                    {isAuthenticated && (
                                        <>
                                            {/* Line 2: Only visible if Status is also visible */}
                                            <div className="h-6 w-[1px] bg-gray-300 dark:bg-white/20" />
                                            <TagSelector
                                                className="rounded-none w-max border-0 justify-start bg-transparent! dark:bg-[#FFFFFF0D]!"
                                                label="Status"
                                                tags={Status as any}
                                                value={filters.status}
                                                onChange={setStatus}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            <ViewSwitch value={currentView} onChange={onToggleView} />
                        </div>
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
