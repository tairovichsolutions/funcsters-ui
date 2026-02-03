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

export const ChallengeTableView: React.FC<ChallengeTableViewProps> = ({
  items,
}) => {
  const hasItems = items && items.length > 0;

  return (
    <div className="overflow-hidden ">
      <Table>
        <TableHeader className="bg-white! dark:bg-[#FFFFFF0D]!  overflow-hidden">
          <TableRow
            className=" border-b-0! 
            hover:bg-transparent
          [&_th]:bg-white [&_th]:dark:bg-[#FFFFFF0D]
           [&_th:first-child]:rounded-l-lg 
           [&_th:last-child]:rounded-r-lg"
          >
            <TableHead className="w-[260px]">Title</TableHead>
            <TableHead className="w-[320px]">summary</TableHead>
            <TableHead className="w-[120px]">Difficulty</TableHead>
            <TableHead className="w-[120px]">Tags</TableHead>
            <TableHead>Status</TableHead>
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
                  <TableCell className="font-medium w-1/6  truncate">
                    <Link
                      className=" hover:underline block max-w-[200px] 2xl:max-w-[250px] 3xl:max-w-[300px] truncate"
                      href={Navigation.ChallengesDetail(String(item?.id))}
                    >
                      {item?.title}
                    </Link>
                  </TableCell>

                  <TableCell className="text-muted-foreground pe-10 3xl:pe-20 w-1/4">
                    <Link
                      href={Navigation.ChallengesDetail(String(item?.id))}
                      className="block max-w-[280px] 2xl:max-w-[350px] 3xl:max-w-[500px]! truncate hover:underline"
                    >
                      {item?.summary}
                    </Link>
                  </TableCell>

                  <TableCell className=" truncate pe-10 3xl:pe-20 w-1/10">
                    <DifficultyChip level={item?.difficulty} />
                  </TableCell>

                  <TableCell className="3xl:pe-32 w-1/4">
                    <div className="flex gap-2 items-center">
                      {tags?.slice(0, 3).map((tag: string) => (
                        <TagChip key={tag}>{tag}</TagChip>
                      ))}

                      {tags?.length > 3 && (
                        <button
                          className="inline-flex shrink-0 items-center rounded-sm font-semibold bg-[#F9FAFB] dark:bg-primary/20 border border-[#E5E7EB] dark:border-primary/20 px-2 py-1 text-xs"
                          aria-label={`Show ${tags?.length - 3} more tags`}
                        >
                          +{tags?.length - 3}
                        </button>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className=" truncate w-1/10">
                    {item?.userProgress ? (
                      <StatusChip status={item?.userProgress} />
                    ) : (
                      "- - - -"
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
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
