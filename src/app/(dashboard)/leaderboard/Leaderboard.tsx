/* eslint-disable @next/next/no-img-element */
"use client";

import SecondaryContainer from "@/components/shared/container/SecondaryContainer";
import { useRef } from "react";
import FlameIconV2 from "../../../../public/svgs/leaderBoard/FlameIconV2";

import BronzeMedalIcon from "../../../../public/svgs/leaderBoard/BronzeMedalIcon";
import HexagonRankIcon from "../../../../public/svgs/leaderBoard/HexagonRankIcon";
import MedalIcon from "../../../../public/svgs/leaderBoard/MedalIcon";
import SilverMedalIcon from "../../../../public/svgs/leaderBoard/SilverMedalIcon";
import { LanguageBadge } from "./LanguageBadge";
import CountryDropdown from "./CountryDropDown";
import { LeaderboardTableSkeleton } from "@/skeletons/LeaderboardTableSkeleton";
import type { CurrentUserRank, LeaderboardPeriod, LeaderboardUser } from "@/types/leaderboard-types";

// --- Map UI labels to API period values ---
const PERIOD_OPTIONS: { label: string; value: LeaderboardPeriod }[] = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "All Time", value: "all_time" },
];

interface LeaderboardProps {
    leaderboard: LeaderboardUser[];
    currentUserRank: CurrentUserRank | undefined;
    isLoading: boolean;
    selectedPeriod: LeaderboardPeriod;
    onPeriodChange: (period: LeaderboardPeriod) => void;
    selectedCountry: string;
    onCountryChange: (country: string) => void;
}

