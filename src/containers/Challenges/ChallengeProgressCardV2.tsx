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
  // Reduced minimum width and gap for a tighter layout
  <div className="grid grid-cols-2 gap-2 w-full min-w-[170px]">
    {data.map((item) => (
      <div
        key={item.key}
        // Reduced padding to match the smaller 11px text
        className="flex items-center justify-between bg-[#F3F4F6] px-2.5 py-1 rounded-full whitespace-nowrap gap-1.5"
      >
        {/* Set text to 11px as per Figma */}
        <span className="text-[#374151] text-[11px] font-medium leading-none">
          {item.name}
        </span>
        {/* Scaled down the badge slightly to match the 11px text */}
        <span
          style={{ backgroundColor: item.fill }}
          className="text-white text-[10px] font-semibold px-1.5 py-[3px] rounded-full leading-none min-w-[20px] text-center"
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
      <div>
        <div className="flex flex-col w-full p-2">
          {/* Scaled down title slightly to match the smaller card */}
          <h2 className="text-[#111827] text-[18px] font-semibold mb-3">
            Progress
          </h2>

          {/* Reduced padding (p-3.5) and gap (gap-4) for a more compact card */}
          <div className="flex w-max flex-row items-center justify-between border border-[#E5E7EB] rounded-xl p-3.5 bg-white shadow-sm gap-4">
            
            {/* Left Side: Custom Legend */}
            <div className="flex-1">
              <CustomLegend data={slices} />
            </div>

            {/* Right Side: Chart - Strictly sized to 74x74px */}
            <div className="relative w-[74px] h-[74px] min-w-[74px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart className="[&_.recharts-surface]:outline-none">
                  <Pie
                    data={chartData}
                    dataKey={isEmpty ? "displayValue" : "value"}
                    cx="50%"
                    cy="50%"
                    // Adjusted radiuses for a 74px diameter circle (37px outer radius)
                    innerRadius={25}
                    outerRadius={37}
                    startAngle={0}
                    endAngle={-360}
                    stroke={isEmpty ? "transparent" : "#ffffff"}
                    // Thinner stroke to match the smaller chart size
                    strokeWidth={isEmpty ? 0 : 2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.fill}
                        style={{ outline: "none" }}
                      />
                    ))}
                  </Pie>
                  
                  {/* Center Chart Texts - Scaled down to fit inside the 50px inner hole */}
                  <text
                    x="50%"
                    y="42%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-[#111827] text-[14px] font-semibold"
                  >
                    {totalCompleted}
                  </text>
                  <text
                    x="50%"
                    y="63%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-[#111827] text-[8px] font-normal"
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