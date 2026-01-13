import { Skeleton } from "@/components/ui/skeleton";

export const ChallengeCardSkeleton = () => {
  return (
    <div className="challenges-card-class bg-white dark:bg-[#FFFFFF0D] space-y-4">
      <div className="flex justify-between items-center gap-3">
        <Skeleton className="h-5 lg:h-[22px] w-[55%] rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-[95%] rounded-md" />
        <Skeleton className="h-4 w-[70%] rounded-md" />
      </div>

      <div className="flex flex-wrap gap-3 mt-3 justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
        </div>

        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
    </div>
  );
};
