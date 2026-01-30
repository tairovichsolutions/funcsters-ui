/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { UserProgressTypes } from "@/types";
import { Tooltip } from "@/components/ui/tooltip";
import { TagChip, XPPoints } from "@/components/ui/";
import { StatusChip } from "@/components/ui/status-chip";
import { TotalSolved } from "@/components/ui/total-solved";
import { useChallengeById } from "@/queries/useChallengeById";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import { DifficultyChip } from "@/components/ui/difficulty-chip";
import { ChallengeDetailSkeleton } from "@/skeletons/ChallengeDetailSkeleton";
import { useLanguageImplementations } from "@/context/languageImplementationsContext";
import { MDMarkdown } from "@/components/MDMarkdown";

export const ChallengesDetailScreen = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useChallengeById(String(id));
  const { xpCount, languageId } = useLanguageImplementations();
  const { data: userData } = useGetUserProfile();
  const isAuthenticated = userData?.data?.authenticated || false;
  const challengesDetailData = data?.data;
  const axiosError =
    error && typeof error === "object" && "response" in error
      ? (error as { response?: { data?: { message?: string } } })
      : null;

  if (error) {
    return (
      <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center rounded-md bg-red-100 dark:bg-red-900/25">
        <div className="flex flex-col items-center gap-2 text-red-600">
          <AlertCircle className="h-7 w-7" />
          <div className="mt-2 space-y-1.5">
            <p className="text-center text-sm font-semibold">
              {axiosError?.response?.data?.message || "ERROR"}
            </p>
            <p className="text-center text-xs font-medium">
              Failed to load challenge Detail <br /> Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !challengesDetailData) {
    return <ChallengeDetailSkeleton />;
  }

  const currentLangImpl = challengesDetailData?.languageImplementations?.find(
    (lang: any) => lang?.languageId === languageId,
  );

  const completedLanguagesCount =
    challengesDetailData?.languageImplementations?.filter(
      (lang: any) => lang?.userProgress === "COMPLETED",
    )?.length || 0;

  const xpTooltipMessage =
    currentLangImpl?.viewedSolution === true
      ? "You opened the solution, so you earn 0 XP for this attempt."
      : completedLanguagesCount >= 1
        ? `You already solved this challenge in ${completedLanguagesCount} language, so you earn ${xpCount} XP.`
        : `Complete this challenge to earn ${xpCount} XP.`;
  return (
    <div>
      <div className="flex w-full flex-wrap items-center justify-between gap-6">
        <h1 className="line-clamp-1 text-[23px] font-extrabold  2xl:text-[26px]">
          {challengesDetailData?.title}
        </h1>

        <div className="flex w-fit flex-wrap items-center gap-2.5">
          <DifficultyChip level={challengesDetailData?.difficulty} />
          {isAuthenticated ? (
            currentLangImpl?.userProgress !== "COMPLETED" ? (
              <Tooltip
                content={xpTooltipMessage}
                place="top"
                className="bg-[#FF9E2B]! dark:bg-[#FF9E2B]! text-[#ffffff]! text-xs! font-semibold"
              >
                <XPPoints variant="xs">+{xpCount} XP</XPPoints>
              </Tooltip>
            ) : null
          ) : (
            <XPPoints variant="xs">+{challengesDetailData?.xp} XP</XPPoints>
          )}

          <TotalSolved solved={challengesDetailData?.solvedCount} />

          {currentLangImpl?.userProgress && (
            <StatusChip
              status={currentLangImpl?.userProgress as UserProgressTypes}
            />
          )}
        </div>
      </div>

      <div className="mt-5 space-y-7 pb-5 ">
        <MDMarkdown source={challengesDetailData?.instructions} />
        <div className="flex gap-2">
          {challengesDetailData?.tags?.map((tag: string, i: number) => (
            <TagChip variant="blue" size="sm" key={i}>
              {tag}
            </TagChip>
          ))}
        </div>
      </div>
    </div>
  );
};
