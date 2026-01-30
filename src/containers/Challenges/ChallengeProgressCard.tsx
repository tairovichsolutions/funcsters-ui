"use client";

import React, { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { Assets } from "@/constants/assets";
import { MatricCard } from "@/components/ui/matric-card";
import { StatsScorePoints } from "@/components/ui/stats-score-points";

type ChallengeProgress = {
  easy?: number;
  medium?: number;
  hard?: number;
  expert?: number;
  total?: number;
};

type ChallengeProgressCardProps = {
  completedChallenges?: ChallengeProgress;
};

type DifficultyKey = "easy" | "medium" | "hard" | "expert";

type ChartSlice = {
  name: string;
  key: DifficultyKey;
  value: number;
  displayValue: number;
  fill: string;
  stroke: string;
};

const MIN_SLICE_VALUE = 0.2;

const DIFFICULTIES: Omit<ChartSlice, "value" | "displayValue">[] = [
  { name: "Easy", key: "easy", fill: "#277102", stroke: "#ffffff4D" },
  { name: "Medium", key: "medium", fill: "#FFA539", stroke: "#ffffff4D" },
  { name: "Hard", key: "hard", fill: "#D73D3D", stroke: "#ffffff4D" },
  { name: "Expert", key: "expert", fill: "#005092", stroke: "#ffffff4D" },
];

const EMPTY_SLICE: ChartSlice = {
  name: "Empty",
  key: "easy",
  value: 0,
  displayValue: 1,
  fill: "#5492DC",
  stroke: "ffffff4D",
};

const CustomLegend = ({ data }: { data: ChartSlice[] }) => (
  <div className="grid grid-cols-2 gap-x-7 gap-y-2 text-white mt-2 ">
    {data.map((item) => (
      <div key={item.key} className="flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: item.fill }}
        />
        <span className="font-imbMono text-xs">{item.name}</span>
        <span className="ml-auto   font-semibold text-xs">{item.value}</span>
      </div>
    ))}
  </div>
);

export const ChallengeProgressCard: React.FC<ChallengeProgressCardProps> =
  React.memo(({ completedChallenges }) => {
    const slices = useMemo<ChartSlice[]>(() => {
      return DIFFICULTIES.map((item) => {
        const value = completedChallenges?.[item.key] ?? 0;

        return {
          ...item,
          value,
          displayValue: value === 0 ? MIN_SLICE_VALUE : value,
        };
      });
    }, [completedChallenges]);

    const totalCompleted = useMemo(() => {
      return (
        completedChallenges?.total ??
        slices.reduce((sum, slice) => sum + slice.value, 0)
      );
    }, [completedChallenges, slices]);

    const isEmpty = totalCompleted === 0;

    const chartData = useMemo<ChartSlice[]>(() => {
      return isEmpty ? [EMPTY_SLICE] : slices;
    }, [isEmpty, slices]);

    return (
      <MatricCard
        imgSrc={Assets.Svgs.ChallengeProgressImage}
        className="bg-challenge-progress-card"
      >
        <div className="flex h-full items-center justify-between gap-4">
          <div className="h-full">
            <StatsScorePoints value={totalCompleted} label="Completed" />
          </div>
          <div className="flex h-full! w-64! flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={"100%"}>
              <PieChart className="[&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden">
                <Pie
                  data={chartData}
                  dataKey={isEmpty ? "displayValue" : "value"}
                  innerRadius={isEmpty ? 55 : 45}
                  outerRadius={isEmpty ? 85 : 80}
                  startAngle={-270}
                  endAngle={90}
                  fill={isEmpty ? "#5492DC" : undefined}
                  strokeWidth={1}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.fill}
                      stroke={isEmpty ? "#ffffff4D" : entry.stroke}
                      style={{ outline: "none" }}
                    />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-2xl font-bold"
                >
                  {totalCompleted}
                </text>
                <text
                  x="50%"
                  y="57%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-xs font-light"
                >
                  {isEmpty ? "Start Solving!" : "Total"}
                </text>
              </PieChart>
            </ResponsiveContainer>

            {totalCompleted > 0 && <CustomLegend data={slices} />}
          </div>
        </div>
      </MatricCard>
    );
  });
