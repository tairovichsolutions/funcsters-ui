"use client";

import * as React from "react";
import Link from "next/link";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Navigation } from "@/constants/navigation";
import { DifficultyChip, StatusChip, TagChip } from "@/components";
import type { ChallengesTypes, TagChipVariantType } from "@/types";

type ChallengeTableViewProps = {
  items: ChallengesTypes[];
};

export const ChallengeTableViewV2: React.FC<ChallengeTableViewProps> = ({
  items,
}) => {
  const hasItems = items && items.length > 0;

  return (
    <div className="overflow-x-auto overflow-y-hidden w-full">
      <Table className="w-full xl:min-w-0 min-w-[800px]  table-fixed">
        <TableHeader className="bg-white!  dark:bg-[#FFFFFF0D]! overflow-hidden">
          <TableRow
            className="border-b-0! 
            hover:bg-transparent
            [&_th]:bg-white [&_th]:dark:bg-[#FFFFFF0D]
            [&_th:first-child]:rounded-l-lg 
            [&_th:last-child]:rounded-r-lg " 
          >
            <TableHead className="w-[70px] min-w-[70px] text-[#212121]! dark:text-white!">Title</TableHead>
            {/* Increased width slightly to give tags more room */}
            <TableHead className="min-w-[120px] w-[120px] text-[#212121]! dark:text-white!">Summary</TableHead>
            <TableHead className="w-[60px] min-w-[60px] text-[#212121]! dark:text-white!">Difficulty</TableHead>
            <TableHead className="w-[60px] min-w-[60px] text-[#212121]! dark:text-white!">Tags</TableHead>
            <TableHead className="w-[20px] min-w-[20px] text-[#212121]! dark:text-white! align-end">
              <div className=" text-end">Status</div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {hasItems ? (
            items.map((item) => {
              const tags = (item?.tags ?? []) as TagChipVariantType[];

              return (
                <TableRow
                  key={item?.id}
                  className="border-b-0 
                    even:[&_td]:bg-white! even:dark:[&_td]:bg-[#FFFFFF0D]! 
                    even:[&_td:first-child]:rounded-l-lg 
                    even:[&_td:last-child]:rounded-r-lg 
                    not-even:[&_td:first-child]:rounded-l-lg 
                    not-even:[&_td:last-child]:rounded-r-lg"
                >
                  {/* Title Cell */}
                  <TableCell className="font-medium align-top py-3 pr-4">
                    <Link
                      className="hover:underline block w-full truncate"
                      href={Navigation.ChallengesDetail(String(item?.slug))}
                      title={item?.title}
                    >
                     {item?.title}
                    </Link>
                  </TableCell>

                

                  {/* Summary Cell */}
                  <TableCell className="text-muted-foreground align-top py-3 pe-10 3xl:pe-20">
                    <Link
                      href={Navigation.ChallengesDetail(String(item?.slug))}
                      className="block w-full max-w-[400px] 2xl:max-w-[500px] truncate hover:underline"
                      title={item?.summary}
                    >
                      {item?.summary}
                    </Link>
                  </TableCell>

                  {/* Difficulty Cell */}
                  <TableCell className="align-top py-3 truncate">
                    <DifficultyChip level={item?.difficulty} />
                  </TableCell>
  {/* Tags Cell - Fixed Overflow */}
                  <TableCell className="align-top py-3 pr-4">
                    {/* Replaced w-max with flex-wrap and removed overflow-visible */}
                    <div className="flex w-max  gap-2 items-center">
                      {tags?.slice(0, 1).map((tag: string) => (
                        <TagChip className="rounded-full! text-[10px]! px-2! py-1! text-[#005092]" key={tag}>{tag}</TagChip>
                      ))}

                      {tags?.length > 1 && (
                        <button
                          className="inline-flex w-max shrink-0 items-center rounded-sm font-semibold bg-[#F9FAFB] dark:bg-primary/20 border border-[#E5E7EB] dark:border-primary/20 p-1  text-xs"
                          aria-label={`Show ${tags?.length - 1} more tags`}
                        >
                          +{tags?.length - 1}
                        </button>
                      )}
                    </div>
                  </TableCell>
                  {/* Status Cell */}
                  <TableCell className="align-top  py-3 truncate">
                    {item?.userProgress ? (
                      <div className="flex justify-end">
                        <StatusChip withText={false} status={item?.userProgress} />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">- - - -</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};


