import { Skeleton } from "@/components/ui/skeleton";

export const ProfileAvatarSkeleton = () => {
  return (
    <section className=" flex gap-3 items-center w-36 shrink-0">
      <span>
        <Skeleton className=" size-9 rounded-full" />
      </span>
      <span className=" w-full space-y-1">
        <Skeleton className=" w-28 h-3 rounded-full" />
        <Skeleton className=" w-24 h-3 rounded-full" />
      </span>
    </section>
  );
};
