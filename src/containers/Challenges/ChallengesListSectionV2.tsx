"use client";

import * as React from "react";
import type { ChallengesTypes } from "@/types";
import { ChallengeCardView } from "@/containers/Challenges";
import { ChallengeCardSkeleton } from "@/skeletons/ChallengeCardSkeleton";
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

    const totalItems = allChallenges.length;

    const handleLoadMore = () => {
      if (!isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    };

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
              <div className="flex justify-center items-center py-6 w-full">
                <SyncLoader speedMultiplier={0.8} size={10} color="#018CFF" />
              </div>
            )}

            {hasNextPage && !isFetchingNextPage && (
              <div className="flex justify-center w-full">
                <button
                  onClick={handleLoadMore}
                  className="w-full py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-[#333] bg-[#F4F5F8] border border-[#DFE0E7] hover:bg-[#e8eaf0] dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-700"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && totalItems === 0 && <DataNotAvailable />}
      </div>
    );
  },
);
