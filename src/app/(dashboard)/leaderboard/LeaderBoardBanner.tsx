"use client";

import React from 'react';
import BrainNodeSvg from '../../../../public/svgs/leaderBoard/BrainNodeSvg';
import FlameIcon from '../../../../public/svgs/leaderBoard/FlameIcon';
import LightningIcon from '../../../../public/svgs/leaderBoard/LightningIcon';
import AnimatedProgressBar from './AnimatedProgressBar';
import SecondaryContainer from '@/components/shared/container/SecondaryContainer';
import { LeaderboardBannerSkeleton } from '@/skeletons/LeaderboardBannerSkeleton';
import type { CurrentUserRank, LeaderboardPeriod } from '@/types/leaderboard-types';
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn';
import { useAuthModal } from '@/providers/AuthModalsProvider';
import { Button } from '@/components/ui/button';

// --- Types ---
interface StatItem {
  id: string;
  value: string | number;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface LeaderboardBannerProps {
  currentUserRank: CurrentUserRank | undefined;
  isLoading: boolean;
  selectedPeriod: LeaderboardPeriod;
}

function getRankMessage(rank: number): string {
  if (rank <= 3) return "🏆 You're a champion!";
  if (rank <= 10) return "Top 10! Keep pushing!";
  if (rank <= 25) return "Almost there! Keep climbing!";
  if (rank <= 50) return "Great progress! Keep going!";
  return "Keep solving to climb up!";
}

function getXpMessage(xp: number, period: LeaderboardPeriod): string {
  if (xp > 0) {
    switch (period) {
      case "weekly": return `+ ${xp.toLocaleString()} XP earned this week!`;
      case "monthly": return `+ ${xp.toLocaleString()} XP earned this month!`;
      case "all_time": return `${xp.toLocaleString()} XP earned since you registered!`;
      default: return `+ ${xp.toLocaleString()} XP earned`;
    }
  }
  
  switch (period) {
    case "weekly": return "No XP earned this week yet.";
    case "monthly": return "No XP earned this month.";
    case "all_time": return "Time to make your mark! Start a challenge! 🚀";
    default: return "No XP earned for this period.";
  }
}

export default function LeaderboardBanner({ currentUserRank, isLoading, selectedPeriod }: LeaderboardBannerProps) {
  const loggedIn = useIsLoggedIn();
  const { openModal } = useAuthModal();

  if (isLoading) {
    return (
      <SecondaryContainer>
        <LeaderboardBannerSkeleton />
      </SecondaryContainer>
    );
  }

  if (!loggedIn) {
    return (
      <SecondaryContainer>
        <div className="w-full mx-auto p-6 md:p-10 bg-blue-base rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 select-none relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col gap-3 relative z-10 text-center md:text-left">
            <h2 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">
              Ready to join the ranks? 🚀
            </h2>
            <p className="text-white/90 text-sm md:text-lg font-medium max-w-xl">
              Log in to see where you stand, track your daily streak, and compete with other funcsters to climb the global leaderboard.
            </p>
          </div>
          
          <div className="flex flex-row gap-4 shrink-0 relative z-10 w-full md:w-auto justify-center">
            <Button 
              onClick={() => openModal("login")} 
              className="bg-white text-blue-base hover:bg-white/90 font-bold px-8 py-6 text-base rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              Log In
            </Button>
            <Button 
              onClick={() => openModal("signUp")} 
              variant="outline"
              className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white font-bold px-8 py-6 text-base rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </SecondaryContainer>
    );
  }

  if (!currentUserRank) {
    return (
      <SecondaryContainer>
        <LeaderboardBannerSkeleton />
      </SecondaryContainer>
    );
  }

  const { rank, xpEarnedPeriod, xpNeededForNextRank, totalChallengesSolved, totalXp, currentStreak, longestStreak } = currentUserRank;

  const progressPercentage = xpNeededForNextRank > 0
    ? Math.min(Math.round((xpEarnedPeriod / (xpEarnedPeriod + xpNeededForNextRank)) * 100), 100)
    : 100;

  const stats: StatItem[] = [
    {
      id: 'streak',
      value: currentStreak,
      label: 'Day Streak',
      icon: <FlameIcon />,
      color: "#FEEAD4",
    },
    {
      id: 'problems',
      value: totalChallengesSolved,
      label: 'Problems solved',
      icon: <BrainNodeSvg />,
      color: "#E9E6FC",
    },
    {
      id: 'total_xp',
      value: selectedPeriod === 'all_time' ? totalXp : xpEarnedPeriod,
      label: selectedPeriod === 'weekly' ? 'Weekly XP' : selectedPeriod === 'monthly' ? 'Monthly XP' : 'Total XP',
      icon: <LightningIcon />,
      color: "#FEEAD4",
    },
  ];

    const hasXp = selectedPeriod === "all_time" ? totalXp > 0 : xpEarnedPeriod > 0;

  return (
    <SecondaryContainer>
      <div className="w-full  mx-auto p-3 py-4 sm:py-0  sm:p-4 md:p-6   bg-blue-base rounded-xl  shadow-lg select-none">


        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-5">

          {/* Left: Rank & Message */}
          <div className="flex items-center gap-4">

            {/* Shield Badge */}
            <div className="relative w-16 h-20 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full drop-shadow-md" width="65" height="69" viewBox="0 0 65 69" fill="none">
                <path d="M31.5078 1.16895C32.0523 0.971705 32.6424 0.946895 33.1982 1.09473L33.4346 1.16895L61.3496 11.2832H61.3506C61.8183 11.4525 62.233 11.7419 62.5537 12.1221C62.8343 12.4548 63.0342 12.8468 63.1387 13.2676L63.1777 13.4502C63.6741 16.2271 63.9326 19.0851 63.9326 22.0078C63.9326 42.4548 51.3402 59.9651 33.4824 67.2041C32.8339 67.466 32.1085 67.4661 31.46 67.2041C13.6016 59.9647 1 42.4544 1 22.0088L1.01172 20.9326C1.06594 18.4236 1.31426 15.922 1.75488 13.4502C1.84283 12.9605 2.05812 12.5024 2.37891 12.1221C2.69961 11.7419 3.11433 11.4524 3.58203 11.2832H3.58301L31.5078 1.16895Z" fill="url(#paint0_linear_62019_8906)" stroke="#FFC338" strokeWidth="2" />
                <defs>
                  <linearGradient id="paint0_linear_62019_8906" x1="-2.39399" y1="-6.61974" x2="73.296" y2="68.3323" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFE177" />
                    <stop offset="0.085" stopColor="#FFE177" />
                    <stop offset="0.222" stopColor="#FFE177" />
                    <stop offset="0.394" stopColor="#FFE177" />
                    <stop offset="0.595" stopColor="#FFC338" />
                    <stop offset="0.816" stopColor="#FFC338" />
                    <stop offset="1" stopColor="#FFC338" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="relative z-10 text-[28px] font-extrabold text-[#FF480F] mt-1 tracking-tighter">
                {hasXp ? `#${rank}` : "—"}
              </span>
            </div>

            {/* Texts */}
            <div className="flex flex-col">
              <span className="text-white/70 text-sm font-medium mb-0.5">Your Rank</span>
              <h2 className="text-white text-xl md:text-2xl  font-semibold py-1 tracking-tight mb-0.5">
                {hasXp ? getRankMessage(rank) : "Ready to rank up?"}
              </h2>
              <span className="text-white/80 text-sm font-medium">
                {getXpMessage(xpEarnedPeriod, selectedPeriod)}
              </span>
            </div>
          </div>

          {/* Right: Stats Array Mapping */}
          <div className="flex justify-center items-center gap-3 w-full  md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white rounded-[10px] p-2 flex flex-col items-center justify-between min-w-[90px] lg:justify-start lg:min-w-[120px]  shrink-0 shadow-sm"
              >
                <div className="flex w-full items-center justify-start  gap-1.5 mb-2 mt-1">
                  <span className='w-8   h-8 '>
                    {stat.icon}
                  </span>
                  <span className="text-slate-800 font-bold text-lg leading-none">
                    {stat.value}
                  </span>
                </div>
                <div style={{ backgroundColor: stat.color }} className={`w-[90%] h-[1px] bg-[${stat.color}]  mb-1.5`}></div>
                <span className="text-slate-500 text-[10px] font-semibold  tracking-wider mb-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-white/40 mb-5" />

        {/* Replaced with the Client Component */}
        <AnimatedProgressBar
          nextRank={rank > 1 ? rank - 1 : 1}
          xpNeeded={xpNeededForNextRank}
          progressPercentage={progressPercentage}
          label={!hasXp ? "Progress to Leaderboard" : undefined}
        />

      </div>
    </SecondaryContainer>
  );
}