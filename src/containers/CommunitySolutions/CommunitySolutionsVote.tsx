"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { MessageCircle } from "lucide-react";
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
  commentsCount?: number;
  onToggleComments?: () => void;
  isCommentsExpanded?: boolean;
};

type VoteCounts = Record<VoteType, number>;

const toVoteType = (value: unknown): VoteType | null =>
  value === "GENIUS" || value === "SOLID" || value === "MEH" ? value : null;

const buildCountsFromVoteData = (voteData?: VoteDataTypes): VoteCounts => ({
  GENIUS: voteData?.genius ?? 0,
  SOLID: voteData?.solid ?? 0,
  MEH: voteData?.meh ?? 0,
});

export const CommunitySolutionsVote = React.memo(
  function CommunitySolutionsVote({
    languageId,
    challengeId,
    mySolution,
    solutionId,
    voteData,
    commentsCount = 100,
    onToggleComments,
    isCommentsExpanded,
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
      <div className="flex justify-between w-full  items-center my-1.5">
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
                    "group flex items-center  gap-1.5 rounded-md",
                    "border  dark:border-[#FFFFFF1A] py-1.5 px-2.5",
                    !mySolution &&
                    "transition-transform duration-300 ease-out dark:bg-red-500! dark:border-[#FFFFFF1A]! dark:border hover:scale-[1.02]  cursor-pointer",
                  )}
                  aria-pressed={isActive}
                >
                  <SvgColor
                    src={isActive ? activeImgSrc : imgSrc}
                    className={cn("size-3", isActive && bgColor)}
                  />

                  <div className="flex  items-center justify-center pt-[1.5px]   gap-x-0.5 ">
                    <h5
                      className={cn(
                        "text-[11px]  font-semibold",
                        isActive && textClass,
                      )}
                    >
                      {label}
                    </h5>

                    <h6 className="text-[11px] text-[#AFAFAF] ml-0.5 leading-none transition-colors duration-300">
                      {isActive ? (
                        <>
                          <span className="font-semibold">You</span>
                          {othersCount > 0 ? (
                            <>
                              {" "}
                              & {othersCount} other
                              {othersCount === 1 ? "" : "s"}
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

          <>
            {/* <div className="w-[1px] h-6 bg-[#00509233] dark:bg-[#FFFFFF33] mx-1 md:mx-3" /> */}
     
          </>
        </div>
        <button
          type="button"
          onClick={onToggleComments}
          className={cn(
            "group flex items-center  rounded-md",
            "border  dark:border-[#FFFFFF1A] py-1.5 px-2.5 ",
            "transition-transform duration-300 ease-out  cursor-pointer"
          )}
        >
          <div className="flex items-center justify-center p-1 relative">
            {/* <MessageCircle
              className={cn(
                "size-[11px] transition-colors fill-current text-[#00010F] dark:text-gray-100",
                isCommentsExpanded && "opacity-80"
              )}
            />
            <div className="absolute flex gap-[2px] mb-0.5">
              <span className="w-0.2 h-0.2 rounded-full bg-white dark:bg-black"></span>
              <span className="w-0.2 h-0.2 rounded-full bg-white dark:bg-black"></span>
              <span className="w-0.2 h-0.2 rounded-full bg-white dark:bg-black"></span>
            </div> */}
         <svg xmlns="http://www.w3.org/2000/svg" className="dark:hidden" width="15" height="15" viewBox="0 0 12 12" fill="none">
  <path d="M5.97656 0C2.63918 0 0 2.38929 0 5.27344C0 6.50208 0.486164 7.69242 1.371 8.63552C1.54608 9.35745 1.33352 10.1224 0.806109 10.6498C0.585609 10.8703 0.74168 11.25 1.05469 11.25C2.0565 11.25 3.02213 10.8574 3.74002 10.1655C4.44998 10.4187 5.2012 10.5469 5.97656 10.5469C9.3232 10.5469 12 8.15058 12 5.27344C12 2.39468 9.32135 0 5.97656 0ZM5.97656 9.84844C5.20966 9.84844 4.4703 9.70416 3.77902 9.42886C3.71271 9.40245 3.63995 9.39685 3.57038 9.4128C3.50082 9.42874 3.43776 9.46548 3.38958 9.51813C2.96494 9.98217 2.41291 10.3057 1.8116 10.4545C2.14291 9.81959 2.22759 9.07116 2.02591 8.3621C2.01002 8.30618 1.9805 8.25509 1.93999 8.21339C1.14239 7.39184 0.698437 6.34774 0.698437 5.27344C0.698437 2.75337 3.06879 0.698437 5.97656 0.698437C8.91019 0.698437 11.3016 2.75337 11.3016 5.27344C11.3016 7.79351 8.91019 9.84844 5.97656 9.84844Z" fill="black"/>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" className="hidden dark:block" width="15" height="15" viewBox="0 0 15 15" fill="none">
  <path d="M7.375 2C3.81512 2 1 4.54858 1 7.625C1 8.93555 1.51858 10.2053 2.4624 11.2112C2.64915 11.9813 2.42243 12.7973 1.85985 13.3598C1.62465 13.595 1.79112 14 2.125 14C3.1936 14 4.2236 13.5813 4.98935 12.8432C5.74665 13.1132 6.54795 13.25 7.375 13.25C10.9447 13.25 13.8 10.694 13.8 7.625C13.8 4.55432 10.9428 2 7.375 2ZM7.375 12.505C6.55697 12.505 5.76833 12.3511 5.03095 12.0575C4.96023 12.0293 4.88261 12.0233 4.80841 12.0403C4.73421 12.0573 4.66694 12.0965 4.61555 12.1527C4.1626 12.6476 3.57378 12.9928 2.93237 13.1515C3.28577 12.4742 3.3761 11.6759 3.16098 10.9196C3.14402 10.8599 3.11253 10.8054 3.06933 10.761C2.21855 9.88462 1.745 8.77093 1.745 7.625C1.745 4.93692 4.27338 2.745 7.375 2.745C10.5042 2.745 13.055 4.93692 13.055 7.625C13.055 10.3131 10.5042 12.505 7.375 12.505Z" fill="white"/>
  <path d="M4.375 6.5C3.75468 6.5 3.25 7.00468 3.25 7.625C3.25 8.24532 3.75468 8.75 4.375 8.75C4.99532 8.75 5.5 8.24532 5.5 7.625C5.5 7.00468 4.99532 6.5 4.375 6.5ZM4.375 8C4.16822 8 4 7.83178 4 7.625C4 7.41822 4.16822 7.25 4.375 7.25C4.58178 7.25 4.75 7.41822 4.75 7.625C4.75 7.83178 4.58178 8 4.375 8ZM7.375 6.5C6.75468 6.5 6.25 7.00468 6.25 7.625C6.25 8.24532 6.75468 8.75 7.375 8.75C7.99533 8.75 8.5 8.24532 8.5 7.625C8.5 7.00468 7.99533 6.5 7.375 6.5ZM7.375 8C7.16823 8 7 7.83178 7 7.625C7 7.41822 7.16823 7.25 7.375 7.25C7.58178 7.25 7.75 7.41822 7.75 7.625C7.75 7.83178 7.58178 8 7.375 8ZM10.425 6.5C9.80468 6.5 9.3 7.00468 9.3 7.625C9.3 8.24532 9.80468 8.75 10.425 8.75C11.0453 8.75 11.55 8.24532 11.55 7.625C11.55 7.00468 11.0453 6.5 10.425 6.5ZM10.425 8C10.2182 8 10.05 7.83178 10.05 7.625C10.05 7.41822 10.2182 7.25 10.425 7.25C10.6318 7.25 10.8 7.41822 10.8 7.625C10.8 7.83178 10.6318 8 10.425 8Z" fill="white"/>
</svg>

          </div>

          <div className="flex  items-center  gap-x-0.5">
            <h5
              className={cn(
                "text-[11px] font-semibold text-neutral-01 dark:text-gray-100",
                isCommentsExpanded && "opacity-80"
              )}
            >
              Comments
            </h5>
            <h6 className="text-[11px] ml-0.5 leading-none transition-colors duration-300 text-[#00010F] dark:text-gray-100 opacity-60">
              {commentsCount}
            </h6>
          </div>
        </button>
        <div className=" hidden items-center gap-3">
          <div className="flex -space-x-3">
            {VOTE_CONFIG.map((item) => (
              <div
                key={item.key}
                className={cn(
                  "border-2 bg-background z-10 shrink-0 size-8 flex p-1  rounded-full justify-center items-center",
                  "border-[#ece3e39d] dark:border-[#97a9b64b]",

                  !mySolution &&
                  "hover:scale-110 cursor-pointer  transition-all",
                )}
              >
                <SvgColor
                  src={item.activeImgSrc}
                  className={cn("size-[19px]!", item.bgColor)}
                />
              </div>
            ))}
          </div>

          <div className=" hidden flex-col items-start">
            <h5 className="font-semibold leading-none text-xs">
              {totalReactions}
            </h5>
            <h6 className="text-[11px] leading-none">All Reactions</h6>
          </div>
        </div>
      </div>
    );
  },
);
