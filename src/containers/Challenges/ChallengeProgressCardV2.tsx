"use client";

import React, { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";

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
  { name: "Easy", key: "easy", fill: "#277102", stroke: "#ffffff" },
  { name: "Medium", key: "medium", fill: "#FFA539", stroke: "#ffffff" },
  { name: "Hard", key: "hard", fill: "#D73D3D", stroke: "#ffffff" },
  { name: "Expert", key: "expert", fill: "#005092", stroke: "#ffffff" },
];

const EMPTY_SLICE: ChartSlice = {
  name: "Empty",
  key: "easy",
  value: 0,
  displayValue: 1,
  fill: "#E5E7EB", 
  stroke: "transparent",
};

const CustomLegend = ({ data }: { data: ChartSlice[] }) => (
  <div className="grid grid-cols-[1.4fr_1.8fr]  w-fit flex-wrap gap-[2px] 2xl:gap-2  ">
    {data.map((item) => (
      <div
        key={item.key}
        className="flex items-center justify-between bg-[#e9ebee] dark:bg-slate-800 p-1  2xl:px-2 rounded-full whitespace-nowrap gap-1.5"
      >
        <span className="text-[#070707] dark:text-slate-200 text-[11px] font-medium leading-none">
          {item.name}
        </span>
        <span
          style={{ backgroundColor: item.fill }}
          className="text-white text-[8px] font-semibold px-1.5 py-[3px] rounded-full leading-none min-w-[20px] text-center"
        >
          {item.value}
        </span>
      </div>
    ))}
  </div>
);

export const ChallengeProgressCardV2: React.FC<ChallengeProgressCardProps> =
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
      <div >
        <div className="flex flex-col w-full ">
          <h2 className="text-[#0F172A] dark:text-white text-sm 2xl:text-[18px] font-semibold mb-3">
            Progress
          </h2>

          <div className="flex w-full flex-row items-center justify-around lg:justify-between border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-1 2xl:p-3.5 bg-[#fbfbfc] dark:bg-[#192631]  gap-1">
            
            <div className="">
              <CustomLegend data={slices} />
            </div>

            <div className="relative w-[74px] h-[74px] min-w-[74px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={74} minHeight={74}>
                <PieChart className="[&_.recharts-surface]:outline-none">
                  <Pie
                    data={chartData}
                    dataKey={isEmpty ? "displayValue" : "value"}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={37}
                    startAngle={0}
                    endAngle={-360}
                    stroke="transparent"
                    strokeWidth={isEmpty ? 0 : 2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.fill}
                        // OVERRIDE HERE: This forces Recharts to ignore the white stroke in the DIFFICULTIES array
                        stroke="transparent" 
                        style={{ outline: "none" }}
                      />
                    ))}
                  </Pie>
                  
                  <text
                    x="50%"
                    y="42%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-[#111827] dark:fill-white text-[14px] font-semibold"
                  >
                    {totalCompleted}
                  </text>
                  <text
                    x="50%"
                    y="63%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-[#111827] dark:fill-slate-400 text-[8px] font-normal"
                  >
                    {isEmpty ? "Start!" : "Completed"}
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
          </div>
        </div>
      </div>
    );
  });