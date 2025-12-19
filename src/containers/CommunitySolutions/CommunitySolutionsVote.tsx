"use client";

import { cn } from "@/lib";
import { useState } from "react";
import toast from "react-hot-toast";
import { Iconify } from "@/components";
import { useVoteCommunitySolution } from "@/mutations/useVoteCommunitySolution";

type VoteType =
  | "BEST_PRACTICES"
  | "EFFICIENT"
  | "CLEVER"
  | "CLEAN"
  | "SHORTEST";

type VoteData = {
  clean?: number;
  clever?: number;
  shortest?: number;
  efficient?: number;
  bestPractices?: number;
  currentUserVote?: string | null;
};

type CommunitySolutionsVoteProps = {
  voteData?: VoteData;
  languageId: number | string;
  solutionId: number | string;
  challengeId: number | string;
};

const VOTE_CONFIG: {
  key: VoteType;
  field: keyof VoteData;
  label: string;
  background?: string;
  iconName: string;
  circleClass: string;
  activeWrapperClass: string;
  hoverWrapperClass: string;
}[] = [
  {
    key: "BEST_PRACTICES",
    field: "bestPractices",
    label: "Best Practices",
    iconName: "icon-park-outline:like",
    circleClass: "border-[#7C3AED] text-[#7C3AED] bg-[#7C3AED1A]",
    activeWrapperClass: "border-[#7C3AED] text-[#7C3AED] bg-[#7C3AED1A]",
    hoverWrapperClass:
      "hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED1A]",
  },
  {
    key: "EFFICIENT",
    field: "efficient",
    label: "Efficient",
    iconName: "iconoir:star",
    circleClass: "border-[#008D0F] text-[#008D0F]",
    activeWrapperClass: "border-[#008D0F] text-[#008D0F] bg-[#008D0F1A]",
    hoverWrapperClass:
      "hover:border-[#008D0F] hover:text-[#008D0F] hover:bg-[#008D0F1A]",
  },
  {
    key: "CLEVER",
    field: "clever",
    label: "Clever",
    iconName: "hugeicons:zap",
    circleClass: "border-[#FF8C00] text-[#FF8C00]",
    activeWrapperClass: "border-[#FF8C00] text-[#FF8C00] bg-[#FF8C001A]",
    hoverWrapperClass:
      "hover:border-[#FF8C00] hover:text-[#FF8C00] hover:bg-[#FF8C001A]",
  },
  {
    key: "CLEAN",
    field: "clean",
    label: "Clean",
    iconName: "nimbus:fire",
    circleClass: "border-[#377CF6] text-[#377CF6]",
    activeWrapperClass: "border-[#377CF6] text-[#377CF6] bg-[#377CF61A]",
    hoverWrapperClass:
      "hover:border-[#377CF6] hover:text-[#377CF6] hover:bg-[#377CF61A]",
  },
  {
    key: "SHORTEST",
    field: "shortest",
    label: "Shortest",
    iconName: "hugeicons:ai-idea",
    circleClass: "border-[#EE3939] text-[#EE3939]",
    activeWrapperClass: "border-[#EE3939] text-[#EE3939] bg-[#EE39391A]",
    hoverWrapperClass:
      "hover:border-[#EE3939] hover:text-[#EE3939] hover:bg-[#EE39391A]",
  },
];

const toVoteType = (value: string | null): VoteType | null => {
  if (
    value === "BEST_PRACTICES" ||
    value === "EFFICIENT" ||
    value === "CLEVER" ||
    value === "CLEAN" ||
    value === "SHORTEST"
  ) {
    return value;
  }
  return null;
};

export const CommunitySolutionsVote = ({
  languageId,
  challengeId,
  solutionId,
  voteData,
}: CommunitySolutionsVoteProps) => {
  const { mutateAsync: voteSolutionfc, isPending } = useVoteCommunitySolution();
  const [activeVote, setActiveVote] = useState<VoteType | null>(
    toVoteType(voteData?.currentUserVote ?? null)
  );

  const handleVoteClick = async (vote: VoteType) => {
    const prevVote = activeVote;

    const nextVote: VoteType = vote;
    setActiveVote(nextVote);

    try {
      const { data } = await voteSolutionfc({
        languageId,
        challengeId,
        solutionId,
        vote,
      });

      if (!data?.data?.success) {
        toast.error(data?.data?.message ?? "Vote failed");
      }
    } catch (error) {
      setActiveVote(prevVote);
    }
  };

  return (
    <>
      {VOTE_CONFIG.map(
        ({
          key,
          field,
          iconName,
          circleClass,
          label,
          activeWrapperClass,
          hoverWrapperClass,
        }) => {
          const isActive = voteData?.currentUserVote === key;
          const count = voteData?.[field] ?? 0;

          return (
            <button
              key={key}
              onClick={() => handleVoteClick(key)}
              disabled={isPending}
              className={cn(
                "group flex items-center gap-2 rounded-full pl-1 pr-2 py-1 text-[11px] font-medium cursor-pointer border border-transparent",
                "transition-all duration-500 ease-out",
                "hover:scale-[1.03] hover:-translate-y-px",
                hoverWrapperClass,
                isActive && activeWrapperClass
              )}
            >
              <span
                className={cn(
                  "flex size-[21px] shrink-0 items-center justify-center rounded-full border p-0.5",
                  "transition-all duration-500 ease-out",
                  "group-hover:scale-[1] group-hover:rotate-[5deg] ",
                  "group-active:scale-[0.92]",
                  circleClass
                )}
              >
                <Iconify
                  className="size-[13px] transition-transform duration-500 group-hover:scale-[1.10]"
                  iconName={iconName}
                />
              </span>

              <span className="transition-all duration-500 transform  group-hover:scale-[1.05]">
                {count}
              </span>

              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap",
                  "max-w-0 opacity-0 translate-x-1",
                  "transition-all duration-500 ease-out",
                  "group-hover:max-w-20 group-hover:opacity-1000 group-hover:translate-x-0",
                  isActive &&
                    "max-w-20 opacity-1000 translate-x-0 font-semibold"
                )}
              >
                {label}
              </span>
            </button>
          );
        }
      )}
    </>
  );
};
