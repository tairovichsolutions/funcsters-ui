/* eslint-disable @next/next/no-img-element */
import { formatDateRange } from "@/lib/formatDateRange";
import React from "react";
import FlameIconV2 from "../../../public/svgs/leaderBoard/FlameIconV2";
import FlameIconV3 from "../../../public/svgs/leaderBoard/FlameIconV3";
import StarBadgeIcon from "../../../public/svgs/leaderBoard/StarBadgeIcon";

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

export const StreakStatsCardV2 = React.memo(({ streakData }: StreakDataType) => {
    const currentStreak = streakData?.currentStreak;
    const longestStreak = streakData?.longestStreak;

    return (
        <div className="w-full   flex flex-col items-center ">

            {/* Header Section */}
            <div className="flex items-center justify-between w-full mb-5">

                {/* Left: Title & Fire Icon */}
                <div className="flex items-center gap-1">
                    <div className="w-8 h-8 bg-[#FF6028]  rounded-full flex items-center justify-center ">
                        <FlameIconV2 />
                    </div>
                    <h2 className="text-[14px] dark:text-white font-semibold text-[#1a1f2e]">
                        Streak
                    </h2>
                </div>

                {/* Right: Longest Streak Badge */}
                <div className="flex items-center gap-1 bg-[#FFF5D4] px-2.5 py-1.5 rounded-md">
                    <span className="text-sm leading-none"><StarBadgeIcon /></span>
                    <span className="text-[12px] font-medium text-[#64748B] ">
                        Longest:
                    </span>
                    <span className="text-[12px] font-bold text-[#FF6220]">
                        {longestStreak?.count ?? 0} Days
                    </span>
                </div>
            </div>

            {/* Main Circular Chart Section */}
         <div className="relative w-[120px] h-[120px] rounded-full border-[1.5px] border-[#FFD9C7] bg-[#F759000D] dark:rounded-[124px] dark:border dark:border-[#F75900]/60 dark:bg-[#F75900]/30 dark:[box-shadow:inset_0_4px_31px_0_rgba(255,255,255,0.25)] dark:[backdrop-filter:blur(2.607142925262451px)] flex flex-col items-center justify-center">

                {/* Counter Section (Number + Floating Fire + "Days") */}
                <div className="flex items-baseline mt-2">
                    <div className="relative">
                        <span className="text-[32px] font-black dark:text-white text-[#FF6220] leading-none tracking-tight block">
                            {currentStreak?.count ?? 0}
                        </span>
                        {/* Floating Fire Icon */}

                        <FlameIconV3 className="absolute -top-1 -right-5 w-4 h-4 object-contain" />

                    </div>
                    <span className="text-[13px] font-semibold dark:text-white text-[#1a1f2e] ml-2">
                        Days
                    </span>
                </div>

                {/* Subtitle */}
                <p className="text-[#FF6220] dark:text-white text-[13px] font-medium mt-1">
                    Current
                </p>

                {/* Overlapping Date Range Badge */}
                {currentStreak?.startDate && currentStreak?.endDate && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#FF6220] px-3 py-1.5 rounded-full shadow-sm">
                        <p className="text-white font-medium text-[11px] whitespace-nowrap leading-none">
                            {formatDateRange(currentStreak.startDate, currentStreak.endDate)}
                        </p>
                    </div>
                )}
            </div>
           <div className="h-[1px] w-full bg-[#EDEDF2] dark:bg-[#282B2E] my-4" />
        </div>
    );
});

StreakStatsCardV2.displayName = "StreakStatsCardV2";