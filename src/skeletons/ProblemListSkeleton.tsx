import { Separator } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";

export const ProblemListSkeleton = () => {
  return (
    <div className="py-2">
      <div className="flex justify-between gap-3">
        <Skeleton className="h-5 w-40 rounded " />
        <Skeleton className="h-4 w-12 rounded-full " />
      </div>
      <Separator className="my-1" />
    </div>
  );
};
