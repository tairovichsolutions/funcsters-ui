"use client";

import Image from "next/image";
import React, { Key } from "react";
import { Assets } from "@/constants/assets";
import { CommunitySolutionType } from "@/types";
import { CommunitySolutionsCard } from "./CommunitySolutionsCard";

export const AllCommunitySolution = React.memo(
  ({
    allSolutionData,
    onViewAllComments,
  }: {
    allSolutionData: CommunitySolutionType[];
    onViewAllComments?: (v: CommunitySolutionType) => void;
  }) => {
    return (
      <div className="space-y-5 mt-5 pb-5">
        {allSolutionData?.length > 0 ? (
          allSolutionData?.map((item: CommunitySolutionType, i: Key) => (
            <CommunitySolutionsCard
              data={item}
              key={item?.solutionInfo?.solutionId ?? i}
              onViewAllComments={() => onViewAllComments?.(item)}
            />
          ))
        ) : (
          <div className="flex flex-col mb-5 justify-center items-center">
            <Image
              src={Assets.Images.EmtyData}
              height={400}
              width={300}
              alt="emty_data"
            />
            <p className="font-semibold mt-3 text-gray-400">
              No Community Solutions Available
            </p>
          </div>
        )}
      </div>
    );
  },
);
