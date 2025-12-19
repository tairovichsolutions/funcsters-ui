"use client";

import React, { useMemo } from "react";
import { Assets } from "@/constants/assets";
import { MatricCard } from "@/components/ui/matric-card";
export const description = "Challenge progress donut chart";
import { LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";
import { StatsScorePoints } from "@/components/ui/stats-score-points";

type ChallengeProgress = {
  easy?: number;
  hard?: number;
  total?: number;
  expert?: number;
  medium?: number;
};

type ChallengeProgressCardProps = {
  completedChallenges?: ChallengeProgress;
};

type ChartSlice = {
  name: "Easy" | "Medium" | "Hard" | "Expert";
  key: keyof ChallengeProgress;
  value: number;
  displayValue: number;
  fill: string;
  percentage: number;
};

const MIN_SLICE_VALUE = 0.2;

export const ChallengeProgressCard: React.FC<ChallengeProgressCardProps> =
  React.memo(({ completedChallenges }) => {
    const rawChartData = useMemo(() => {
      const base: Omit<ChartSlice, "value" | "displayValue" | "percentage">[] =
        [
          { name: "Easy", key: "easy", fill: "#277102" },
          { name: "Medium", key: "medium", fill: "#FFA539" },
          { name: "Hard", key: "hard", fill: "#D73D3D" },
          { name: "Expert", key: "expert", fill: "#005092" },
        ];

      return base.map((item) => {
        const rawValue = completedChallenges?.[item.key] ?? 0;
        return {
          ...item,
          value: rawValue,
          displayValue: rawValue === 0 ? MIN_SLICE_VALUE : rawValue,
          percentage: 0,
        };
      });
    }, [completedChallenges]);

    const totalCompleted = useMemo(() => {
      if (completedChallenges?.total != null) return completedChallenges.total;
      return rawChartData.reduce((sum, slice) => sum + slice.value, 0);
    }, [completedChallenges, rawChartData]);

    const chartData: ChartSlice[] = useMemo(() => {
      if (totalCompleted === 0) {
        return rawChartData.map((item) => ({ ...item, percentage: 0 }));
      }

      return rawChartData.map((item) => ({
        ...item,
        percentage: Math.round((item.value / totalCompleted) * 100),
      }));
    }, [rawChartData, totalCompleted]);

    return (
      <MatricCard
        imgSrc={Assets.Svgs.ChallengeProgressImage}
        className="bg-challenge-progress-card"
      >
        <div className="flex h-full items-center justify-between gap-2">
          <div className="h-full">
            <StatsScorePoints value={totalCompleted} label="Challenges" />
          </div>

          <div className="z-20 h-32 w-32  shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart style={{ pointerEvents: "none" }}>
                <Pie
                  data={chartData}
                  dataKey="displayValue"
                  innerRadius={36}
                  outerRadius={56}
                  stroke="none"
                  isAnimationActive
                  labelLine={false}
                  className="cursor-default"
                  style={{ pointerEvents: "none" }}
                >
                  <LabelList
                    dataKey="percentage"
                    position="inside"
                    formatter={(val) => `${val}%`}
                    stroke="none"
                    fontSize={9}
                    fill="#fff"
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex max-h-full shrink-0 flex-col overflow-y-auto rounded-r-lg border-2 border-white text-xs">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex h-full shrink-0 flex-col gap-1 py-1.5 pl-2 pr-4 leading-none text-white"
                style={{ backgroundColor: item.fill }}
              >
                <h4 className="text-[11.5px] font-semibold text-white/55">
                  {item.name}
                </h4>
                <h4 className="text-[10px] font-semibold leading-none">
                  {item.value}
                </h4>
                <h4 className="text-[9px] leading-none">Completed</h4>
              </div>
            ))}
          </div>
        </div>
      </MatricCard>
    );
  });
