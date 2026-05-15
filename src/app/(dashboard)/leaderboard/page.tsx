"use client";

import { useLeaderboard } from "@/queries/useLeaderboard";
import { useState } from "react";
import type { LeaderboardPeriod } from "@/types/leaderboard-types";
import LeaderboardBanner from "./LeaderBoardBanner";
import Leaderboard from "./Leaderboard";

const LeaderboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>("weekly");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");

  // Convert "All Countries" to empty string for the API
  const countryParam = selectedCountry === "All Countries" ? "" : selectedCountry;
  const { data: leaderboardData, isLoading } = useLeaderboard(selectedPeriod, countryParam);

  return (
    <>
      <LeaderboardBanner
        currentUserRank={leaderboardData?.currentUserRank}
        isLoading={isLoading}
        selectedPeriod={selectedPeriod}
      />
      <Leaderboard
        leaderboard={leaderboardData?.leaderboard ?? []}
        currentUserRank={leaderboardData?.currentUserRank}
        isLoading={isLoading}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        availableCountries={leaderboardData?.availableCountries ?? []}
      />
    </>
  );
};

export default LeaderboardPage;