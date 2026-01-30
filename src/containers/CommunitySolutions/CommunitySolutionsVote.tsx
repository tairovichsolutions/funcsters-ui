"use client";

import { cn } from "@/lib";
import toast from "react-hot-toast";
import { SvgColor } from "@/components";
import React, { useState } from "react";
import { VOTE_CONFIG } from "@/constants/voteConfig";
import { useRerenderCount } from "@/hooks/useRerenderCount";
import { VoteDataTypes, VoteType } from "@/types/vote-solution-type";
import { useVoteCommunitySolution } from "@/mutations/useVoteCommunitySolution";

type CommunitySolutionsVoteProps = {
  mySolution?: boolean;
  voteData?: VoteDataTypes;
  languageId: number | string;
  solutionId: number | string;
  challengeId: number | string;
};

const toVoteType = (value: string | null) => {
  if (value === "GENIUS" || value === "SOLID" || value === "MEH") {
    return value;
  }
  return null;
};

export const CommunitySolutionsVote = React.memo(
  ({
    languageId,
    challengeId,
    mySolution,
    solutionId,
    voteData,
  }: CommunitySolutionsVoteProps) => {
    useRerenderCount("vote");

    const { mutateAsync: voteSolutionfc, isPending } =
      useVoteCommunitySolution();
    const [activeVote, setActiveVote] = useState<VoteType | null>(
      toVoteType(voteData?.currentUserVote ?? null)
    );

    const [voteCounts, setVoteCounts] = useState(() => ({
      GENIUS: voteData?.genius ?? 0,
      SOLID: voteData?.solid ?? 0,
      MEH: voteData?.meh ?? 0,
    }));

    const handleVoteClick = async (vote: VoteType) => {
      if (isPending) return;

      const prevVote = activeVote;
      const prevCounts = { ...voteCounts };

      setActiveVote((current) => (current === vote ? null : vote));

      setVoteCounts((prev) => {
        const updated = { ...prev };

        if (prevVote === vote) {
          updated[vote] -= 1;
        } else {
          if (prevVote) updated[prevVote] -= 1;
          updated[vote] += 1;
        }

        return updated;
      });

      try {
        const { data } = await voteSolutionfc({
          languageId,
          challengeId,
          solutionId,
          vote,
        });

        if (!data?.data?.success) {
          throw new Error(data?.data?.message);
        }
      } catch (error) {
        console.log(error);
        setActiveVote(prevVote);
        setVoteCounts(prevCounts);
        toast.error("Vote failed");
      }
    };

    const totalReactions =
      voteCounts.GENIUS + voteCounts.SOLID + voteCounts.MEH;

    return (
      <div className=" flex justify-between w-full items-center my-1.5">
        <div className=" flex items-center gap-5">
          {VOTE_CONFIG.map(
            ({ key, textClass, label, imgSrc, activeImgSrc, bgColor }) => {
              const isActive = activeVote === key;
              const count = voteCounts[key];

              return (
                <button
                  key={key}
                  disabled={isPending || mySolution}
                  onClick={() => handleVoteClick(key)}
                  className={cn(
                    "group flex items-center gap-1.5  rounded-md  cursor-pointer",
                    "border border-transparent",
                    "transition-transform duration-300 ease-out",
                    "hover:scale-[1.02]"
                  )}
                >
                  <SvgColor
                    src={isActive ? activeImgSrc : imgSrc}
                    className={cn(`size-[23px] `, isActive && bgColor)}
                  />

                  <div className="flex flex-col items-start space-y-0.5">
                    <h5
                      className={cn(
                        "text-xs font-semibold",
                        isActive && textClass
                      )}
                    >
                      {label}
                    </h5>

                    <h6
                      className={cn(
                        "text-[11px] leading-none transition-colors duration-300"
                      )}
                    >
                      {isActive ? (
                        <>
                          <span className="font-semibold">You</span> & {count}{" "}
                          others
                        </>
                      ) : (
                        count
                      )}
                    </h6>
                  </div>
                </button>
              );
            }
          )}
        </div>

        <div className=" flex items-center  gap-3">
          <div className="flex -space-x-3">
            {VOTE_CONFIG.map((item) => {
              return (
                <div
                  key={item.key}
                  className={cn(
                    "border-2 bg-background z-10 shrink-0 size-8 flex justify-center items-center border-[#ece3e39d] dark:border-[#97a9b64b] hover:scale-110 cursor-pointer p-1 rounded-full transition-all"
                  )}
                >
                  <SvgColor
                    src={item.activeImgSrc}
                    className={cn("size-[19px]!", item.bgColor)}
                  />
                </div>
              );
            })}
          </div>

          <div className=" flex flex-col items-start">
            <h5 className={cn("font-semibold leading-none text-xs")}>
              {totalReactions}
            </h5>

            <h6 className={cn("text-[11px] leading-none ")}>All Reactions</h6>
          </div>
        </div>
      </div>
    );
  }
);
