<<<<<<< HEAD
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
=======
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
>>>>>>> 2f476e413f9dbf36eb4f8bf7aa0938f8b7b2cd9f
