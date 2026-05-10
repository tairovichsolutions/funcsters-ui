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
  <div className="grid grid-cols-2 min-w-40  gap-3 gap-y-1.5 text-white my-1 ">
    {data.map((item) => (
      <div
        style={{ backgroundColor: item.fill }}
        key={item.key}
        className=" px-2 w-full py-1 rounded-sm flex items-center justify-center gap-1.5"
      >
        <span className="font-imbMono text-xs leading-none">{item.name}</span>
        <span className=" font-semibold text-xs leading-none pt-[3px]">
          {item.value}
        </span>
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
          <div className="flex h-full!    me-3 flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={"100%"} minWidth={150} minHeight={150}>
              <PieChart className="[&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden">
                <Pie
                  data={chartData}
                  dataKey={isEmpty ? "displayValue" : "value"}
                  innerRadius={48}
                  outerRadius={75}
                  startAngle={-270}
                  endAngle={90}
                  fill={isEmpty ? "#5492DC" : undefined}
                  stroke="transparent"
                  strokeWidth={0}
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
                  className="fill-white text-[11px] font-light"
                >
                  {isEmpty ? "Start Solving!" : "Total"}
                </text>
              </PieChart>
            </ResponsiveContainer>

            <CustomLegend data={slices} />
          </div>
        </div>
      </MatricCard>
    );
  });
