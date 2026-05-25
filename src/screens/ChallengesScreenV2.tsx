"use client";

import { ActivityCalendarCardV2 } from "@/containers/Challenges/ActivityCalendarCardV2";
import { ChallengeProgressCardV2 } from "@/containers/Challenges/ChallengeProgressCardV2";
import { ChallengesFiltersBarV2 } from "@/containers/Challenges/ChallengesFiltersBarV2";
import { ChallengesListSectionV2 } from "@/containers/Challenges/ChallengesListSectionV2";
import { StreakStatsCardV2 } from "@/containers/Challenges/StreakStatsCardV2";
import { XpPointsCardV2 } from "@/containers/Challenges/XpPointsCardV2";
import { DashboardFooter } from "@/containers/Dashboard";
import { useChallengesFilters } from "@/hooks/useChallengesFilters";
import { useInfiniteChallenges } from "@/queries/useAllChallenges";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import { useMetrics } from "@/queries/useMetrics";
import type { ChallengesTypes } from "@/types";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import MiniLeaderBoard from "./MiniLeaderBoard";

export const ChallengesScreenV2: React.FC = () => {
  const searchParams = useSearchParams();

  const {
    remove,
    filters,
    setTags,
    clearAll,
    setSearch,
    setStatus,
    queryParams,
    setDifficulty,
  } = useChallengesFilters();

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChallenges(queryParams);

  const { data: userData } = useGetUserProfile();
  const isAuthenticated = Boolean(userData?.data?.authenticated);

  const currentView = React.useMemo(() => {
    return searchParams.get("view") === "list" ? "list" : "card";
  }, [searchParams]);

  const allChallenges = React.useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.challenges) as ChallengesTypes[];
  }, [data]);

  const { data: metricsData } = useMetrics();

  return (
    <div className=" flex flex-col gap-5 ">

      <div className="grid  gap-4 grid-cols-1 bg-dashboard-background dark:bg-[#181A1D] lg:grid-cols-12 
     xl:grid-cols-[minmax(0,2.4fr)_minmax(0,6.98fr)_minmax(0,2.62fr)] 
     lg:gap-3 xl:gap-4 2xl:gap-6">

        {/* LEFT SIDEBAR */}
        <aside className=" lg:sticky dark:border top-0 lg:block bg-white dark:bg-[#1C1F22] rounded-2xl h-max  lg:col-span-3 xl:col-span-1">
          <div className="flex flex-col gap-5  overflow-hidden">
            <div className="max-w-full! p-2 flex flex-col gap-4 ">
              <ChallengeProgressCardV2 completedChallenges={metricsData?.completedChallenges} />
              <ActivityCalendarCardV2 />

            </div>
          </div>
        </aside>

        {/* MAIN CENTER CONTENT */}
        {/* lg: 6 cols | xl: 2nd fraction (7) | 2xl: 8 cols */}
        {/* min-w-0 prevents children from breaking the grid width */}
        <main className="col-span-1 lg:col-span-6 xl:col-span-1 2xl:col-span-1 flex flex-col gap-5 min-w-0">

          {/* STICKY HEADER ZONE */}
          <div className=" lg:sticky top-0 z-20 flex bg-dashboard-background dark:bg-[#181A1D]  flex-col gap-5">


            <ChallengesFiltersBarV2
              remove={remove}
              setTags={setTags}
              filters={filters}
              clearAll={clearAll}
              setSearch={setSearch}
              setStatus={setStatus}
              isFetching={isFetching}
              currentView={currentView}
              setDifficulty={setDifficulty}
              isAuthenticated={isAuthenticated}
            />
          </div>

          {/* SCROLLING CONTENT */}
          <ChallengesListSectionV2
            isLoading={isLoading}
            currentView={currentView}
            allChallenges={allChallenges}
            fetchNextPage={fetchNextPage}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
          />
        </main>

        {/* RIGHT SIDEBAR */}
        {/* lg: 3 cols | xl: 3rd fraction (2.5) | 2xl: 2 cols */}
        <aside className=" bg-white dark:border-[#282B2E] dark:bg-[#1C1F22] rounded-2xl  h-max  border lg:block lg:col-span-3 xl:col-span-1 2xl:col-span-1">
          <div className="flex flex-col lg:sticky p-2 2xl:p-4 top-0">
            <StreakStatsCardV2 streakData={metricsData?.streak} />
            <XpPointsCardV2 xpData={metricsData?.xpPoints} />
            <MiniLeaderBoard />
          </div>
        </aside>

      </div>

      <DashboardFooter />

    </div>
  );
};

export default ChallengesScreenV2;