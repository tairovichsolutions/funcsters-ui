import React from 'react';
import AnimatedProgressBar from './AnimatedProgressBar';

// --- Types ---
interface StatItem {
  id: string;
  value: string | number;
  label: string;
  icon: React.ReactNode;
}

interface DashboardData {
  rank: number;
  rankMessage: string;
  weeklyXp: string;
  nextRank: number;
  xpNeeded: number;
  progressPercentage: number;
  stats: StatItem[];
}

// --- Mock Data Array ---
const dashboardData: DashboardData = {
  rank: 8,
  rankMessage: "Top 10! Keep pushing!",
  weeklyXp: "+ 1,420 XP this week",
  nextRank: 7,
  xpNeeded: 150,
  progressPercentage: 70,
  stats: [
    {
      id: 'streak',
      value: 15,
      label: 'Day Streak',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#FF7A00]">
          <path d="M11.69 3.44a.75.75 0 011.08-.21c1.94 1.44 3.4 3.2 4.19 5.31.81 2.14.86 4.45.24 6.64a.75.75 0 01-1.44-.41c.54-1.92.51-3.95-.2-5.83-.67-1.78-1.92-3.32-3.6-4.63a.75.75 0 01-.27-.87z" />
          <path d="M12.5 5.5c-1.27 1.5-2 3.42-2 5.5a.75.75 0 01-1.5 0c0-1.63.48-3.15 1.3-4.42a8 8 0 1010.55 9.07.75.75 0 111.48.24 9.5 9.5 0 11-12.72-10.8.75.75 0 01.89.41z" />
          <path d="M11.5 12.5a2.5 2.5 0 104.99-.2 2.5 2.5 0 00-4.99.2z" />
        </svg>
      ),
    },
    {
      id: 'problems',
      value: 142,
      label: 'Problems solved',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#9D4EDD]">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.875 12.375a3.375 3.375 0 106.75 0 3.375 3.375 0 00-6.75 0zM12 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'total_xp',
      value: 320,
      label: 'Total XP',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#3A86FF]">
          <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
        </svg>
      ),
    },
  ],
};

// --- Component ---
export default function LeaderboardBanner() {
  // No hooks here! This is now a clean Server Component.
  
  return (
    <div className="w-full max-w-6xl my-5 mx-auto p-4 md:p-6 bg-[#0084FF] rounded-xl font-sans shadow-lg select-none">
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-5">
        
        {/* Left: Rank & Message */}
        <div className="flex items-center gap-4">
          
          {/* Shield Badge */}
          <div className="relative w-16 h-20 flex items-center justify-center shrink-0">
            <svg 
              className="absolute inset-0 w-full h-full drop-shadow-md" 
              viewBox="0 0 24 24" 
              fill="url(#shield-gradient)"
            >
              <defs>
                <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD54F" />
                  <stop offset="100%" stopColor="#FF8F00" />
                </linearGradient>
              </defs>
              <path d="M12 2L3 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" />
            </svg>
            <span className="relative z-10 text-[26px] font-extrabold text-[#FF3D00] mt-1 tracking-tighter">
              #{dashboardData.rank}
            </span>
          </div>

          {/* Texts */}
          <div className="flex flex-col">
            <span className="text-white/80 text-xs font-medium mb-0.5">Your Rank</span>
            <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight mb-0.5">
              🔥 {dashboardData.rankMessage}
            </h2>
            <span className="text-white/80 text-xs font-medium">
              {dashboardData.weeklyXp}
            </span>
          </div>
        </div>

        {/* Right: Stats Array Mapping */}
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {dashboardData.stats.map((stat) => (
            <div 
              key={stat.id} 
              className="bg-white rounded-[10px] p-2 flex flex-col items-center justify-center min-w-[96px] w-[100px] shrink-0 shadow-sm"
            >
              <div className="flex items-center gap-1.5 mb-2 mt-1">
                {stat.icon}
                <span className="text-slate-800 font-bold text-lg leading-none">
                  {stat.value}
                </span>
              </div>
              <div className="w-[80%] h-[1px] bg-slate-100 mb-1.5"></div>
              <span className="text-slate-500 text-[9px] font-semibold uppercase tracking-wider mb-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-white/20 mb-4" />

      {/* Replaced with the Client Component */}
      <AnimatedProgressBar 
        nextRank={dashboardData.nextRank} 
        xpNeeded={dashboardData.xpNeeded} 
        progressPercentage={dashboardData.progressPercentage} 
      />
      
    </div>
  );
}