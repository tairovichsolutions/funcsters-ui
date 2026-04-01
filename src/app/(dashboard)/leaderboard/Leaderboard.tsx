/* eslint-disable @next/next/no-img-element */
"use client";

import SecondaryContainer from "@/components/shared/container/SecondaryContainer";
import { useEffect, useRef, useState } from "react";
import FlameIconV2 from "../../../../public/svgs/leaderBoard/FlameIconV2";

import { ChevronDown } from "lucide-react";
import BronzeMedalIcon from "../../../../public/svgs/leaderBoard/BronzeMedalIcon";
import GlobeIcon from "../../../../public/svgs/leaderBoard/GlobeIcon";
import HexagonRankIcon from "../../../../public/svgs/leaderBoard/HexagonRankIcon";
import MedalIcon from "../../../../public/svgs/leaderBoard/MedalIcon";
import SilverMedalIcon from "../../../../public/svgs/leaderBoard/SilverMedalIcon";
import { LanguageBadge } from "./LanguageBadge";

// --- Types ---
type Language = "python" | "js";
type TimePeriod = "Weekly" | "Monthly" | "All Time";

interface UserData {
    id: string;
    rank: number;
    name: string;
    challengesSolved: number;
    languages: Language[];
    streak: number;
    longestStreak: number;
    xp: number;
    xpGained: number;
    isCurrentUser?: boolean;
}

