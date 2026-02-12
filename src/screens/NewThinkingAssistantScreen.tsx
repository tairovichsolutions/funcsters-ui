/* eslint-disable @next/next/no-img-element */
"use client";
import GPTLikeInput from "./inputdara";
import { useTheme } from "next-themes";
import { Assets } from "@/constants/assets";

const suggestions: string[] = [
  "Help me understand the logic behind this problem",
  "What should I consider before coding?",
  "Can you guide my reasoning step-by-step?",
  "How should I approach this without brute force?",
];

export const NewThinkingAssistantScreen = () => {
  const handleSend = () => {
    console.log("data");
  };

  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <div className=" h-full flex justify-center items-center flex-col w-full px-3 my-14 ">
      <div className=" flex justify-center gap-3 items-center flex-col w-full  text-center">
        <img
          src={Assets.Svgs.IntelligenceLogo}
          alt="IntelligenceLogo_images"
          className="size-24"
        />

        <h3 className=" font-semibold text-[22px] max-w-[400px] leading-7">
          AI that strengthens how you think Not what you copy
        </h3>

        <p className=" text-sm">
          You’re working on “Two Sum” Let’s think it through
        </p>
      </div>

      <div className=" mt-10 w-full">
        <GPTLikeInput onSend={handleSend} />
      </div>

      <div className=" w-full flex gap-3  mt-6 flex-col">
        {suggestions.map((text, index) => (
          <div
            key={index}
            className="border border-[#D9D9D9] dark:border-[#29333D] border-dashed w-fit
                     rounded-full px-4 py-2.5 text-sm
                     text-[#808080] flex items-center gap-3
                     cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
          >
            <span>{text}</span>
            <img
              src={
                isDark ? Assets.Svgs.arrowLeftSvgDark : Assets.Svgs.ArrowLeftSvg
              }
              alt="Arrow icon"
              className="size-3"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
