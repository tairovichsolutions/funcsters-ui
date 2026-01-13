import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface GreetingAreaType {
  username: string;
  profileLoading?: boolean;
  isAuthenticated?: boolean;
}
export const GreetingArea = React.memo(
  ({ username, profileLoading, isAuthenticated }: GreetingAreaType) => {
    return (
      <div>
        {profileLoading ? (
          <div>
            <Skeleton className=" bg-white dark:bg-gray-800 w-[40%]  h-10 " />
            <Skeleton className=" bg-white dark:bg-gray-800 w-[25%] h-4 mt-2" />
          </div>
        ) : isAuthenticated ? (
          <>
            <h2
              style={{ fontWeight: "900" }}
              className="dark:text-white text-black  font-nexaBold text-xl sm:text-2xl  md::text-3xl  lg:text-4xl"
            >
              Good Morning, {username}! 👋
            </h2>
            <p className="dark:text-white text-black/60 font-normal text-sm md:text-[15px] mt-2">
              Ready to tackle today’s coding challenges?
            </p>
          </>
        ) : null}
      </div>
    );
  }
);
