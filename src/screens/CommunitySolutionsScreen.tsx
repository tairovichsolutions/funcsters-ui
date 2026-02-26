/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  AllCommunitySolution,
  MyCommunitySolution,
} from "@/containers/CommunitySolutions";
import {
  SortKey,
  useCommunitySolutions,
} from "@/queries/useCommunitySolutions";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { VOTE_OPTIONS } from "@/constants/selectOptions";
import { ScrollRestoration } from "next-scroll-restoration";
import { useChallengeById } from "@/queries/useChallengeById";
import { AlertBanner, TagSelector, UnlockSolutionCard } from "@/components";
import { useMyCommunitySolutions } from "@/queries/useMyCommunitySolutions";
import { useLanguageImplementations } from "@/context/languageImplementationsContext";
import { CommunitySolutionCardSkeleton } from "@/skeletons/CommunitySolutionCardSkeleton";

type UserProgress = "TODO" | "IN_PROGRESS" | "COMPLETED";

type LanguageImplementation = {
  languageId: number;
  starterCode: string;
  languageName: string;
  viewedSolution: boolean;
  userProgress: UserProgress;
};

export const CommunitySolutionsScreen = React.memo(() => {
  const [unlockedByLang, setUnlockedByLang] = useState<Record<number, boolean>>(
    {},
  );
  const [openUnlockModal, setOpenUnlockModal] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<SortKey>("top_rated");

  const { id } = useParams<{ id: string }>();

  const {
    languageId,
    setXpCount,
    challengeId,
    selectedLanguage,
    markViewedSolution,
  } = useLanguageImplementations();

  const { data: challengeData, isLoading: challengeLoading } =
    useChallengeById(id);

  const languageImplementations: LanguageImplementation[] =
    challengeData?.data?.languageImplementations ?? [];

  const currentLangImpl =
    languageImplementations.find((lang) => lang.languageId === languageId) ??
    null;

  const hasViewedSolution = !!currentLangImpl?.viewedSolution;
  const isCompleted = currentLangImpl?.userProgress === "COMPLETED";
  const isUnlockedThisSession =
    languageId != null ? unlockedByLang[languageId] === true : false;

  const canViewSolutions =
    !!languageId && (hasViewedSolution || isCompleted || isUnlockedThisSession);

  const { data: allSolutionData, isLoading: allSolutionLoading } =
    useCommunitySolutions(
      challengeId as number,
      languageId as number,
      canViewSolutions,
      selectedFilter,
    );

  const { data: mySolutionData, isLoading: mySolutionLoading } =
    useMyCommunitySolutions(
      challengeId as number,
      languageId as number,
      canViewSolutions,
    );

  const handleUnlockSolution = () => {
    if (!languageId) return;

    setUnlockedByLang((prev) => ({
      ...prev,
      [languageId]: true,
    }));

    markViewedSolution?.(languageId);

    setOpenUnlockModal(false);
    setXpCount(0);
  };

  useEffect(() => {
    if (challengeLoading || !languageId) {
      setOpenUnlockModal(false);
      return;
    }

    if (!currentLangImpl) {
      setOpenUnlockModal(false);
      return;
    }

    if (canViewSolutions) {
      setOpenUnlockModal(false);
      return;
    }

    setOpenUnlockModal(true);
  }, [challengeLoading, languageId, currentLangImpl, canViewSolutions]);

  const selectedLabel =
    VOTE_OPTIONS.find((x) => x.id === selectedFilter)?.label ?? "Most Votes";

  return (
    <div
      className="space-y-4 w-full h-full "
      data-scroll-restoration-id="container"
    >
      <ScrollRestoration />
      {openUnlockModal && (
        <UnlockSolutionCard
          isOpen={openUnlockModal}
          language={selectedLanguage}
          handleUnlockSolution={handleUnlockSolution}
        />
      )}

      {mySolutionLoading ? (
        <CommunitySolutionCardSkeleton />
      ) : canViewSolutions && mySolutionData?.data?.solutionInfo ? (
        <MyCommunitySolution myCommunitySolutionData={mySolutionData.data} />
      ) : (
        <AlertBanner />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#005092] ">
          Community Solution
        </h3>

        <TagSelector
          multiple={false}
          tags={VOTE_OPTIONS}
          label={selectedLabel}
          className={"text-xs! bg-[#0000000D]! border-none! shadow-none!"}
          value={[selectedFilter]}
          onChange={(selected) => {
            const next = (selected?.[0] as SortKey) ?? "top_rated";
            setSelectedFilter(next);
          }}
        />
      </div>

      {allSolutionLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CommunitySolutionCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <AllCommunitySolution
          allSolutionData={allSolutionData?.data?.community}
        />
      )}
    </div>
  );
});
