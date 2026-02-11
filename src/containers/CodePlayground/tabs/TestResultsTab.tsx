import { cn } from "@/lib";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TestCase } from "@/types";
import { KeyValueBox } from "./KeyValueBox";
import { CheckCircle2, XCircle } from "lucide-react";
import { InputKeyValues } from "./InputKeyValues";

export const TestResultsTab = React.memo(({ tests }: { tests: TestCase[] }) => {
  return (
    <Accordion type="multiple" className="w-full ">
      {tests?.map((test, i) => {
        const isPass = test?.passed;
        return (
          <AccordionItem
            key={i}
            value={String(test?.test)}
            className={cn(
              "m-2 rounded-[12px] border!",
              isPass
                ? "bg-success/[0.102] border-success"
                : "bg-danger/[0.102] border-danger",
            )}
          >
            <AccordionTrigger
              className={cn(
                "px-3 py-2.5 font-medium flex cursor-pointer  items-center  gap-2 hover:no-underline",
              )}
            >
              <div className="flex text-sm items-center gap-4">
                <span>
                  {isPass ? (
                    <CheckCircle2 className="h-4 w-4 text-success!" />
                  ) : (
                    <XCircle className="h-4 w-4 text-danger" />
                  )}
                </span>
                Test {test?.test}
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-3  text-sm grid gap-3">
              <div className=" bg-[#FFFFFF4D] dark:bg-[#FFFFFF1A]  p-3 space-y-2">
                {/* <KeyValueBox label="Input" value={` ${test?.input?.arr}`} /> */}

                <InputKeyValues input={test?.input} />

                {test?.expected && (
                  <KeyValueBox label="Expected Output" value={test?.expected} />
                )}

                {test?.actual && (
                  <KeyValueBox label="Actual" value={test?.actual} />
                )}

                  {test?.error && (
                  <KeyValueBox label="Error" value={test?.error} />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
});
