/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components";
import { Assets } from "@/constants/assets";
import React, { Key, useState } from "react";
import { CommunitySolutionType } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CommunitySolutionsCard } from "./CommunitySolutionsCard";

export const AllCommunitySolution = React.memo(({ allSolutionData }: any) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true);

  return (
    <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#005092]">
          Community Solution
        </h3>

        <CollapsibleTrigger asChild>
          <Button
            endIcon={
              isCollapsibleOpen ? (
                <ChevronDown size={17} />
              ) : (
                <ChevronUp size={17} />
              )
            }
            variant={"ghost"}
            size={"sm"}
            className=" bg-[#0000000D] text-xs font-normal"
          >
            Most-voted
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="space-y-5 mt-5">
          {allSolutionData?.length > 0 ? (
            allSolutionData?.map(
              (item: CommunitySolutionType, i: Key | null | undefined) => {
                return <CommunitySolutionsCard data={item} key={i} />;
              }
            )
          ) : (
            <div className=" flex flex-col mb-5 justify-center items-center">
              <Image
                src={Assets.Images.EmtyData}
                height={400}
                width={300}
                alt="emty_data"
              />
              <p className=" font-semibold mt-3 text-gray-400">
                No Community Solutions Available
              </p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});
