"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const ProblemIntuition = () => {
  const [openIntuition, setOpenIntuition] = useState(true);
  return (
    <Collapsible
      className=" border border-[#0050921A] p-2 rounded-xl"
      open={openIntuition}
      onOpenChange={setOpenIntuition}
    >
      <CollapsibleTrigger className="text-sm flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer w-full justify-between  rounded-md! font-semibold  p-2 gap-1">
        Problem Intuition
        <ChevronDown
          className={`size-4 transition-transform ${
            openIntuition ? "rotate-180" : "rotate-0"
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="text-sm space-y-1 mt-2 bg-[#0050920D] dark:text-gray-400! p-2 rounded-md leading-relaxed text-[#000911]! pt-2">
        <p className="text-sm">
          You are standing on tile a, and your friend is standing on tile b. You
          are allowed to roll a six-sided die, which means you can only move
          forward between 1 and 6 tiles
        </p>
        <h6 className="text-sm">The question is simple:</h6>
        <h6 className="text-sm">
          Can you land on your friends tile in just one move?
        </h6>
        <h6 className="text-sm">
          To earn the bonus, the following must be true:
        </h6>
        <ul className="list-disc pl-5 mt-1 space-y-0.5 text-sm">
          <li>
            Your tile number must be less than your friend’s (you can’t move
            backward).
          </li>
          <li>
            The distance between your tile and your friend’s tile must be
            between <b>1</b> and <b>6</b>.
          </li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};
