"use client";

import * as React from "react";
import type { ChallengesTypes } from "@/types";
import { useInView } from "react-intersection-observer";

import { ChallengeCardView } from "@/containers/Challenges";
import { ChallengeCardSkeleton } from "@/skeletons/ChallengeCardSkeleton";
import { ChallengeTableView } from "@/containers/Challenges/ChallengeTableView";
import { DataNotAvailable } from "@/components/ui/data-not-available";
import { SyncLoader } from "react-spinners";
import { ChallengeTableViewV2 } from "./ChallengeTableViewV2";

type ViewMode = "card" | "list";

type ChallengesListSectionProps = {
  isLoading: boolean;
  currentView: ViewMode;
  allChallenges: ChallengesTypes[];

  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const ChallengesListSectionV2 = React.memo(
  ({
    isLoading,
    currentView,
    allChallenges,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }: ChallengesListSectionProps) => {
    const { ref, inView } = useInView({
      root: null,
      threshold: 0,
      rootMargin: "500px",
    });

    React.useEffect(() => {
      if (!inView) return;
      if (!hasNextPage) return;
      if (isLoading || isFetchingNextPage) return;

      fetchNextPage();
    }, [inView, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage]);

    const totalItems = allChallenges.length;

    return (
      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2   2xl:grid-cols-3  gap-2 xl:gap-3 2xl:gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <ChallengeCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!isLoading && totalItems > 0 && (
          <>
            {currentView === "card" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2   2xl:grid-cols-3   gap-2 xl:gap-3 2xl:gap-5 w-full">
                {allChallenges.map((item) => (
                  <ChallengeCardView {...item} key={item.id} />
                ))}
              </div>
            ) : (
              <ChallengeTableViewV2 items={allChallenges} />
            )}

            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-10">
                <SyncLoader speedMultiplier={0.8} size={10} color="#018CFF" />
              </div>
            )}

            <div ref={ref} />
          </>
        )}

        {!isLoading && totalItems === 0 && <DataNotAvailable />}
      </div>
    );
  },
);
