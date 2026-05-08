import { Skeleton } from "@/components/ui/skeleton";

export const LeaderboardTableSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={`skeleton-${i}`}>
          <td className="py-4 px-6">
            <Skeleton className="h-6 w-8 rounded" />
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex gap-1.5">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};
