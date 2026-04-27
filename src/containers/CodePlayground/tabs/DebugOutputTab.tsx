import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components";
import { cn } from "@/lib";
import { CheckCircle2, XCircle } from "lucide-react";
import { KeyValueBox } from "./KeyValueBox";
import { ApiTestResult } from "@/types/run-code-type";

export const DebugOutputTab = ({ tests }: { tests: ApiTestResult[] }) => {
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
                : "bg-danger/[0.102] border-danger"
            )}
          >
            <AccordionTrigger
              className={cn(
                "px-3 py-2.5 font-medium flex cursor-pointer  items-center  gap-2 hover:no-underline"
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
              <div className=" bg-[#FFFFFF4D] dark:bg-[#FFFFFF1A] p-3 space-y-2">
                <KeyValueBox label="Debug Output:" value={test?.debug || 0} />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
