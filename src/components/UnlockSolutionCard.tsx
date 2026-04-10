/* eslint-disable @next/next/no-img-element */
"use client";

import { useTheme } from "next-themes";
import { Button, FocusText } from "./ui";
import { Assets } from "@/constants/assets";

interface UnlockSolutionCardType {
  language?: string;
  isOpen?: boolean;
  handleUnlockSolution?: () => void;
}

export const UnlockSolutionCard = ({
  language = "Java",
  handleUnlockSolution,
  isOpen = false,
}: UnlockSolutionCardType) => {
  const { theme } = useTheme();
  const dark = theme === "dark";

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center h-full w-full bg-white/10 dark:bg-black/30 backdrop-blur-xs">
      <div className="relative flex flex-col items-center bg-white dark:bg-[#00010F] shadow-[0px_4px_30px_0px_#0000001A] p-5 rounded-xl w-[450px]">
        <img
          src={
            dark
              ? Assets.Images.UnlockSolutionDark
              : Assets.Images.UnlockSolution
          }
          alt="unlock_solution"
          className="h-40 w-auto object-contain"
        />

        <div className="flex flex-col justify-center items-center gap-4 text-center mt-5 px-5">
          <h2 className="font-semibold text-[27px] leading-none">
            Unlock Solution?
          </h2>

          <p className="text-sm">
            Struggling is part of the journey! Unlock
            <FocusText className="font-semibold"> {language} </FocusText>{" "}
            solutions to see how others think —
            <FocusText>
              {" "}
              but remember, you’ll lose your shot at earning XP for this one.
            </FocusText>
          </p>

          <Button onClick={handleUnlockSolution} className="w-full">
            Unlock Solution
          </Button>
        </div>
      </div>
    </div>
  );
};