// --- Base Dummy Data ---
const BASE_DATA = [
    { id: "1", rank: 1, name: "Jane Cooper", challengesSolved: 187, languages: ["python", "js"], streak: 28, longestStreak: 45, xp: 1000000, xpGained: 520 },
    { id: "2", rank: 2, name: "Wade Warren", challengesSolved: 165, languages: ["python", "js"], streak: 27, longestStreak: 45, xp: 485, xpGained: 485 },
    { id: "3", rank: 3, name: "Jerome Bell", challengesSolved: 152, languages: ["python", "js"], streak: 26, longestStreak: 45, xp: 450, xpGained: 450 },
    { id: "4", rank: 4, name: "Robert Fox", challengesSolved: 130, languages: ["python", "js"], streak: 25, longestStreak: 45, xp: 410, xpGained: 410 },
    { id: "5", rank: 5, name: "Robert Fox", challengesSolved: 128, languages: ["python", "js"], streak: 24, longestStreak: 45, xp: 365, xpGained: 365 },
    { id: "6", rank: 6, name: "Floyd Miles", challengesSolved: 124, languages: ["python", "js"], streak: 23, longestStreak: 45, xp: 340, xpGained: 340 },
    { id: "7", rank: 7, name: "Jerome Bell", challengesSolved: 115, languages: ["python", "js"], streak: 22, longestStreak: 45, xp: 325, xpGained: 325 },
    { id: "8", rank: 8, name: "Rahat Hossain", challengesSolved: 108, languages: ["python", "js"], streak: 21, longestStreak: 45, xp: 320, xpGained: 320, isCurrentUser: true },
    { id: "9", rank: 9, name: "Wade Warren", challengesSolved: 105, languages: ["python", "js"], streak: 20, longestStreak: 45, xp: 295, xpGained: 295 },
    { id: "10", rank: 10, name: "Brooklyn Simmons", challengesSolved: 98, languages: ["python", "js"], streak: 19, longestStreak: 45, xp: 280, xpGained: 280 },
    { id: "11", rank: 11, name: "Emily Chen", challengesSolved: 95, languages: ["python", "js"], streak: 18, longestStreak: 42, xp: 950, xpGained: 310 },
    { id: "12", rank: 12, name: "Liam O'Connor", challengesSolved: 92, languages: ["python", "js", "java"], streak: 17, longestStreak: 40, xp: 920, xpGained: 305 },
    { id: "13", rank: 13, name: "Sophia Martinez", challengesSolved: 89, languages: ["python"], streak: 16, longestStreak: 38, xp: 890, xpGained: 300 },
    { id: "14", rank: 14, name: "Mason Johnson", challengesSolved: 86, languages: ["js", "c++"], streak: 15, longestStreak: 36, xp: 860, xpGained: 295 },
    { id: "15", rank: 15, name: "Isabella Garcia", challengesSolved: 83, languages: ["python", "js"], streak: 14, longestStreak: 35, xp: 830, xpGained: 290 },
    { id: "16", rank: 16, name: "Ethan Williams", challengesSolved: 80, languages: ["python"], streak: 13, longestStreak: 34, xp: 800, xpGained: 285 },
    { id: "17", rank: 17, name: "Mia Brown", challengesSolved: 77, languages: ["js", "ruby"], streak: 12, longestStreak: 33, xp: 770, xpGained: 280 },
    { id: "18", rank: 18, name: "Alexander Jones", challengesSolved: 74, languages: ["python", "js"], streak: 11, longestStreak: 32, xp: 740, xpGained: 275 },
    { id: "19", rank: 19, name: "Charlotte Davis", challengesSolved: 71, languages: ["python"], streak: 10, longestStreak: 31, xp: 710, xpGained: 270 },
    { id: "20", rank: 20, name: "Benjamin Miller", challengesSolved: 68, languages: ["js", "go"], streak: 9, longestStreak: 30, xp: 680, xpGained: 265 },
    { id: "21", rank: 21, name: "Amelia Wilson", challengesSolved: 65, languages: ["python", "js"], streak: 8, longestStreak: 29, xp: 650, xpGained: 260 },
    { id: "22", rank: 22, name: "Lucas Moore", challengesSolved: 62, languages: ["python"], streak: 7, longestStreak: 28, xp: 620, xpGained: 255 },
    { id: "23", rank: 23, name: "Harper Taylor", challengesSolved: 59, languages: ["js", "rust"], streak: 6, longestStreak: 27, xp: 590, xpGained: 250 },
    { id: "24", rank: 24, name: "Elijah Anderson", challengesSolved: 56, languages: ["python", "js"], streak: 5, longestStreak: 26, xp: 560, xpGained: 245 },
    { id: "25", rank: 25, name: "Evelyn Thomas", challengesSolved: 53, languages: ["python"], streak: 4, longestStreak: 25, xp: 530, xpGained: 240 },
    { id: "26", rank: 26, name: "James Jackson", challengesSolved: 50, languages: ["js", "c#"], streak: 3, longestStreak: 24, xp: 500, xpGained: 235 },
    { id: "27", rank: 27, name: "Abigail White", challengesSolved: 47, languages: ["python", "js"], streak: 2, longestStreak: 23, xp: 470, xpGained: 230 },
    { id: "28", rank: 28, name: "Daniel Harris", challengesSolved: 44, languages: ["python"], streak: 1, longestStreak: 22, xp: 440, xpGained: 225 },
    { id: "29", rank: 29, name: "Victoria Martin", challengesSolved: 41, languages: ["js", "php"], streak: 1, longestStreak: 21, xp: 410, xpGained: 220 },
    { id: "30", rank: 30, name: "Matthew Thompson", challengesSolved: 38, languages: ["python", "js"], streak: 2, longestStreak: 20, xp: 380, xpGained: 215 },
    { id: "31", rank: 31, name: "Grace Garcia", challengesSolved: 35, languages: ["python"], streak: 3, longestStreak: 19, xp: 350, xpGained: 210 },
    { id: "32", rank: 32, name: "David Martinez", challengesSolved: 32, languages: ["js", "swift"], streak: 4, longestStreak: 18, xp: 320, xpGained: 205 },
    { id: "33", rank: 33, name: "Chloe Robinson", challengesSolved: 29, languages: ["python", "js"], streak: 5, longestStreak: 17, xp: 290, xpGained: 200 },
    { id: "34", rank: 34, name: "Andrew Clark", challengesSolved: 26, languages: ["python"], streak: 6, longestStreak: 16, xp: 260, xpGained: 195 },
    { id: "35", rank: 35, name: "Natalie Rodriguez", challengesSolved: 23, languages: ["js", "kotlin"], streak: 7, longestStreak: 15, xp: 230, xpGained: 190 },
    { id: "36", rank: 36, name: "Joshua Lewis", challengesSolved: 20, languages: ["python", "js"], streak: 8, longestStreak: 14, xp: 200, xpGained: 185 },
    { id: "37", rank: 37, name: "Madison Lee", challengesSolved: 18, languages: ["python"], streak: 9, longestStreak: 13, xp: 180, xpGained: 180 },
    { id: "38", rank: 38, name: "Christopher Walker", challengesSolved: 16, languages: ["js", "typescript"], streak: 10, longestStreak: 12, xp: 160, xpGained: 175 },
    { id: "39", rank: 39, name: "Elizabeth Hall", challengesSolved: 14, languages: ["python", "js"], streak: 11, longestStreak: 11, xp: 140, xpGained: 170 },
    { id: "40", rank: 40, name: "Joseph Allen", challengesSolved: 12, languages: ["python"], streak: 12, longestStreak: 10, xp: 120, xpGained: 165 },
    { id: "41", rank: 41, name: "Sofia Young", challengesSolved: 10, languages: ["js", "c++"], streak: 13, longestStreak: 9, xp: 100, xpGained: 160 },
    { id: "42", rank: 42, name: "Samuel King", challengesSolved: 9, languages: ["python", "js"], streak: 14, longestStreak: 8, xp: 90, xpGained: 155 },
    { id: "43", rank: 43, name: "Avery Wright", challengesSolved: 8, languages: ["python"], streak: 15, longestStreak: 7, xp: 80, xpGained: 150 },
    { id: "44", rank: 44, name: "John Scott", challengesSolved: 7, languages: ["js", "ruby"], streak: 16, longestStreak: 6, xp: 70, xpGained: 145 },
    { id: "45", rank: 45, name: "Ella Green", challengesSolved: 6, languages: ["python", "js"], streak: 17, longestStreak: 5, xp: 60, xpGained: 140 },
    { id: "46", rank: 46, name: "Nathan Baker", challengesSolved: 5, languages: ["python"], streak: 18, longestStreak: 4, xp: 50, xpGained: 135 },
    { id: "47", rank: 47, name: "Scarlett Adams", challengesSolved: 4, languages: ["js", "go"], streak: 19, longestStreak: 3, xp: 40, xpGained: 130 },
    { id: "48", rank: 48, name: "Dylan Nelson", challengesSolved: 3, languages: ["python", "js"], streak: 20, longestStreak: 2, xp: 30, xpGained: 125 },
    { id: "49", rank: 49, name: "Lily Carter", challengesSolved: 2, languages: ["python"], streak: 21, longestStreak: 1, xp: 20, xpGained: 120 },
    { id: "50", rank: 50, name: "Gabriel Mitchell", challengesSolved: 1, languages: ["js"], streak: 22, longestStreak: 1, xp: 10, xpGained: 115 }
];