export default function Leaderboard({
    leaderboard,
    currentUserRank,
    isLoading,
    selectedPeriod,
    onPeriodChange,
    selectedCountry,
    onCountryChange,
}: LeaderboardProps) {
    const currentUserRef = useRef<HTMLTableRowElement>(null);

    const scrollToUser = () => {
        if (currentUserRef.current) {
            currentUserRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            // Flash effect to highlight the row
            currentUserRef.current.classList.add("active");
            setTimeout(() => {
                currentUserRef.current?.classList.remove("active");
            }, 2000);
        }
    };

    const getTimePeriodLabel = (): string => {
        switch (selectedPeriod) {
            case "weekly":
                return "this wk";
            case "monthly":
                return "this mo";
            case "all_time":
                return "all time";
        }
    };

    return (
        <SecondaryContainer>
            <div className=" bg-dashboard-background  text-[0F172A] relative py-10">
                <div className=" mx-auto    overflow-hidden ">



                    <div className="p-6  bg-white rounded-2xl  ">
                        <span className="text-sm font-semibold text-[#0F172A] ">Time Period</span>
                        <div className=" mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">



                            <div className="flex  gap-2  w-full sm:w-max">
                                <div className="flex  justify-between  w-full sm:w-max gap-2 md:gap-3  rounded-lg">
                                    {PERIOD_OPTIONS.map((period) => (
                                        <button
                                            key={period.value}
                                            onClick={() => onPeriodChange(period.value)}
                                            className={`px-4 py-3  text-sm font-medium rounded-md transition-all disabled:opacity-50 ${selectedPeriod === period.value
                                                ? "bg-blue-base text-white shadow-sm"
                                                : "text-[#0F172A]  bg-[#F4F5F8] hover:text-gray-700 hover:bg-gray-200/50"
                                                }`}
                                        >
                                            {period.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
<CountryDropdown value={selectedCountry} onChange={onCountryChange}/>

                            <div className="relative hidden w-full sm:w-max    sm:mt-0">
                            </div>
                        </div>
                    </div>


                    <div className="overflow-x-auto bg-white border border-[#EFF0F3] rounded-2xl mt-6">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-[#F8F9FB] ">
                                <tr className="border-b border-gray-100 text-[#303030] text-sm font-medium">
                                    <th className="py-4 px-6 w-24">Rank</th>
                                    <th className="py-4 px-6 w-48 ">User</th>
                                    <th className="py-4 px-6 w-48 min-w-[250px]">Languages</th>
                                    <th className="py-4 px-6 w-48">Streak</th>
                                    <th className="py-4 px-6 w-48">Country</th>
                                    <th className="py-4 px-6 text-right w-32">XP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EFF0F3]">
                                {isLoading ? (
                                    <LeaderboardTableSkeleton />
                                ) : (
                                    // Render Actual Data
                                    leaderboard.map((user: LeaderboardUser) => (
                                        <tr
                                            key={user.userId}
                                            ref={user.currentUser ? currentUserRef : null}
                                            className={`hover:bg-gray-100 cursor-pointer transition-colors duration-300 group ${user.currentUser ? "bg-blue-base/5" : ""
                                                }`}
                                        >

                                            <td className="py-4 px-6">
                                                {user.rank === 1 ? <span className="text-2xl" title="1st"><MedalIcon /></span> :
                                                    user.rank === 2 ? <span className="text-2xl" title="2nd"><SilverMedalIcon /></span> :
                                                        user.rank === 3 ? <span className="text-2xl" title="3rd"><BronzeMedalIcon /></span> :
                                                            <span className="text-[#475569]   text-lg">#{user.rank}</span>}
                                            </td>


                                            <td className="py-4 px-6 flex items-center gap-2">
                                                <img
                                                    src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
                                                    alt={user.username}
                                                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                                                />
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-[#0F172A] text-sm">
                                                            {user.username}
                                                        </span>
                                                        {user.currentUser && (
                                                            <span className="text-blue-base text-sm  ">
                                                                (You)
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-[#64748B] mt-[2px]">
                                                        {user.challengesSolved} challenges solved
                                                    </span>
                                                </div>
                                            </td>


                                            <td className="py-4 px-6">
                                                <div className="flex gap-1.5">
                                                    {user.languages.map((lang, index) => (
                                                        <LanguageBadge key={index} name={lang} className="w-6 h-6 rounded  transition-transform" />
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="flex  items-center gap-2 ">
                                                    <FlameIconV2 />
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center   text-sm font-semibold text-[#0F172A]">
                                                            {user.streak.currentStreak.count} days
                                                        </div>
                                                        <span className="text-xs text-[#64748B]  ">
                                                            Longest: {user.streak.longestStreak.count}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex  items-center gap-2 ">
                                                    {user.countryFlag && (
                                                        user.countryFlag.startsWith("http") ? (
                                                            <img src={user.countryFlag} alt={user.country || ""} className="w-5 h-5 rounded-full object-cover" />
                                                        ) : (
                                                            <span className="text-base">{user.countryFlag}</span>
                                                        )
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-base text-black   ">
                                                           {user.country || "—"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>


                                            <td className="py-4 px-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-bold text-[#2563EB] text-base">
                                                        {user.totalXp.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-[#16A34A] font-medium">
                                                        +{user.periodXp}{" "}
                                                        {getTimePeriodLabel()}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {!isLoading && leaderboard.length === 0 && (
                            <div className="p-8 text-center text-[#0F172A] ">No users found for this filter.</div>
                        )}
                    </div>
                </div>



                {!isLoading && currentUserRank && (
                    <button
                        onClick={scrollToUser}
                        className="fixed -bottom-16  md:bottom-1  right-8 md:right-[calc((100vw-768px)/2+20px)] lg:right-[calc((100vw-1024px)/2+90px)] xl:right-[calc((100vw-1280px)/2+100px)] 2xl:right-[calc((100vw-1536px)/2+230px)] z-50 group hover:scale-110 transition-transform duration-300 drop-shadow-[0_8px_16px_rgba(59,130,246,0.4)] cursor-pointer"
                        title="Scroll to your rank"
                    >



                        <HexagonRankIcon
                            value={currentUserRank?.rank || '0'}
                            className="w-[105px] h-[105px] md:w-28 md:h-28 group hover:scale-[1.02] transition-transform duration-300"
                        />



                    </button>
                )}


                <style dangerouslySetInnerHTML={{
                    __html: `
        .clip-hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}} />
            </div>
        </SecondaryContainer>
    );
}