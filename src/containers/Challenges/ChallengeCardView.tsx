"use client";

import TagScroller from "./TagScroller";
import { useRouter } from "next/navigation";
import { Navigation } from "@/constants/navigation";
import { StatusChip } from "@/components/ui/status-chip";
import { ChallengesTypes } from "@/types/challenges-types";
import { DifficultyChip } from "@/components/ui/difficulty-chip";

export const ChallengeCardView = ({
  id,
  tags,
  title,
  summary,
  difficulty,
  userProgress,
}: ChallengesTypes) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-stop-nav]")) return;
    router.push(Navigation.ChallengesDetail(String(id)));
  };

  return (
    <div
      onClick={handleCardClick}
      className="challenges-card-class cursor-pointer! bg-white dark:bg-[#FFFFFF0D]! dark:hover:bg-gray-700/15 hover:scale-[1.02] hover:shadow-xs  transition-all duration-300 h-40 w-full  gap-2 flex flex-col justify-between"
    >
      <div className=" space-y-2">
        <div className=" flex gap-2  justify-between items-center">
          <h1 className=" font-semibold text-base lg:text-[19px] line-clamp-1">
            {title}
          </h1>
          <DifficultyChip level={difficulty} />
        </div>

        <p className="text-sm font-light line-clamp-2 text-content-primary ">
          {summary}
        </p>
      </div>

      <div className="flex gap-2 items-center justify-between">
        <div className="flex-1 min-w-0">
          <TagScroller tags={tags || []} />
        </div>

        {userProgress && (
          <StatusChip
            withText={false}
            className="shrink-0"
            status={userProgress}
          />
        )}
      </div>
    </div>
  );
};
