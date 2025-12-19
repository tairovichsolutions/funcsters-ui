"use client";

import { cn } from "@/lib";
import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SvgColor } from "@/components";
import { Assets } from "@/constants/assets";
import { Tooltip } from "@/components/ui/tooltip";
import { Navigation } from "@/constants/navigation";
import { useRouter, useParams } from "next/navigation";
import { ProblemListpopover } from "./ProblemListpopover";
import { useAllChallenges } from "@/queries/useAllChallenges";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useChallengesFilters } from "@/hooks/useChallengesFilters";
import { useTagOptions } from "@/hooks/useTagOptions";

export const ProblemListButton: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const currentChallengeId = Number(id);
  const { tagOptions, tagLabelMap } = useTagOptions();

  const {
    remove,
    setTags,
    filters,
    clearAll,
    setSearch,
    setStatus,
    queryParams,
    setDifficulty,
  } = useChallengesFilters();

  const {
    data: challengeRes,
    isLoading,
    isFetching,
  } = useAllChallenges(queryParams);

  const challengeData = React.useMemo(() => {
    if (!Array.isArray(challengeRes)) return [];
    return challengeRes;
  }, [challengeRes]);

  const isLoadingList = isLoading || isFetching;

  const { prevChallenge, nextChallenge } = React.useMemo(() => {
    const index = challengeData?.findIndex(
      (item: { id: number }) => item?.id === currentChallengeId
    );

    const prev = index > 0 ? challengeData[index - 1] : null;

    const next =
      index >= 0 && index < challengeData?.length - 1
        ? challengeData[index + 1]
        : null;

    return { prevChallenge: prev, nextChallenge: next };
  }, [challengeData, currentChallengeId]);

  const handleNavigate = (challengeId: number | null) => {
    if (challengeId == null) return;
    router.push(Navigation.ChallengesDetail(String(challengeId)));
  };

  return (
    <div
      className={cn(
        "flex gap-2 items-center text-[#005092] dark:text-white border border-[#00509299] dark:border-[#FFFFFF99] bg-[#0050921A] dark:bg-[#FFFFFF1A] rounded-md text-sm py-1.5 px-3.5",
        isLoading && "select-none! z-0 cursor-not-allowed!"
      )}
    >
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 font-medium cursor-pointer">
            {isLoading ? (
              <Loader size={15} className="animate-spin" />
            ) : (
              <SvgColor
                className="bg-[#005092]! dark:bg-white!"
                src={Assets.Svgs.SearchListIcon}
              />
            )}
            <span className="lg:flex hidden text-nowrap">Problem List</span>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[440px] overflow-hidden mt-5 ml-20 p-0 rounded-xl">
          <ProblemListpopover
            remove={remove}
            filters={filters}
            setTags={setTags}
            clearAll={clearAll}
            data={challengeData}
            setSearch={setSearch}
            setStatus={setStatus}
            tagOptions={tagOptions}
            tagLabelMap={tagLabelMap}
            isLoading={isLoadingList}
            setDifficulty={setDifficulty}
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center">
        <Tooltip content="Previous">
          <button
            disabled={!prevChallenge}
            onClick={() => handleNavigate(prevChallenge?.id ?? null)}
            className={cn(
              "rounded-sm cursor-pointer flex justify-center hover:bg-[#0050921A]/90 items-center disabled:opacity-50 disabled:cursor-not-allowed",
              isLoading && "select-none! opacity-80 cursor-not-allowed!"
            )}
          >
            <ChevronLeft size={20} />
          </button>
        </Tooltip>

        <Tooltip content="Next">
          <button
            onClick={() => handleNavigate(nextChallenge?.id ?? null)}
            disabled={!nextChallenge}
            className={cn(
              "rounded-sm cursor-pointer flex justify-center hover:bg-[#0050921A]/90 items-center disabled:opacity-50 disabled:cursor-not-allowed",
              isLoading && "select-none! opacity-80 cursor-not-allowed!"
            )}
          >
            <ChevronRight size={20} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
