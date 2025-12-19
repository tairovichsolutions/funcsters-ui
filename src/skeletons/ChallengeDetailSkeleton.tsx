import { Skeleton } from "@/components/ui/skeleton";

export const ChallengeDetailSkeleton = () => {
  return (
    <div>
      <div className=" flex items-center justify-between">
        <Skeleton className=" h-9 w-52" />
        <div className="flex gap-2">
          <Skeleton className=" h-7 w-20" />
          <Skeleton className=" h-7 w-20" />
          <Skeleton className=" h-7 w-20" />
        </div>
      </div>

      <div className=" mt-5">
        <Skeleton className=" h-4 w-[80%]" />
      </div>

      <div className=" mt-5 space-y-3">
        <Skeleton className=" h-4 w-full" />
        <Skeleton className=" h-4 w-[90%]" />
        <Skeleton className=" h-4 w-full" />
        <Skeleton className=" h-4 w-[95%]" />
        <Skeleton className=" h-40 w-full my-5" />
        <Skeleton className=" h-4 w-[92%]" />
        <Skeleton className=" h-4 w-[98%]" />
        <Skeleton className=" h-4 w-[80%]" />
        <Skeleton className=" h-4 w-full" />
        <Skeleton className=" h-4 w-full" />
        <Skeleton className=" h-4 w-[70%]" />
      </div>
    </div>
  );
};
