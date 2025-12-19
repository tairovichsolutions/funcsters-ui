/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  AllCommunitySolution,
  MyCommunitySolution,
} from "@/containers/CommunitySolutions";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AlertBanner, UnlockSolutionCard } from "@/components";
import { useCommunitySolutions } from "@/queries/useCommunitySolutions";
import { useMyCommunitySolutions } from "@/queries/useMyCommunitySolutions";
import { useLanguageImplementations } from "@/context/languageImplementationsContext";
import { CommunitySolutionCardSkeleton } from "@/skeletons/CommunitySolutionCardSkeleton";
import { useChallengeById } from "@/queries/useChallengeById";

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
    {}
  );
  const [openUnlockModal, setOpenUnlockModal] = useState(false);

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
    useCommunitySolutions(challengeId, languageId as number, canViewSolutions);

  const { data: mySolutionData, isLoading: mySolutionLoading } =
    useMyCommunitySolutions(
      challengeId,
      languageId as number,
      canViewSolutions
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

  return (
    <div className="space-y-6 w-full h-full">
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

      {allSolutionLoading && canViewSolutions ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CommunitySolutionCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <AllCommunitySolution
          allSolutionData={
            canViewSolutions ? allSolutionData?.data?.community : []
          }
        />
      )}
    </div>
  );
});
