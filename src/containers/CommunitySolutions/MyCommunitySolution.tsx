/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { CommunitySolutionsCard } from "./CommunitySolutionsCard";
import { useRerenderCount } from "@/hooks/useRerenderCount";

export const MyCommunitySolution = React.memo(
  ({ myCommunitySolutionData }: any) => {
    useRerenderCount("myCommunitySolutionData");
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