const COUNTRIES = ["All Countries", "United States", "India", "Bangladesh", "United Kingdom", "Canada"];

// --- Simulated Backend Fetch ---
const fetchLeaderboardData = async (time: TimePeriod, country: string): Promise<UserData[]> => {
    return new Promise((resolve) => {
        // Simulate network delay (600ms)
        setTimeout(() => {
            let filtered = [...BASE_DATA];

            // Fake Country Filter: Randomly drop some users to simulate a different region's leaderboard
            // (Always keep the current user for the demo's scroll functionality)
            if (country !== "All Countries") {
                filtered = filtered.filter((u, index) => index % 2 === 0 || u.isCurrentUser);
            }

            // Fake Time Period Filter: Multiply XP to simulate longer timeframes
            if (time === "Monthly") {
                filtered = filtered.map(u => ({ ...u, xp: u.xp * 4, xpGained: u.xpGained * 2.5 }));
            } else if (time === "All Time") {
                filtered = filtered.map(u => ({ ...u, xp: u.xp * 24, xpGained: u.xpGained * 1.2 }));
            }

            // Re-calculate ranks based on the new mutated array
            filtered = filtered.sort((a, b) => b.xp - a.xp).map((u, index) => ({ ...u, rank: index + 1 }));

            // Change line 112 to:
            resolve(filtered as UserData[]);
        }, 600);
    });
};

