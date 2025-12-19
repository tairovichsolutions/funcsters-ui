/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Iconify } from "@/components";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CommunitySolutionType } from "@/types";
import { Tooltip } from "@/components/ui/tooltip";
import {
  a11yDark,
  a11yLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Scrollable } from "@/components/ui/scrollable";
import SyntaxHighlighter from "react-syntax-highlighter";
import { LANGUAGE_ICON_MAP } from "@/constants/Language";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { DisplayAvatar } from "@/components/ui/display-avatar";
import { CommunitySolutionsVote } from "./CommunitySolutionsVote";
import { useToggleMySolution } from "@/mutations/useToggleMySolution";
import { useDeleteMySolution } from "@/mutations/useDeleteMySolution";
import { useLanguageImplementations } from "@/context/languageImplementationsContext";

const Dot = () => (
  <span className="size-1! rounded-full bg-black  dark:bg-white" />
);

interface payloadType {
  challengeId: string | number;
  languageId: string | number;
  visible: boolean;
}

interface DeletePayload {
  challengeId: number;
  languageId: number;
}
type CommunitySolutionsCardProps = {
  data: CommunitySolutionType;
  mySolution?: boolean;
};

export const CommunitySolutionsCard = React.memo(
  ({ data, mySolution }: CommunitySolutionsCardProps) => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    const { author, solutionInfo } = data || {};
    const firstLetter = author?.name?.charAt(0)?.toUpperCase();
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

    const { mutateAsync: togglefc, isPending: toggleMySolutionPending } =
      useToggleMySolution();
    const {
      mutateAsync: deleteMySolutionfc,
      isPending: deleteMySolutionPending,
    } = useDeleteMySolution();

    const [checked, setChecked] = React.useState(() => !data.hidden);

    const { id } = useParams();
    const { languageId } = useLanguageImplementations();

    const solutionId = data?.solutionInfo?.solutionId;

    const handleToggle = async (value: boolean) => {
      const previous = checked;
      setChecked(value);
      try {
        const payload: payloadType = {
          challengeId: Number(id),
          languageId: Number(languageId),
          visible: value,
        };
        await togglefc(payload);
        toast.success(
          value ? "Solution is now visible!" : "Solution is hidden."
        );
      } catch (error) {
        setChecked(previous);
        toast.error("Failed to update visibility");
      }
    };

    const handleDelete = async () => {
      try {
        const payload: DeletePayload = {
          challengeId: Number(id),
          languageId: Number(languageId),
        };
        await deleteMySolutionfc(payload);
        toast.success("Solution deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete solution");
      }
    };

    const tooltipText = checked
      ? "Your solution is visible to the community"
      : "Your solution is hidden from the community";

    const languageKey = solutionInfo?.language
      ? solutionInfo.language.toLowerCase()
      : "";

    const languageConfig = languageKey
      ? LANGUAGE_ICON_MAP[languageKey]
      : undefined;

    return (
      <div className="border mt-1 border-[#00509233] dark:border-[#FFFFFF33] rounded-[12px] py-2 px-2.5">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 py-1">
            <DisplayAvatar
              FallbackName={firstLetter}
              src={`http://www.funcsters.io/static/${author?.avatarUrl}`}
            />
            <div className="space-y-1">
              <div className="flex gap-2 items-center">
                <h3 className="text-sm font-bold">{author?.name}</h3>
                {mySolution && (
                  <span className="rounded-[20px] text-[10px] py-1 leading-none text-white px-2 bg-primary font-normal">
                    Your Solution
                  </span>
                )}
              </div>

              <div className="flex gap-2 items-center text-[12px] leading-none font-normal">
                {[
                  author?.occupation,
                  author?.country && (
                    <span className="flex items-center gap-1">
                      {author?.countryFlag && (
                        <img
                          src={author?.countryFlag}
                          alt={author?.country}
                          className="w-4 h-3 rounded object-cover"
                        />
                      )}
                      {author?.country}
                    </span>
                  ),
                  solutionInfo?.submittedAgo,
                ]
                  .filter(Boolean)
                  .map((item, i, arr) => (
                    <React.Fragment key={i}>
                      <h4>{item}</h4>
                      {i < arr.length - 1 && <Dot />}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>

          {mySolution ? (
            <Tooltip
              place="top-end"
              className="font-semibold rounded-lg! px-4!"
              content={tooltipText}
            >
              <Switch
                textSize="sm"
                uiSize="lg"
                disabled={toggleMySolutionPending}
                checked={checked}
                onCheckedChange={handleToggle}
                onText={"Hide"}
                offText={"View"}
              />
            </Tooltip>
          ) : (
            <div className=" mr-2">
              {languageConfig?.iconName && (
                <span className="inline-flex items-center justify-center rounded-md ">
                  <Iconify
                    iconName={languageConfig.iconName}
                    className="size-5 leading-none shrink-0"
                  />
                </span>
              )}
            </div>
          )}
        </div>

        <Scrollable className="mt-3 w-full h-[220px] border border-[#E5E7EB] rounded-md bg-[#0050920D] dark:border-none dark:bg-[#FFFFFF0D] p-3 font-mono text-xs text-gray-800">
          <SyntaxHighlighter
            language="javascript"
            style={isDarkMode ? a11yDark : a11yLight}
            customStyle={{
              background: "transparent",
              fontSize: "14px",
              color: isDarkMode ? "#FAFAFA" : "#3a3a3a",
              width: "fit-content",
              whiteSpace: "pre",
            }}
            wrapLongLines={false}
          >
            {solutionInfo?.code || ""}
          </SyntaxHighlighter>
        </Scrollable>

        <div className="mt-3  px-1 flex items-center justify-between">
          <div className="flex gap-2 items-center flex-wrap">
            <CommunitySolutionsVote
              languageId={Number(languageId)}
              challengeId={Number(id)}
              solutionId={solutionId}
              voteData={data?.votes}
            />
          </div>
          {mySolution && (
            <Button
              onClick={() => setDeleteModalOpen(true)}
              variant={"outline"}
              startIcon={<Trash2 className="size-3" />}
              className="border-[#EE3939] text-[#EE3939] hover:text-[#EE3939] gap-1 leading-none bg-[#EE39391A] hover:bg-[#EE39391A] font-semibold"
              size="chip"
            >
              Delete
            </Button>
          )}

          {deleteModalOpen && (
            <DeleteModal
              isPending={deleteMySolutionPending}
              title="Delete Solution!"
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={handleDelete}
              description="Are you sure you want to delete this solution? Once removed, your code and progress for this challenge can’t be recovered. This action is permanent, so confirm only if you’re certain."
            />
          )}
        </div>
      </div>
    );
  }
);
