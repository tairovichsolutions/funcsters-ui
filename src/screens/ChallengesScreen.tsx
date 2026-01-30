"use client";

import * as React from "react";
import type { ChallengesTypes } from "@/types";
import { useSearchParams } from "next/navigation";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import { GreetingArea } from "@/containers/Challenges/GreetingArea";
import { useChallengesFilters } from "@/hooks/useChallengesFilters";
import { ChallengesFiltersBar } from "@/containers/Challenges/ChallengesFiltersBar";
import { ChallengesListSection } from "@/containers/Challenges/ChallengesListSection";
import { MatricsAndActivityChart } from "@/containers/Challenges/MatricsAndActivityChart";
import { useInfiniteChallenges } from "@/queries/useAllChallenges";

export const ChallengesScreen: React.FC = () => {
  const searchParams = useSearchParams();

  const {
    remove,
    filters,
    setTags,
    clearAll,
    setSearch,
    setStatus,
    queryParams,
    setDifficulty,
  } = useChallengesFilters();

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChallenges(queryParams);

  const { data: userData, isLoading: profileLoading } = useGetUserProfile();
  const isAuthenticated = Boolean(userData?.data?.authenticated);

  const currentView = React.useMemo(() => {
    return searchParams.get("view") === "list" ? "list" : "card";
  }, [searchParams]);

  const allChallenges = React.useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.challenges) as ChallengesTypes[];
  }, [data]);

  return (
    <div className="py-4 flex flex-col gap-5">
      <GreetingArea
        isAuthenticated={isAuthenticated}
        username={userData?.data?.user?.username}
        profileLoading={profileLoading}
      />

      <MatricsAndActivityChart
        isAuthenticated={isAuthenticated}
        profileLoading={profileLoading}
      />

      <div className=" flex flex-col gap-5 mt-3">
        <ChallengesFiltersBar
          isFetching={isFetching}
          isAuthenticated={isAuthenticated}
          currentView={currentView}
          filters={filters}
          setSearch={setSearch}
          setDifficulty={setDifficulty}
          setStatus={setStatus}
          setTags={setTags}
          remove={remove}
          clearAll={clearAll}
        />

        <ChallengesListSection
          isLoading={isLoading}
          currentView={currentView}
          allChallenges={allChallenges}
          fetchNextPage={fetchNextPage}
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
};

export default ChallengesScreen;
