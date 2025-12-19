import { VoteDataTypes, VoteType } from "@/types/vote-solution-type";

export const VOTE_CONFIG: {
  key: VoteType;
  background?: string;
  iconName: string;
  circleClass: string;
  field: keyof VoteDataTypes;
}[] = [
  {
    key: "BEST_PRACTICES",
    field: "bestPractices",
    iconName: "icon-park-outline:like",
    circleClass: "border-[#7C3AED] text-[#7C3AED] bg-[#7C3AED1A]",
  },
  {
    key: "EFFICIENT",
    field: "efficient",
    iconName: "iconoir:star",
    circleClass: "border-[#008D0F] text-[#008D0F]",
    background: "bg-[#008D0F1A]",
  },
  {
    key: "CLEVER",
    field: "clever",
    iconName: "hugeicons:zap",
    circleClass: "border-[#FF8C00] text-[#FF8C00]",
    background: "bg-[#FF8C001A]",
  },
  {
    key: "CLEAN",
    field: "clean",
    iconName: "nimbus:fire",
    circleClass: "border-[#377CF6] text-[#377CF6]",
    background: "bg-[#377CF61A]",
  },
  {
    key: "SHORTEST",
    field: "shortest",
    iconName: "hugeicons:ai-idea",
    circleClass: "border-[#EE3939] text-[#EE3939]",
    background: "bg-[#EE39391A]",
  },
];
