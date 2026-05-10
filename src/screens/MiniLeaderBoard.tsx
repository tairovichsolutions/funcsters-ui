/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import MedalIcon from "../../public/svgs/leaderBoard/MedalIcon";
import SilverMedalIcon from "../../public/svgs/leaderBoard/SilverMedalIcon";
import BronzeMedalIcon from "../../public/svgs/leaderBoard/BronzeMedalIcon";
import Link from "next/link";
import { useLeaderboard } from "@/queries/useLeaderboard";
import type { LeaderboardPeriod } from "@/types/leaderboard-types";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvatarUrl } from "@/lib/utils";

const TABS: { label: string; value: LeaderboardPeriod }[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "All Time", value: "all_time" },
];

const DISPLAY_COUNT = 7;

export default function MiniLeaderBoard() {
  const [activeTab, setActiveTab] = useState<LeaderboardPeriod>("weekly");
  const { data: leaderboardData, isLoading } = useLeaderboard(activeTab);

  const topUsers = (leaderboardData?.leaderboard ?? []).slice(0, DISPLAY_COUNT);

  return (
    <div className="w-full bg-white dark:bg-[#111827] rounded-xl  dark:border-gray-800 transition-colors">
      <h2 className="text-sm  font-semibold text-[#0F172A] dark:text-gray-100 mb-4 tracking-tight">
        Leaderboard
      </h2>

      
      <div className="flex border bg-[#F4F5F8] border-[#DFE0E7] rounded-lg dark:bg-gray-800 dark:border-gray-700 mb-2">
        {TABS.map((tab, index) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 py-2 text-sm font-medium transition-all duration-200 
        ${activeTab === tab.value
                ? "bg-blue-base text-white shadow-sm"
                : "text-[#1F2937] dark:text-gray-200 hover:bg-gray-200/50"
              }
        ${index === 0 ? "rounded-s-lg" : ""} 
        ${index === TABS.length - 1 ? "rounded-e-lg" : ""}
        ${index !== 0 && activeTab !== tab.value && TABS[index - 1].value !== activeTab
                ? "border-l border-[#DFE0E7] dark:border-gray-700"
                : "border border-transparent"
              }
      `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      
      <ul className="flex flex-col">
        {isLoading
          ? // Skeleton Loaders
          Array.from({ length: DISPLAY_COUNT }).map((_, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-3.5 border-b border-[#F3F4F6] dark:border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3.5 w-full">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <Skeleton className="w-24 h-4 rounded" />
                </div>
              </div>
              <Skeleton className="w-12 h-4 rounded" />
            </li>
          ))
          : // Actual Data Render
          topUsers.map((user) => (
            <li
              key={user.userId}
              className={`flex items-center justify-between py-3.5 border-b border-[#F3F4F6] dark:border-gray-800 last:border-0 ${user.currentUser ? "bg-blue-base/5 rounded-md px-1" : ""}`}
            >
              <div className="flex items-center gap-3.5">
                
                <div className="w-6 flex justify-center items-center">
                  {user.rank === 1 && <span className=" drop-shadow-sm"><MedalIcon className="w-7 h-7" /></span>}
                  {user.rank === 2 && <span className=" drop-shadow-sm"><SilverMedalIcon className="w-7 h-7" /></span>}
                  {user.rank === 3 && <span className=" drop-shadow-sm"><BronzeMedalIcon className="w-7 h-7" /></span>}
                  {user.rank > 3 && (
                    <span className="w-[22px] h-[22px] flex items-center justify-center rounded-full bg-[#F3F4F6] dark:bg-gray-800 text-[#4B5563] dark:text-gray-400 text-xs font-semibold">
                      {user.rank}
                    </span>
                  )}
                </div>

                
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarUrl(user.avatarUrl, user.username)}
                    alt={`${user.username}'s avatar`}
                    className="w-7 h-7 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
                  />
                  <span className="text-sm font-medium text-neutral-04 dark:text-gray-200">
                    {user.username}
                    {user.currentUser && (
                      <span className="text-blue-base text-xs ml-1">(You)</span>
                    )}
                  </span>
                </div>
              </div>

              
              <span className="text-[13px] font-semibold text-blue-base dark:text-[#3B82F6]">
                {user.periodXp} XP
              </span>
            </li>
          ))}
      </ul>

      
      <Link href={'/leaderboard'}>
        <button className="w-full mt-3 py-2.5 text-[#0D1A26] border-[#DFE0E7] bg-[#F4F5F8] dark:bg-gray-800 hover:bg-[#EBEDF2] dark:hover:bg-gray-700/80 dark:text-gray-300 text-[13px] font-medium rounded-lg transition-colors border dark:border-gray-700">
          View Full LeaderBoard
        </button></Link>
    </div>
  );
}