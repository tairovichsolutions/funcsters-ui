import { Skeleton } from "@/components/ui/skeleton";

export const CommunitySolutionCardSkeleton = () => {
  return (
    <div className="border mt-1 border-[#00509233] dark:border-[#FFFFFF33] rounded-[12px] py-2 px-2.5">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 py-1">
          <Skeleton className="size-9 rounded-full" />
          <div className="  flex flex-col gap-2">
            <Skeleton className="h-4 w-24 " />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-24 " />
              <Skeleton className="h-3 w-24 " />
              <Skeleton className="h-3 w-24 " />
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center text-xs leading-none font-normal">
          <Skeleton className="h-4 w-12 " />
        </div>
      </div>

      <Skeleton className="mt-3 bg-[#0050920D] overflow-y-auto w-full dark:border-none dark:bg-[#FFFFFF0D] h-[220px] border border-[#E5E7EB] rounded-md p-3 font-mono text-xs text-gray-800 overflow-x-auto"></Skeleton>

      <div className="mt-3 mb-2 px-1 flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Skeleton className="h-4 w-20 " />
          <Skeleton className="h-4 w-20 " />
          <Skeleton className="h-4 w-20 " />
          <Skeleton className="h-4 w-20 " />
        </div>
        <Skeleton className="h-5 w-20 " />
      </div>
    </div>
  );
};
