"use client";

import { ActivityCalendarCardV2 } from "@/containers/Challenges/ActivityCalendarCardV2";
import { ChallengeProgressCardV2 } from "@/containers/Challenges/ChallengeProgressCardV2";
import { ChallengesFiltersBarV2 } from "@/containers/Challenges/ChallengesFiltersBarV2";
import { ChallengesListSectionV2 } from "@/containers/Challenges/ChallengesListSectionV2";
import { MatricsAndActivityChart } from "@/containers/Challenges/MatricsAndActivityChart";
import { StreakStatsCardV2 } from "@/containers/Challenges/StreakStatsCardV2";
import { XpPointsCardV2 } from "@/containers/Challenges/XpPointsCardV2";
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

  const { data: userData, isLoading: profileLoading } = useGetUserProfile();
  const isAuthenticated = Boolean(userData?.data?.authenticated);

  const currentView = React.useMemo(() => {
    return searchParams.get("view") === "list" ? "list" : "card";
  }, [searchParams]);

  const allChallenges = React.useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.challenges) as ChallengesTypes[];
  }, [data]);




  //  const { data: metricsData, isLoading:loading } = useMetrics();
  const metricsData = {
    completedChallenges: {
      easy: 25,
      expert: 25,
      hard: 25,
      medium: 25,
      total: 100
    },
    streak: {
      currentStreak: {
        count: 12,
        startDate: "2024-03-01",
        endDate: "2024-03-12",
      },
      longestStreak: {
        count: 24,
        startDate: "2024-01-05",
        endDate: "2024-01-29",
      },
    },

  }


  return (
    <div className=" flex flex-col gap-5">
      {/* <GreetingArea
        profileLoading={profileLoading}
        isAuthenticated={isAuthenticated}
        username={userData?.data?.user?.username}
      /> */}



        {/* <MatricsAndActivityChart
          profileLoading={profileLoading}
          isAuthenticated={isAuthenticated}
        /> */}

      


      <div className="grid gap-4 grid-cols-1 bg-dashboard-background lg:grid-cols-12 
     xl:grid-cols-[minmax(0,2.4fr)_minmax(0,6.98fr)_minmax(0,2.62fr)] 
     lg:gap-3 xl:gap-4 2xl:gap-6">

        {/* LEFT SIDEBAR */}
        <aside className=" lg:sticky dark:border top-0 lg:block bg-white dark:bg-slate-900 rounded-2xl h-max  lg:col-span-3 xl:col-span-1">
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
          <div className=" lg:sticky top-0 z-20 flex bg-dashboard-background flex-col gap-5">


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
            // allChallenges={[...allChallenges,...allChallenges,...allChallenges,...allChallenges,]}
            allChallenges={[...allChallenges,]}
            fetchNextPage={fetchNextPage}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
          />
        </main>

        {/* RIGHT SIDEBAR */}
        {/* lg: 3 cols | xl: 3rd fraction (2.5) | 2xl: 2 cols */}
        <aside className=" bg-white dark:bg-slate-900 rounded-2xl  h-max  border lg:block lg:col-span-3 xl:col-span-1 2xl:col-span-1">
          <div className="flex flex-col lg:sticky p-2 2xl:p-4 top-0">
            <StreakStatsCardV2 streakData={metricsData?.streak} />
            <XpPointsCardV2 xpData={120} />
            <MiniLeaderBoard />
          </div>
        </aside>

      </div>


      {/* TODO:delet after dashboard done */}
      {/*   <div className="hidden grid-cols-1 lg:grid-cols-12 gap-6 mt-3 container mx-auto ">

      
        <aside className="hidden lg:block lg:col-span-3">
          <div className="flex flex-col gap-5 sticky top-5">
            <ProgressCard />
            <ActivityCalendar />
          </div>
        </aside>

        
        <main className="col-span-1 lg:col-span-6 flex flex-col gap-5">


          <div className=" top-5  z-10 flex flex-col gap-5">


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

          

          <ChallengesListSectionV2
            isLoading={isLoading}
            currentView={currentView}
            allChallenges={[...allChallenges,]}
            fetchNextPage={fetchNextPage}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
          />

        </main>

      RIGHT SIDEBAR: Increased width (Takes 3 out of 12 columns)
        <aside className="hidden lg:block lg:col-span-3 ">
          <div className="flex flex-col gap-5 sticky top-5 ">
            <StreakCard />
            <LeaderboardCard />
          </div>
        </aside>

      </div> */}




    </div>
  );
};

export default ChallengesScreenV2;
