/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { CommunitySolutionsCard } from "./CommunitySolutionsCard";

export const MyCommunitySolution = React.memo(
  ({ myCommunitySolutionData, onViewAllComments }: any) => {
    return (
      <div>
        <CommunitySolutionsCard
          mySolution={true}
          data={myCommunitySolutionData}
          onViewAllComments={() => onViewAllComments?.(myCommunitySolutionData)}
        />
      </div>
    );
  }
);
