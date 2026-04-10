import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Send, TextAlignStart } from "lucide-react";
import { EditerFontSizeControl } from "./EditerFontSizeControl";
import { LanguageSelector } from "../ChallengesWorkSpace/LanguageSelector";

interface CodeEditorHeaderType {
  code: string;
  isPending: boolean;
  allTestPass: boolean;
  handleRunCode: () => void;
  submitCodePending: boolean;
  handleSubmitCode: () => void;
  handleFormatCode: () => void;
}

export const CodeEditorHeader = React.memo(
  ({
    code,
    isPending,
    allTestPass,
    handleRunCode,
    handleSubmitCode,
    handleFormatCode,
    submitCodePending,
  }: CodeEditorHeaderType) => {
    return (
      <div className="h-full w-full flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <LanguageSelector
            className={
              "bg-[#0050920D]! dark:bg-[#FFFFFF0D]! border leading-none! cursor-pointer! min-w-32! text-xs! border-[#00509280]! dark:border-[#FFFFFF80]! text-[#005092]! dark:text-[#FFFFFF80]!"
            }
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="icon"
            type="button"
            variant="tertiary"
            aria-label="Format code"
            onClick={handleFormatCode}
            className="h-[35px] w-[35px] bg-[#0050921A] shadow-sm! hover:bg-primary/20"
          >
            <TextAlignStart />
          </Button>

          <EditerFontSizeControl />

          {allTestPass ? (
            <Button
              type="button"
              disabled={!code}
              aria-label="Submit"
              loadingText="Submiting..."
              onClick={handleSubmitCode}
              loading={submitCodePending}
              className="gap-2 text-[13px]!"
            >
              <Send className="size-3.5 text-white" />
              Submit
            </Button>
          ) : (
            <Button
              type="button"
              aria-label="Run"
              disabled={!code}
              loading={isPending}
              onClick={handleRunCode}
              loadingText="Running..."
              className="gap-2 text-[13px]!"
            >
              <Play className="size-3.5 fill-white" />
              Run
            </Button>
          )}
        </div>
      </div>
    );
  },
);
