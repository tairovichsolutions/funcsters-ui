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


  const expandedChallenges = allChallenges.map(challenge => ({
    ...challenge,
    tags: [
      ...(challenge.tags ?? []), // Fallback to empty array if undefined
      ...Array(Math.max(0, 5 - (challenge.tags?.length ?? 0))) // Safely check length too
        .fill(null)
        .map((_, i) => `Extra Tag ${i + 1}`)
    ]
  }));

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


      <MatricsAndActivityChart
        profileLoading={profileLoading}
        isAuthenticated={isAuthenticated}
      />



      <div className="grid grid-cols-1 bg-dashboard-background lg:grid-cols-12 
     xl:grid-cols-[minmax(0,2.4fr)_minmax(0,6.98fr)_minmax(0,2.62fr)] 
     lg:gap-3 xl:gap-4 2xl:gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="hidden sticky dark:border top-0 lg:block bg-white dark:bg-slate-900 rounded-2xl h-max  lg:col-span-3 xl:col-span-1">
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
          <div className="sticky top-0 z-20 flex bg-dashboard-background flex-col gap-5">


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
            allChallenges={[...expandedChallenges,]}
            fetchNextPage={fetchNextPage}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
          />
        </main>

        {/* RIGHT SIDEBAR */}
        {/* lg: 3 cols | xl: 3rd fraction (2.5) | 2xl: 2 cols */}
        <aside className="hidden bg-white dark:bg-slate-900 rounded-2xl  h-max  border lg:block lg:col-span-3 xl:col-span-1 2xl:col-span-1">
          <div className="flex flex-col sticky p-2 2xl:p-4 top-0">
            <StreakStatsCardV2 streakData={metricsData?.streak} />
            <XpPointsCardV2 xpData={120} />
             <MiniLeaderBoard/>
          </div>
        </aside>

      </div>


      {/* TODO:delet after dashboard done */}
      <div className="hidden grid-cols-1 lg:grid-cols-12 gap-6 mt-3 container mx-auto ">

        {/* LEFT SIDEBAR: Increased width (Takes 3 out of 12 columns) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="flex flex-col gap-5 sticky top-5">
            <ProgressCard />
            <ActivityCalendar />
          </div>
        </aside>

        {/* MAIN CENTER CONTENT: Adjusted to 6 columns to make room for wider sidebars */}
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

          {/* SCROLLING CONTENT */}

          <ChallengesListSectionV2
            isLoading={isLoading}
            currentView={currentView}
            allChallenges={[...allChallenges,]}
            fetchNextPage={fetchNextPage}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
          />

        </main>

        {/* RIGHT SIDEBAR: Increased width (Takes 3 out of 12 columns) */}
        <aside className="hidden lg:block lg:col-span-3 ">
          <div className="flex flex-col gap-5 sticky top-5 ">
            <StreakCard />
            <LeaderboardCard />
          </div>
        </aside>

      </div>




    </div>
  );
};

export default ChallengesScreenV2;













// 1. Streak Card Dummy
const StreakCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
    <div className="flex justify-between w-full mb-4">
      <span className="flex items-center gap-1 font-bold text-orange-600">
        🔥 Streak
      </span>
      <span className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-lg font-medium">
        🏆 Longest: 15 Days
      </span>
    </div>

    <div className="relative flex items-center justify-center w-32 h-32">
      {/* Simple SVG Circle Progress */}
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="100" className="text-orange-500" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-gray-800">3</span>
        <span className="text-xs text-gray-500 font-medium">Days Current</span>
      </div>
    </div>
    <p className="mt-4 text-xs text-white bg-orange-500 px-4 py-1 rounded-full">Mar 6 - Mar 11</p>
  </div>
);

// 2. Leaderboard Card Dummy
const LeaderboardCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-yellow-100 rounded-lg">⭐</div>
        <div>
          <p className="text-xs text-gray-500 font-medium leading-none">XP Points</p>
          <p className="text-lg font-bold text-gray-800">2403 XP</p>
        </div>
      </div>
    </div>

    <h3 className="font-bold text-gray-800 mb-4">Leaderboard</h3>

    <div className="flex bg-gray-50 p-1 rounded-xl mb-4">
      {['Weekly', 'Monthly', 'All Time'].map((tab) => (
        <button key={tab} className={`flex-1 text-[10px] py-2 rounded-lg font-semibold ${tab === 'Weekly' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'}`}>
          {tab}
        </button>
      ))}
    </div>

    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((rank) => (
        <div key={rank} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold w-4 ${rank <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>{rank}</span>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm" />
            <span className="text-sm font-medium text-gray-700">User Name</span>
          </div>
          <span className="text-xs font-bold text-blue-600">120 XP</span>
        </div>
      ))}
    </div>

    <button className="w-full mt-6 py-3 text-sm font-semibold text-gray-600 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
      View Full Leaderboard
    </button>
  </div>
);



// 1. Progress Card Dummy
const ProgressCard = () => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
    <h3 className="font-bold text-gray-800 mb-4 text-sm">Progress</h3>

    <div className="flex items-center justify-between">
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          <span className="text-gray-600">Easy</span>
          <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md">30</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span className="text-gray-600">Medium</span>
          <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md">30</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span className="text-gray-600">Hard</span>
          <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md">30</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-800"></span>
          <span className="text-gray-600">Expert</span>
          <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md">30</span>
        </div>
      </div>

      {/* Circle Chart */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
          {/* A multi-colored dash array isn't natively supported by simple SVGs, so we'll use a solid color representing total progress for the dummy */}
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="50" className="text-blue-600" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-black text-gray-800">120</span>
        </div>
      </div>
    </div>
  </div>
);

// 2. Activity Calendar Dummy
const ActivityCalendar = () => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  // Array to simulate dates. 1-5 is grayed out, 6-11 is blue (active)
  const dates = [
    26, 27, 28, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31, 1
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 text-sm">Activity 09</h3>
        <div className="text-xs text-blue-500 font-semibold cursor-pointer hover:underline">
          &lt; March 2026 &gt;
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-3">
        {days.map((day, i) => (
          <div key={i} className="text-[10px] text-gray-400 font-bold">{day}</div>
        ))}
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
        {dates.map((date, i) => {
          // Logic just for dummy visual matching
          const isBlue = i >= 8 && i <= 13;
          const isGray = i < 3 || i > 33;

          return (
            <div
              key={i}
              className={`text-xs w-6 h-6 mx-auto flex items-center justify-center rounded-full transition-colors cursor-pointer
                ${isBlue ? 'bg-blue-500 text-white font-bold shadow-sm hover:bg-blue-600' :
                  isGray ? 'text-gray-300' : 'text-gray-600 font-medium hover:bg-gray-100'}
              `}
            >
              {date}
            </div>
          );
        })}
      </div>
    </div>
  );
};