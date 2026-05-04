"use client";

import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Timer } from "./Timer";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMetrics } from "@/queries/useMetrics";
import { Navigation } from "@/constants/navigation";
import { XPPoints } from "@/components/ui/xp-points";
import { ChevronLeft, Settings } from "lucide-react";
import { ProblemListButton } from "./ProblemListButton";
import { ThemeButton } from "@/components/ui/theme-button";
import { EditerSettingPopover } from "./EditerSettingPopover";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import { PairSessionWidget } from "@/features/pair/components/PairSessionWidget";

export const ChallengesWorkSpaceHeader = () => {
  const { id } = useParams();
  const challengeId = Number(id);
  const { data: metricsData } = useMetrics();
  const { data: userData } = useGetUserProfile();
  const isAuthenticated = userData?.data?.authenticated || false;

  return (
    <header className="dashboard-headers-class px-12 py-3.5 h-[60px] flex justify-between items-center">
      <div className=" flex items-center gap-5">
        <Link href={Navigation.Challenges}>
          <Button
            size={"sm"}
            variant={"ghost"}
            className=" pl-1! pr-2.5! gap-1 font-normal!"
            startIcon={<ChevronLeft size={50} className="size-5" />}
          >
            Back
          </Button>
        </Link>

        <ProblemListButton />
        {isAuthenticated && (
          <XPPoints>{metricsData?.xpPoints || 0} XP</XPPoints>
        )}
      </div>

      {/* Pair-programming session widget — renders null when there's no
          active session, otherwise shows avatars + timer + mic + leave. */}
      <div className="flex items-center">
        <PairSessionWidget />
      </div>

      <div className=" flex gap-3">
        <ThemeButton iconClass="size-4!" />

        <Timer
          className="ml-2"
          challengeId={Number.isNaN(challengeId) ? null : challengeId}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              size={"icon"}
              className="size-9"
              variant={"tertiary"}
              aria-label="Theme Icon"
            >
              <Settings />
            </Button>
          </PopoverTrigger>

          <PopoverContent className=" mr-10 mt-3">
            <EditerSettingPopover />
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
