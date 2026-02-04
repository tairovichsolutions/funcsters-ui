"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@/lib";
import { SvgColor } from "@/components";
import { VOTE_CONFIG } from "@/constants/voteConfig";
import { VoteDataTypes, VoteType } from "@/types/vote-solution-type";
import { useVoteCommunitySolution } from "@/mutations/useVoteCommunitySolution";

type CommunitySolutionsVoteProps = {
  mySolution?: boolean;
  voteData?: VoteDataTypes;
  languageId: number | string;
  solutionId: number | string;
  challengeId: number | string;
};

type VoteCounts = Record<VoteType, number>;

const toVoteType = (value: unknown): VoteType | null =>
  value === "GENIUS" || value === "SOLID" || value === "MEH" ? value : null;

const buildCountsFromVoteData = (voteData?: VoteDataTypes): VoteCounts => ({
  GENIUS: voteData?.genius ?? 0,
  SOLID: voteData?.solid ?? 0,
  MEH: voteData?.meh ?? 0,
});

export const CommunitySolutionsVote = React.memo(function CommunitySolutionsVote({
  languageId,
  challengeId,
  mySolution,
  solutionId,
  voteData,
}: CommunitySolutionsVoteProps) {
  const { mutateAsync: voteSolution, isPending } = useVoteCommunitySolution();

  const [activeVote, setActiveVote] = useState<VoteType | null>(
    toVoteType(voteData?.currentUserVote ?? null),
  );

  const [voteCounts, setVoteCounts] = useState<VoteCounts>(() =>
    buildCountsFromVoteData(voteData),
  );

  useEffect(() => {
    setActiveVote(toVoteType(voteData?.currentUserVote ?? null));
    setVoteCounts(buildCountsFromVoteData(voteData));
  }, [voteData]);

  const totalReactions = useMemo(
    () => voteCounts.GENIUS + voteCounts.SOLID + voteCounts.MEH,
    [voteCounts],
  );

  const handleVoteClick = async (vote: VoteType) => {
    if (isPending || mySolution) return;

    const prevVote = activeVote;
    const prevCounts = { ...voteCounts };

    const removeSame = prevVote === vote;
    const nextVote = removeSame ? null : vote;

    setActiveVote(nextVote);
    setVoteCounts((prev) => {
      const updated = { ...prev };

      if (removeSame) {
        updated[vote] = Math.max(0, updated[vote] - 1);
      } else {
        if (prevVote) updated[prevVote] = Math.max(0, updated[prevVote] - 1);
        updated[vote] = (updated[vote] ?? 0) + 1;
      }

      return updated;
    });

    try {
      const { data } = await voteSolution({
        languageId,
        challengeId,
        solutionId,
        vote,
      });

      if (!data?.data?.success) throw new Error(data?.data?.message);
    } catch (err) {
      console.error(err);
      setActiveVote(prevVote);
      setVoteCounts(prevCounts);
      toast.error("Vote failed");
    }
  };

  return (
    <div className="flex justify-between w-full items-center my-1.5">
      <div className="flex items-center gap-5">
        {VOTE_CONFIG.map(
          ({ key, textClass, label, imgSrc, activeImgSrc, bgColor }) => {
            const isActive = activeVote === key;
            const count = voteCounts[key] ?? 0;

            const othersCount = Math.max(0, count - 1);

            return (
              <button
                key={key}
                type="button"
                disabled={isPending || mySolution}
                onClick={() => handleVoteClick(key)}
                className={cn(
                  "group flex items-center gap-1.5 rounded-md cursor-pointer",
                  "border border-transparent",
                  "transition-transform duration-300 ease-out",
                  "hover:scale-[1.02]",
                )}
                aria-pressed={isActive}
              >
                <SvgColor
                  src={isActive ? activeImgSrc : imgSrc}
                  className={cn("size-[23px]", isActive && bgColor)}
                />

                <div className="flex flex-col items-start space-y-0.5">
                  <h5 className={cn("text-xs font-semibold", isActive && textClass)}>
                    {label}
                  </h5>

                  <h6 className="text-[11px] leading-none transition-colors duration-300">
                    {isActive ? (
                      <>
                        <span className="font-semibold">You</span>
                        {othersCount > 0 ? (
                          <>
                            {" "}
                            & {othersCount} other{othersCount === 1 ? "" : "s"}
                          </>
                        ) : null}
                      </>
                    ) : (
                      count
                    )}
                  </h6>
                </div>
              </button>
            );
          },
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {VOTE_CONFIG.map((item) => (
            <div
              key={item.key}
              className={cn(
                "border-2 bg-background z-10 shrink-0 size-8 flex justify-center items-center",
                "border-[#ece3e39d] dark:border-[#97a9b64b]",
                "hover:scale-110 cursor-pointer p-1 rounded-full transition-all",
              )}
            >
              <SvgColor
                src={item.activeImgSrc}
                className={cn("size-[19px]!", item.bgColor)}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start">
          <h5 className="font-semibold leading-none text-xs">{totalReactions}</h5>
          <h6 className="text-[11px] leading-none">All Reactions</h6>
        </div>
      </div>
    </div>
  );
});
