"use client";

import TagScroller from "./TagScroller";
import { useRouter } from "next/navigation";
import { Navigation } from "@/constants/navigation";
import { StatusChip } from "@/components/ui/status-chip";
import { ChallengesTypes } from "@/types/challenges-types";
import { DifficultyChip } from "@/components/ui/difficulty-chip";

export const ChallengeCardView = ({
  id,
  slug,
  tags,
  title,
  summary,
  difficulty,
  userProgress,
}: ChallengesTypes) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-stop-nav]")) return;
    router.push(Navigation.ChallengesDetail(String(slug)));
  };

  return (
    <div
      onClick={handleCardClick}
      className="challenges-card-class cursor-pointer! px-4 py-5 bg-white dark:bg-[#FFFFFF0D]! dark:hover:bg-gray-700/15 hover:scale-[1.02] hover:shadow-xs  transition-all duration-300 h-40 w-full  gap-2 flex flex-col justify-between"
    >
      <div className=" space-y-2">
        <div className=" flex gap-1  justify-between items-center">
          <h1 className="text-[#0F172A] font-semibold text-xs lg:text-[13px] line-clamp-1">
            {title}
          </h1>
          <DifficultyChip className="text-[10px] px-4 py-[5px] mb-1" level={difficulty} />
        </div>

        <p className="text-[13px] 2xl:text-sm font-light line-clamp-2 text-[#797981] ">
          {summary}
        </p>
      </div>

      <div className="flex gap-2 items-center justify-between">
        <div className="flex-1 min-w-0">
          <TagScroller tags={tags || []} />
        </div>

        {userProgress && (
       <div className="mt-1">
           <StatusChip
            withText={false}
            className="shrink-0"
            status={userProgress}
          />
       </div>
        )}
      </div>
    </div>
  );
};
