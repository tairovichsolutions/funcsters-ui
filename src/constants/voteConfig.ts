import { VoteType } from "@/types/vote-solution-type";
import { Assets } from "./assets";

export const VOTE_CONFIG: {
  key: VoteType;
  label: string;
  iconName: string;
  textClass: string;
  imgSrc: string;
  bgColor: string;
  activeImgSrc: string;
  activeIconClass: string;
  hoverWrapperClass: string;
}[] = [
  {
    key: "GENIUS",
    label: "Genius",
    imgSrc: Assets.Svgs.Genius,
    activeImgSrc: Assets.Svgs.GeniusActive,
    iconName: "hugeicons:ai-idea",

    bgColor: "bg-[#008CFF]!",
    textClass: " text-[#008CFF]",
    activeIconClass: " text-[#008CFF] border-[#7C3AED]/60 bg-[#f7f3ff]",
    hoverWrapperClass: "hover:text-[#008CFF] ",
  },
  {
    key: "SOLID",
    label: "Solid",
    bgColor: "bg-[#009E00]!",
    imgSrc: Assets.Svgs.Solid,
    activeImgSrc: Assets.Svgs.SolidActive,
    iconName: "mage:star-moving",
    textClass: " text-[#009E00]",
    activeIconClass: " text-[#008D0F] border-[#008D0F]/60 bg-[#edffee]",

    hoverWrapperClass: "hover:text-[#008D0F]",
  },
  {
    key: "MEH",
    label: "Meh",
    bgColor: "bg-[#D7263D]!",
    imgSrc: Assets.Svgs.Meh,
    activeImgSrc: Assets.Svgs.MehActive,
    iconName: "sidekickicons:face-meh",
    textClass: " text-[#D7263D]",
    activeIconClass: " text-[#D7263D] border-[#FF8C00]/60 bg-[#fffbec]",
    hoverWrapperClass: "hover:text-[#D7263D]",
  },
];
