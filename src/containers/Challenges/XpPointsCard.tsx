/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Assets } from "@/constants/assets";
import { MatricCard } from "@/components/ui/matric-card";
import { StatsScorePoints } from "@/components/ui/stats-score-points";
import { useTheme } from "next-themes";

export const XpPointsCard = React.memo(({ xpData }: { xpData: number }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <MatricCard
      imgSrc={
        isDark ? Assets.Svgs.XpPointsDarkImage : Assets.Svgs.XpPointsImage
      }
      className="bg-xp-points-card"
    >
      <StatsScorePoints value={xpData} label="XP Points" />

      <img
        src={
          isDark ? Assets.Images.XpStarDarkImage : Assets.Images.XpStarsImage
        }
        alt="xp_stars_image"
        className="h-auto shrink-0 absolute right-3 inset-y-1/2 -translate-y-1/2  object-contain"
      />
    </MatricCard>
  );
});
