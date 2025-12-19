"use client";

import Link from "next/link";
import { ChallengesTypes } from "@/types/challenges-types";
import { TagChip } from "@/components/ui/tag-chip ";
import { Navigation } from "@/constants/navigation";
import { StatusChip } from "@/components/ui/status-chip";
import { DifficultyChip } from "@/components/ui/difficulty-chip";

export const ChallengeCardView = ({
  id,
  tags,
  title,
  summary,
  difficulty,
  userProgress,
}: ChallengesTypes) => {
  return (
    <Link href={Navigation.ChallengesDetail(String(id))}>
      <div className="challenges-card-class hover:bg-gray-50 dark:hover:bg-gray-700/15 hover:scale-[1.02] hover:shadow-xs  transition-all duration-300 h-40 w-full overflow-hidden gap-2 flex flex-col justify-between">
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

        <div className="flex  gap-2 items-center   justify-between overflow-hidden ">
          <div className=" flex gap-2 pe-2 flex-nowrap overflow-x-auto! hide-scrollbar  ">
            {tags?.map((tag) => (
              <TagChip variant="blue" key={tag} className=" text-nowrap">
                {tag}
              </TagChip>
            ))}
          </div>

          {userProgress && (
            <StatusChip className="truncate" status={userProgress} />
          )}
        </div>
      </div>
    </Link>
  );
};
