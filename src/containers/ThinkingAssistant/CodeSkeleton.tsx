"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ChevronDown } from "lucide-react";
import {
  a11yDark,
  a11yLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";

export const CodeSkeleton = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [openCode, setOpenCode] = useState(true);

  const code = `function can_earn_bonus(your_tile, friend_tile) {
  if (your_tile >= friend_tile) {
    return false 
  }
  const difference = friend_tile - your_tile
  if (difference >= 1 && difference <= 6) {
    return true
  } else {
    return false
  }
}`;

  return (
    <Collapsible
      className=" border border-[#0050921A] p-2 rounded-xl"
      open={openCode}
      onOpenChange={setOpenCode}
    >
      <CollapsibleTrigger className="text-sm flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer w-full justify-between  rounded-md! font-semibold  p-2 gap-1">
        Code Skeleton
        <ChevronDown
          className={`size-4 transition-transform ${
            openCode ? "rotate-180" : "rotate-0"
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="text-sm space-y-1 mt-2 bg-[#0050920D] p-2 rounded-md leading-relaxed text-[#000911]! pt-2">
        <SyntaxHighlighter
          style={isDarkMode ? a11yDark : a11yLight}
          customStyle={{
            background: "transparent",
            fontSize: "14px",
            color: isDarkMode ? "#FAFAFA" : "#3a3a3a",
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </CollapsibleContent>
    </Collapsible>
  );
};
