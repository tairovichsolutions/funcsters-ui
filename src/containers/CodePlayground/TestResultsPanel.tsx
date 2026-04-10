/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { StatusBadge } from "./StatusBadge";
import { Bug, CheckCircle2 } from "lucide-react";
import { DebugOutputTab, TestResultsTab } from "./tabs";
import { Scrollable } from "@/components/ui/scrollable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoOutputResult } from "@/components/ui/no-output-result";

const tabs = [
  {
    value: "results",
    label: "Test Results",
    icon: CheckCircle2,
  },
  {
    value: "debug",
    label: "Debug Output",
    icon: Bug,
  },
];

export const TestResultsPanel = React.memo(({ results }: any) => {
  const TestResultsPanelData = results?.testRunSummary;
  const compileOutputData = results;
  return (
    <section className="w-full h-full  border border-border-soft rounded-lg overflow-hidden bg-background">
      <Tabs defaultValue="results" className=" w-full h-full  flex flex-col">
        <div className="flex items-center justify-between border-b border-border-soft px-1 py-2">
          <TabsList className="bg-transparent p-0 gap-1">
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="group h-fit  shadow-none! border-none  text-[#808488] group-data-[state=active]:text-[#005092]! bg-transparent! dark:text-gray-500 font-medium text-xs cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  <Icon className="size-4! group-data-[state=active]:text-[#005092] dark:group-data-[state=active]:text-white" />
                  <span
                    className="
        whitespace-nowrap group-data-[state=active]:pb-0.5 border-b-2 border-transparent
        group-data-[state=active]:border-[#005092]
        dark:group-data-[state=active]:border-white
        group-data-[state=active]:font-semibold
        group-data-[state=active]:text-[#005092]
        dark:group-data-[state=active]:text-white"
                  >
                    {label}
                  </span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TestResultsPanelData && (
            <StatusBadge
              pass={TestResultsPanelData?.passed}
              fail={TestResultsPanelData?.failed}
            />
          )}
        </div>

        <Scrollable className="h-full!">
          <TabsContent value="results" className="p-1">
            {compileOutputData ? (
              compileOutputData?.status === 'succeeded' && TestResultsPanelData ? (
                <TestResultsTab tests={TestResultsPanelData?.results ?? []} />
              ) : (
                <div className="p-2 space-y-2">
                  <h2 className="text-base text-red-500">
                    {compileOutputData?.message || compileOutputData?.status}
                  </h2>
                  {compileOutputData?.errorOutput && (
                    <p className="text-sm text-red-500 whitespace-pre-wrap">
                      {compileOutputData?.errorOutput}
                    </p>
                  )}
                </div>
              )
            ) : (
              <div className="p-4">
                <NoOutputResult />
              </div>
            )}
          </TabsContent>

          <TabsContent value="debug" className="p-1">
            {compileOutputData ? (
              compileOutputData?.status === 'succeeded' && TestResultsPanelData ? (
                <DebugOutputTab tests={TestResultsPanelData?.results ?? []} />
              ) : (
                <div className="p-2 space-y-2">
                  <h2 className="text-base text-red-500">
                    {compileOutputData?.message || compileOutputData?.status}
                  </h2>
                  {compileOutputData?.errorOutput && (
                    <p className="text-sm text-red-500 whitespace-pre-wrap">
                      {compileOutputData?.errorOutput}
                    </p>
                  )}
                </div>
              )
            ) : (
              <div className="p-4">
                <NoOutputResult />
              </div>
            )}
          </TabsContent>
        </Scrollable>
      </Tabs>
    </section>
  );
});
