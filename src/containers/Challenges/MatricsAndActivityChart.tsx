"use client";

import { XpPointsCard } from "./XpPointsCard";
import { useMetrics } from "@/queries/useMetrics";
import { StreakStatsCard } from "./StreakStatsCard";
import { ActivityCalendarCard } from "./ActivityCalendarCard";
import { ChallengeProgressCard } from "./ChallengeProgressCard";
import { MatricsNotAccess } from "@/components/MatricsNotAccess";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MatricsAndActivityChartProps {
  isAuthenticated: boolean;
  profileLoading: boolean;
}

export const MatricsAndActivityChart = React.memo(
  ({ isAuthenticated, profileLoading }: MatricsAndActivityChartProps) => {
    const { data: metricsData, isLoading } = useMetrics();

    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-4 grid-cols-1 gap-4 relative">
        {isLoading && profileLoading ? (
          <>
            <Skeleton className="relative h-[225px] bg-white dark:bg-gray-800 overflow-hidden rounded-md p-2">
              <Skeleton className=" bg-gray-100 dark:bg-gray-700/30 h-14 w-16" />
              <Skeleton className=" bg-gray-100 dark:bg-gray-700/30 h-5 w-20 mt-2" />
            </Skeleton>
            <Skeleton className="relative h-[225px] bg-white dark:bg-gray-800 overflow-hidden rounded-md p-2">
              <Skeleton className=" bg-gray-100 dark:bg-gray-700/30 h-14 w-16" />
              <Skeleton className=" bg-gray-100 dark:bg-gray-700/30 h-5 w-20 mt-2" />
            </Skeleton>
            <Skeleton className="relative h-[225px] bg-white dark:bg-gray-800 overflow-hidden rounded-md p-2">
              <Skeleton className=" bg-gray-100 dark:bg-gray-700/30 h-14 w-16" />
              <Skeleton className=" bg-gray-100 dark:bg-gray-700/30 h-5 w-20 mt-2" />
            </Skeleton>
            <Skeleton className="relative h-[225px] bg-white dark:bg-gray-800 overflow-hidden rounded-md p-2">
              <Skeleton className=" bg-gray-100 dark:bg-gray-700/30 h-14 w-16" />
              <Skeleton className=" bg-gray-100 dark:bg-gray-700/30 h-5 w-20 mt-2" />
            </Skeleton>
          </>
        ) : (
          <>
            {!isAuthenticated && <MatricsNotAccess />}
            <ChallengeProgressCard
              completedChallenges={metricsData?.completedChallenges}
            />
            <ActivityCalendarCard />
            <StreakStatsCard streakData={metricsData?.streak} />
            <XpPointsCard xpData={metricsData?.xpPoints} />
          </>
        )}
      </div>
    );
  }
);
