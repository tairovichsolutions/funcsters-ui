/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  AllCommunitySolution,
  MyCommunitySolution,
} from "@/containers/CommunitySolutions";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AlertBanner, TagSelector, UnlockSolutionCard } from "@/components";
import {
  SortKey,
  useCommunitySolutions,
} from "@/queries/useCommunitySolutions";
import { useMyCommunitySolutions } from "@/queries/useMyCommunitySolutions";
import { useLanguageImplementations } from "@/context/languageImplementationsContext";
import { CommunitySolutionCardSkeleton } from "@/skeletons/CommunitySolutionCardSkeleton";
import { useChallengeById } from "@/queries/useChallengeById";
import { VOTE_OPTIONS } from "@/constants/selectOptions";

import { ScrollRestoration } from "next-scroll-restoration";

type UserProgress = "TODO" | "IN_PROGRESS" | "COMPLETED";

type LanguageImplementation = {
  languageId: number;
  viewedSolution: boolean;
  languageName: string;
  userProgress: UserProgress;
  starterCode: string;
};

export const CommunitySolutionsScreen = React.memo(() => {
  const [unlockedByLang, setUnlockedByLang] = useState<Record<number, boolean>>(
    {},
  );
  const [openUnlockModal, setOpenUnlockModal] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<SortKey>("top_rated");

  const { id } = useParams<{ id: string }>();
  const challengeId = id;

  const { languageId, selectedLanguage, setXpCount } =
    useLanguageImplementations();

  const { data: challengeData, isLoading: challengeLoading } =
    useChallengeById(challengeId);

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
      challengeId,
      languageId as number,
      canViewSolutions,
      selectedFilter,
    );

  const { data: mySolutionData, isLoading: mySolutionLoading } =
    useMyCommunitySolutions(
      challengeId,
      languageId as number,
      canViewSolutions,
    );

  const handleUnlockSolution = () => {
    if (!languageId) return;

    setUnlockedByLang((prev) => ({
      ...prev,
      [languageId]: true,
    }));

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
          language={selectedLanguage}
          isOpen={openUnlockModal}
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
          label={selectedLabel}
          tags={VOTE_OPTIONS}
          className={"text-xs! bg-[#0000000D]! border-none! shadow-none!"}
          multiple={false}
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
