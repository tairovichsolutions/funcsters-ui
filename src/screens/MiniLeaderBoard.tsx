/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import MedalIcon from "../../public/svgs/leaderBoard/MedalIcon";
import SilverMedalIcon from "../../public/svgs/leaderBoard/SilverMedalIcon";
import BronzeMedalIcon from "../../public/svgs/leaderBoard/BronzeMedalIcon";
import Link from "next/link";

type MiniLeaderBoardEntry = {
  id: string;
  rank: number;
  name: string;
  challengesSolved: number;
  languages: string[];
  streak: number;
  longestStreak: number;
  xp: number;
  xpGained: number;
  avatarUrl: string;
};

// This acts as our mock database
const BASE_DATA: MiniLeaderBoardEntry[] = [
  { id: "1", rank: 1, name: "Jane Cooper", challengesSolved: 187, languages: ["python", "js"], streak: 28, longestStreak: 45, xp: 120, xpGained: 520, avatarUrl: "https://i.pravatar.cc/150?u=jane" },
  { id: "2", rank: 2, name: "Wade Warren", challengesSolved: 142, languages: ["ts", "react"], streak: 14, longestStreak: 30, xp: 140, xpGained: 410, avatarUrl: "https://i.pravatar.cc/150?u=wade" },
  { id: "3", rank: 3, name: "Jerome Bell", challengesSolved: 128, languages: ["go", "python"], streak: 12, longestStreak: 25, xp: 110, xpGained: 350, avatarUrl: "https://i.pravatar.cc/150?u=jerome1" },
  { id: "4", rank: 4, name: "Robert Fox", challengesSolved: 115, languages: ["rust"], streak: 8, longestStreak: 20, xp: 160, xpGained: 290, avatarUrl: "https://i.pravatar.cc/150?u=robert1" },
  { id: "5", rank: 5, name: "Robert Fox", challengesSolved: 110, languages: ["js", "html"], streak: 5, longestStreak: 15, xp: 1200, xpGained: 250, avatarUrl: "https://i.pravatar.cc/150?u=robert2" },
  { id: "6", rank: 6, name: "Floyd Miles", challengesSolved: 95, languages: ["java"], streak: 3, longestStreak: 10, xp: 1201, xpGained: 180, avatarUrl: "https://i.pravatar.cc/150?u=floyd" },
  { id: "7", rank: 7, name: "Jerome Bell", challengesSolved: 80, languages: ["c++"], streak: 1, longestStreak: 5, xp: 120, xpGained: 120, avatarUrl: "https://i.pravatar.cc/150?u=jerome2" },
];

export default function MiniLeaderBoard() {
  const [activeTab, setActiveTab] = useState("Weekly");
  const [data, setData] = useState<MiniLeaderBoardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = ["Weekly", "Monthly", "All Time"];

  // Simulated Backend Call
  useEffect(() => {
    setIsLoading(true);
    // Simulate network delay of 1.5 seconds when tab changes
    const timer = setTimeout(() => {
      // In a real app, you would pass `activeTab` to your API here
      setData(BASE_DATA);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="w-full bg-white dark:bg-[#111827] rounded-xl  dark:border-gray-800 transition-colors">
      <h2 className="text-sm  font-semibold text-[#0F172A] dark:text-gray-100 mb-4 tracking-tight">
        Leaderboard
      </h2>

      
      <div className="flex border bg-[#F4F5F8] border-[#DFE0E7] rounded-lg dark:bg-gray-800 dark:border-gray-700 mb-2">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium transition-all duration-200 
        ${activeTab === tab
                ? "bg-blue-base text-white shadow-sm"
                : "text-[#1F2937] dark:text-gray-200 hover:bg-gray-200/50"
              }
        ${index === 0 ? "rounded-s-lg" : ""} 
        ${index === tabs.length - 1 ? "rounded-e-lg" : ""}
        ${index !== 0 && activeTab !== tab && tabs[index - 1] !== activeTab
                ? "border-l border-[#DFE0E7] dark:border-gray-700"
                : "border border-transparent"
              }
      `}
          >
            {tab}
          </button>
        ))}
      </div>

      
      <ul className="flex flex-col">
        {isLoading
          ? // Skeleton Loaders
          Array.from({ length: 7 }).map((_, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-3.5 border-b border-[#F3F4F6] dark:border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3.5 w-full">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
              </div>
              <div className="w-12 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </li>
          ))
          : // Actual Data Render
          data.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between py-3.5 border-b border-[#F3F4F6] dark:border-gray-800 last:border-0"
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
                    src={user.avatarUrl}
                    alt={`${user.name}'s avatar`}
                    className="w-7 h-7 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
                  />
                  <span className="text-sm font-medium text-neutral-04 dark:text-gray-200">
                    {user.name}
                  </span>
                </div>
              </div>

              
              <span className="text-[13px] font-semibold text-blue-base dark:text-[#3B82F6]">
                {user.xp} XP
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