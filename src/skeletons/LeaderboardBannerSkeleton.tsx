import { Skeleton } from "@/components/ui/skeleton";

export const LeaderboardBannerSkeleton = () => {
  return (
    <div className="w-full mx-auto p-3 py-4 sm:py-0 sm:p-4 md:p-6 bg-blue-base rounded-xl shadow-lg select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-5">
        {/* Left: Rank & Message Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-20 rounded-lg bg-white/20" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20 rounded-full bg-white/20" />
            <Skeleton className="h-6 w-48 rounded-full bg-white/20" />
            <Skeleton className="h-3 w-36 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Right: Stats Skeleton */}
        <div className="flex justify-center items-center gap-3 w-full md:w-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`stat-skeleton-${i}`}
              className="bg-white rounded-[10px] p-2 flex flex-col items-center justify-between min-w-[90px] lg:min-w-[120px] shrink-0 shadow-sm"
            >
              <div className="flex w-full items-center justify-start gap-1.5 mb-2 mt-1">
                <Skeleton className="w-8 h-8 rounded-md" />
                <Skeleton className="h-5 w-10 rounded-md" />
              </div>
              <Skeleton className="w-[90%] h-[1px] mb-1.5" />
              <Skeleton className="h-2.5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-white/40 mb-5" />

      {/* Progress Bar Skeleton */}
      <div className="flex flex-col gap-2 w-full animate-pulse">
        <div className="flex justify-between items-center text-xs mb-1">
          <Skeleton className="h-3 w-32 rounded bg-white/20" />
          <Skeleton className="h-3 w-20 rounded bg-white/20" />
        </div>
        <Skeleton className="w-full h-2.5 rounded-[10px] bg-white/20" />
      </div>
    </div>
  );
};