export default function Leaderboard() {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("Weekly");
    const [country, setCountry] = useState("All Countries");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [data, setData] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const currentUserRef = useRef<HTMLTableRowElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Trigger Backend Fetch when filters change
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        fetchLeaderboardData(timePeriod, country).then((newData) => {
            if (isMounted) {
                setData(newData);
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false; // Cleanup to prevent race conditions if filters change rapidly
        };
    }, [timePeriod, country]);

    const currentUser = data.find((user) => user.isCurrentUser);

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

    return (
        <SecondaryContainer>
            <div className=" bg-dashboard-background  text-[0F172A] relative py-10">
                <div className=" mx-auto    overflow-hidden ">



                    <div className="p-6  bg-white rounded-2xl  ">
                        <span className="text-sm font-semibold text-[#0F172A] ">Time Period</span>
                        <div className=" mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">



                            <div className="flex  gap-2  w-full sm:w-max">
                                <div className="flex  justify-between  w-full sm:w-max gap-2 md:gap-3  rounded-lg">
                                    {["Weekly", "Monthly", "All Time"].map((period) => (
                                        <button
                                            key={period}
                                            // disabled={isLoading}
                                            onClick={() => setTimePeriod(period as TimePeriod)}
                                            className={`px-4 py-3  text-sm font-medium rounded-md transition-all disabled:opacity-50 ${timePeriod === period
                                                ? "bg-blue-base text-white shadow-sm"
                                                : "text-[#0F172A]  bg-[#F4F5F8] hover:text-gray-700 hover:bg-gray-200/50"
                                                }`}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>
                            </div>


                            <div className="relative w-full sm:w-max    sm:mt-0" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    // disabled={isLoading}
                                    className="flex w-full sm:w-max    px-4 py-3  items-center gap-2  hover:bg-gray-100 border border-gray-200  rounded-lg text-sm font-medium transition-colors disabled:opacity-50 min-w-[160px] justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <GlobeIcon />
                                        <span className="truncate max-w-[100px]">{country}</span>
                                    </div>
                                    <span className={`text-neutral-05 text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}><ChevronDown size={24} /></span>
                                </button>


                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                                        {COUNTRIES.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => {
                                                    setCountry(c);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${country === c ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
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
                                    <th className="py-4 px-6 text-right w-32">XP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EFF0F3]">
                                {isLoading ? (
                                    // Skeleton Loader State
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <tr key={`skeleton-${i}`} className="animate-pulse">
                                            <td className="py-4 px-6"><div className="h-6 w-6 bg-gray-200 rounded"></div></td>
                                            <td className="py-4 px-6 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                                    <div className="h-3 w-32 bg-gray-100 rounded"></div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6"><div className="h-6 w-16 bg-gray-200 rounded"></div></td>
                                            <td className="py-4 px-6"><div className="h-6 w-20 bg-gray-200 rounded"></div></td>
                                            <td className="py-4 px-6 flex justify-end"><div className="h-6 w-16 bg-gray-200 rounded"></div></td>
                                        </tr>
                                    ))
                                ) : (
                                    // Render Actual Data
                                    data.map((user) => (
                                        <tr
                                            key={user.id}
                                            ref={user.isCurrentUser ? currentUserRef : null}
                                            className={`hover:bg-gray-100 cursor-pointer transition-colors duration-300 group ${user.isCurrentUser ? "bg-blue-base/5" : ""
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
                                                    src={`https://i.pravatar.cc/150?u=${user.id}`}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                                                />
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-[#0F172A] text-sm">
                                                            {user.name}
                                                        </span>
                                                        {user.isCurrentUser && (
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
                                                            {user.streak} days
                                                        </div>
                                                        <span className="text-xs text-[#64748B]  ">
                                                            Longest: {user.longestStreak}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>


                                            <td className="py-4 px-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-bold text-[#2563EB] text-base">
                                                        {Math.round(user.xp).toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-[#16A34A] font-medium">
                                                        +{Math.round(user.xpGained)}{" "}
                                                        {{
                                                            "Weekly": "this wk",
                                                            "Monthly": "this mo",
                                                            "All Time": "all time"
                                                        }[timePeriod]}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {!isLoading && data.length === 0 && (
                            <div className="p-8 text-center text-[#0F172A] ">No users found for this filter.</div>
                        )}
                    </div>
                </div>



                {!isLoading && currentUser && (
                    <button
                        onClick={scrollToUser}
                        className="fixed bottom-5 right-8 md:right-[calc((100vw-768px)/2+20px)] lg:right-[calc((100vw-1024px)/2+90px)] xl:right-[calc((100vw-1280px)/2+100px)] 2xl:right-[calc((100vw-1536px)/2+230px)] z-50 group hover:scale-110 transition-transform duration-300 drop-shadow-[0_8px_16px_rgba(59,130,246,0.4)] cursor-pointer"
                        title="Scroll to your rank"
                    >



                        <HexagonRankIcon
                            value={currentUser?.rank || '0'}
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