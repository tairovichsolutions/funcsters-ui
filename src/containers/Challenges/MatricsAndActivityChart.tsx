"use client";

import { XpPointsCard } from "./XpPointsCard";
import { useMetrics } from "@/queries/useMetrics";
import { StreakStatsCard } from "./StreakStatsCard";
import { ActivityCalendarCard } from "./ActivityCalendarCard";
import { ChallengeProgressCard } from "./ChallengeProgressCard";
import { MatricsNotAccess } from "@/components/MatricsNotAccess";
import React from "react";

interface MatricsAndActivityChartProps {
  isAuthenticated: boolean;
}

export const MatricsAndActivityChart = React.memo(
  ({ isAuthenticated }: MatricsAndActivityChartProps) => {
    const { data: metricsData } = useMetrics();

    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-4 grid-cols-1 gap-4 relative">
        {!isAuthenticated && <MatricsNotAccess />}

        <ChallengeProgressCard
          completedChallenges={metricsData?.completedChallenges}
        />
        <ActivityCalendarCard />
        <StreakStatsCard streakData={metricsData?.streak} />
        <XpPointsCard xpData={metricsData?.xpPoints} />
      </div>
    );
  }
);
