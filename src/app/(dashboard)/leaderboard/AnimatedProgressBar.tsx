'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedProgressBarProps {
  nextRank: number;
  xpNeeded: number;
  progressPercentage: number;
  label?: string;
}

export default function AnimatedProgressBar({ nextRank, xpNeeded, progressPercentage, label }: AnimatedProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 1. Tell React the component has mounted to clear the skeleton
    setIsMounted(true);

    // 2. Trigger the animation with a slight delay so the browser registers the 0% -> target% transition
    const timer = setTimeout(() => {
      setProgress(progressPercentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [progressPercentage]);

  // --- Skeleton Loader ---
  if (!isMounted) {
    return (
      <div className="flex flex-col gap-2 w-full animate-pulse">
        <div className="flex justify-between items-center text-xs mb-1">
          <div className="h-3 bg-white/20 rounded w-32"></div>
          <div className="h-3 bg-white/20 rounded w-20"></div>
        </div>
        {/* The Skeleton Track: Left empty (no fill) to prevent the flashing glitch */}
        <div className="relative w-full h-2.5 bg-black/10 rounded-[10px]"></div>
      </div>
    );
  }

  // --- Actual Progress Bar ---
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-white text-xs font-medium">
        <span>{label || `Progress to Rank #${nextRank}`}</span>
        <span>{xpNeeded} XP needed</span>
      </div>

      {/* Track */}
      <div className="relative w-full h-2.5 bg-[#66baff] rounded-[10px]">
        {/* Filled Gradient */}
        <div
          className="absolute top-0 left-0 h-full rounded-[10px] transition-all duration-1000 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #01C6F3 0%, #10C745 40%, #85D343 70%, #FE8C00 100%)'
          }}
        >

        </div>
        {/* Thumb / Handle indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.3)] rounded-full"
          style={{
            left: `calc(${progress}% - 9px)`, // 9px is exactly half of the 18px SVG width
            opacity: progress > 0 ? 1 : 0
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="9" fill="white" />
            <circle cx="9" cy="9" r="7.5" stroke="#008CFF" strokeOpacity="0.3" strokeWidth="3" />
          </svg>
        </div>  
      </div>
    </div>
  );
}