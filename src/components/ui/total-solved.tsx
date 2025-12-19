import React from "react";
import { UsersRound } from "lucide-react";

interface TotalSolvedType {
  solved: number;
  className?: string;
}

export const TotalSolved = React.memo(({ solved }: TotalSolvedType) => {
  return (
    <div className="bg-[#008CFF1A] shrink-0  border border-primary text-primary  w-fit rounded-[5.64px]   px-3 py-1 gap-1.5 flex  items-center">
      <UsersRound size={13} />
      <h6 className="text-xs font-Medium text-nowrap">{solved} Solved</h6>
    </div>
  );
});
