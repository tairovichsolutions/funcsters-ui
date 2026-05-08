/* eslint-disable @next/next/no-img-element */
import { useTheme } from "next-themes";
import React from "react";
import StarIcon from "../../../public/svgs/leaderBoard/StarIcon";

export const XpPointsCardV2 = React.memo(({ xpData }: { xpData: number }) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <div className="w-full">
            {/* Top Border/Divider */}


            <div className="flex items-center justify-between ">
                {/* Left Side: Icon and Label */}
                <div className="flex items-center gap-1">
                    <div className="flex items-center justify-center rounded-full  shadow-inner">
                        {/* Simple Star SVG */}
                       <StarIcon/>
                    </div>
                    <span className="text-sm font-semibold dark:text-white text-[#0F172A]">XP Points</span>
                </div>

                {/* Right Side: Value */}
                <span className="text-base font-bold text-[#FFA539]">{xpData} XP</span>
            </div>

            {/* Bottom Border/Divider */}
           <div className="h-[1px] w-full bg-[#EDEDF2] dark:bg-[#9494aa] my-4" />
        </div>
    );
});
