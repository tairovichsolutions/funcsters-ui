/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { CommunitySolutionsCard } from "./CommunitySolutionsCard";

export const MyCommunitySolution = React.memo(
  ({ myCommunitySolutionData }: any) => {
    return (
      <div>
        <CommunitySolutionsCard
          mySolution={true}
          data={myCommunitySolutionData}
        />
      </div>
    );
  }
);
