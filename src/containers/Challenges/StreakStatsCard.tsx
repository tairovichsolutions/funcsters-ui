/* eslint-disable @next/next/no-img-element */
import { MatricCard } from "@/components/ui/matric-card";
import { StatsScorePoints } from "@/components/ui/stats-score-points";
import { Assets } from "@/constants/assets";
import { formatDateRange } from "@/lib/formatDateRange";
import React from "react";

type StreakPeriod = {
  count: number;
  startDate: string | null;
  endDate: string | null;
};

export type StreakDataType = {
  streakData: {
    currentStreak: StreakPeriod;
    longestStreak: StreakPeriod;
  };
};

export const StreakStatsCard = React.memo(({ streakData }: StreakDataType) => {
  const currentStreak = streakData?.currentStreak;
  const longestStreak = streakData?.longestStreak;

  return (
    <MatricCard
      imgSrc={Assets.Svgs.StreakStatsImage}
      className="bg-streak-stats-card"
    >
      <div className="flex justify-between gap-5">
        <StatsScorePoints value={longestStreak?.count} label="Highest Streak" />
        <div className="border shadow-[inset_0_4px_31px_0_rgba(255,255,255,0.25)] backdrop-blur-[2.6071429px] border-xp-points-card rounded-full mt-6 w-40 h-40 flex items-center justify-center relative">
          <div>
            <h2 className="text-xp-points-card font-inter font-extrabold text-6xl text-center">
              {currentStreak?.count ?? 0}
            </h2>
            <p className="text-white font-inter font-medium text-xs">
              Current Streak
            </p>
            <div className="absolute top-10 right-9">
              <img src={Assets.Images.FireImage} alt="" />
            </div>

            {currentStreak?.startDate && currentStreak?.endDate && (
              <div className="absolute -bottom-1 right-6 bg-xp-points-card flex items-center justify-center px-2 py-1 rounded-full">
                <p className="text-streak-stats-card font-inter font-bold text-xs">
                  {formatDateRange(
                    currentStreak?.startDate,
                    currentStreak?.endDate
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MatricCard>
  );
});
