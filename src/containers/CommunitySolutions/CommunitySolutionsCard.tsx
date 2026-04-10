<<<<<<< HEAD
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Iconify } from "@/components";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CommunitySolutionType } from "@/types";
import { Tooltip } from "@/components/ui/tooltip";
import {
  a11yDark,
  a11yLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import { LANGUAGE_ICON_MAP } from "@/constants/Language";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { DisplayAvatar } from "@/components/ui/display-avatar";
import { CommunitySolutionsVote } from "./CommunitySolutionsVote";
import { useToggleMySolution } from "@/mutations/useToggleMySolution";
import { useDeleteMySolution } from "@/mutations/useDeleteMySolution";
import { useLanguageImplementations } from "@/context/languageImplementationsContext";
import { CommentsSection } from "./CommentsSection";

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
  isNestedView?: boolean;
  onViewAllComments?: (data: CommunitySolutionType) => void;
};

export const CommunitySolutionsCard = React.memo(
  ({ data, mySolution, isNestedView, onViewAllComments }: CommunitySolutionsCardProps) => {
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
    const [isCommentsExpanded, setIsCommentsExpanded] = React.useState(false);

    const { languageId, setShowSuccessModal, challengeId } =
      useLanguageImplementations();

    const solutionId = data?.solutionInfo?.solutionId;

    const handleToggle = async (value: boolean) => {
      const previous = checked;
      setChecked(value);
      try {
        const payload: payloadType = {
          challengeId: Number(challengeId),
          languageId: Number(languageId),
          visible: value,
        };
        await togglefc(payload);
      } catch (error) {
        setChecked(previous);
        console.error("Failed to update visibility:", error);
      }
    };

    const handleDelete = async () => {
      try {
        const payload: DeletePayload = {
          challengeId: Number(challengeId),
          languageId: Number(languageId),
        };
        const res = await deleteMySolutionfc(payload);

        if (res.status === 200) {
          setShowSuccessModal(false);
        }
      } catch (error) {
        console.log("Solution deleted Error:", error);
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
            <div className=" flex gap-1.5 items-center">
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

              <Button
                onClick={() => setDeleteModalOpen(true)}
                variant={"ghost"}
                className=" text-[#EE3939]! p-1.5! size-fit! hover:bg-[#EE39391A]!"
                size="icon"
              >
                <Trash2 className=" size-4.5!" />
              </Button>
            </div>
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

        <div className="mt-3 w-full max-h-[430px] overflow-y-auto custom-scrollbar border border-[#E5E7EB] rounded-md bg-[#0050920D] dark:border-none dark:bg-[#FFFFFF0D] p-3 font-mono text-xs text-gray-800">
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
        </div>

        <div className="mt-3  px-1 flex items-center justify-between">
          <CommunitySolutionsVote
            mySolution={mySolution}
            languageId={Number(languageId)}
            challengeId={Number(challengeId)}
            solutionId={solutionId}
            voteData={data?.votes}
            commentsCount={data?.solutionInfo?.commentsCount ?? 0}
            isCommentsExpanded={isCommentsExpanded}
            onToggleComments={() => setIsCommentsExpanded(p => !p)}
          />

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

        {(isCommentsExpanded || isNestedView) && (
          <CommentsSection
            submissionId={solutionId}
            isNestedView={isNestedView}
            onViewAllComments={() => onViewAllComments?.(data)}
          />
        )}
      </div>
    );
  },
);
=======
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Iconify } from "@/components";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CommunitySolutionType } from "@/types";
import { Tooltip } from "@/components/ui/tooltip";
import {
  a11yDark,
  a11yLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
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

    const { languageId, setShowSuccessModal, challengeId } =
      useLanguageImplementations();

    const solutionId = data?.solutionInfo?.solutionId;

    const handleToggle = async (value: boolean) => {
      const previous = checked;
      setChecked(value);
      try {
        const payload: payloadType = {
          challengeId: Number(challengeId),
          languageId: Number(languageId),
          visible: value,
        };
        await togglefc(payload);
      } catch (error) {
        setChecked(previous);
        console.error("Failed to update visibility:", error);
      }
    };

    const handleDelete = async () => {
      try {
        const payload: DeletePayload = {
          challengeId: Number(challengeId),
          languageId: Number(languageId),
        };
        const res = await deleteMySolutionfc(payload);

        if (res.status === 200) {
          setShowSuccessModal(false);
        }
      } catch (error) {
        console.log("Solution deleted Error:", error);
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
            <div className=" flex gap-1.5 items-center">
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

              <Button
                onClick={() => setDeleteModalOpen(true)}
                variant={"ghost"}
                className=" text-[#EE3939]! p-1.5! size-fit! hover:bg-[#EE39391A]!"
                size="icon"
              >
                <Trash2 className=" size-4.5!" />
              </Button>
            </div>
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

        <div className="mt-3 w-full max-h-[430px] overflow-y-auto custom-scrollbar border border-[#E5E7EB] rounded-md bg-[#0050920D] dark:border-none dark:bg-[#FFFFFF0D] p-3 font-mono text-xs text-gray-800">
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
        </div>

        <div className="mt-3  px-1 flex items-center justify-between">
          <CommunitySolutionsVote
            mySolution={mySolution}
            languageId={Number(languageId)}
            challengeId={Number(challengeId)}
            solutionId={solutionId}
            voteData={data?.votes}
          />

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
  },
);
>>>>>>> 2f476e413f9dbf36eb4f8bf7aa0938f8b7b2cd9f
