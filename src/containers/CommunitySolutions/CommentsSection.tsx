"use client";

import React, { useState } from "react";
import { Link2, Image as ImageIcon, List, Smile, AtSign, Send } from "lucide-react";
import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import { DisplayAvatar } from "@/components/ui/display-avatar";
import { TagSelector } from "@/components";
import { CommentItem, CommentType } from "./CommentItem";
import { SortKey } from "@/queries/useCommunitySolutions"; 
import { useRootComments } from "@/queries/useComments";
import { useCreateComment } from "@/mutations/useCommentsMutations";
import { useQueryClient } from "@tanstack/react-query";

const FILTER_OPTIONS: { id: string; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
];

export interface CommentsSectionProps {
  submissionId?: number;
  isNestedView?: boolean;
  onViewAllComments?: () => void;
  className?: string;
}

export const CommentsSection = ({ submissionId, isNestedView, onViewAllComments, className }: CommentsSectionProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("top");
  const [commentInput, setCommentInput] = useState("");
  const queryClient = useQueryClient();

  const { data: commentsResponse, isLoading } = useRootComments(
      submissionId ?? "", 
      !!submissionId, 
      selectedFilter, 
      0, 
      isNestedView ? 100 : 7 
  );

  const { mutate: createComment, isPending: creatingComment } = useCreateComment();

  const handlePostSubmit = () => {
    if(!commentInput.trim() || !submissionId) return;

    createComment(
        {
           submissionId: submissionId,
           comment: commentInput
        },
        {
           onSuccess: () => {
              setCommentInput("");
              queryClient.invalidateQueries({ queryKey: ["GetRootComments"] });
           }
        }
    );
  };

  const selectedLabel =
    FILTER_OPTIONS.find((x) => x.id === selectedFilter)?.label ?? "Most Recent";

  const rootComments: CommentType[] = commentsResponse?.content || [];

  return (
    <div className={cn("flex flex-col border-t border-[#00509233] dark:border-[#FFFFFF33] pt-4 mt-2", className)}>
      
      {/* Input Area */}
      <div className="flex gap-3 items-start w-full">
        <DisplayAvatar FallbackName={"Y"} />
        <div className="flex-1 flex flex-col border border-[#E5E7EB] dark:border-[#FFFFFF33] rounded-md focus-within:ring-1 focus-within:ring-[#005092] transition-shadow">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Share your mind..."
            className="w-full text-sm py-2.5 px-3 min-h-[50px] resize-none focus:outline-none bg-transparent dark:text-gray-100 placeholder:text-gray-400"
          />
          <div className="flex items-center justify-between pb-1.5 px-2">
            <div className="flex items-center gap-1.5 text-gray-400">
              <button type="button" className="p-1 hover:text-[#005092] transition-colors"><Link2 className="size-[15px]" /></button>
              <button type="button" className="p-1 hover:text-[#005092] transition-colors"><ImageIcon className="size-[15px]" /></button>
              <button type="button" className="p-1 hover:text-[#005092] transition-colors"><List className="size-[15px]" /></button>
              <button type="button" className="p-1 hover:text-[#005092] transition-colors"><Smile className="size-[15px]" /></button>
              <button type="button" className="p-1 hover:text-[#005092] transition-colors"><AtSign className="size-[15px]" /></button>
            </div>
            <Button
              size="sm"
              onClick={handlePostSubmit}
              disabled={creatingComment || !commentInput.trim() || !submissionId}
              className="h-7 text-xs px-4 bg-[#73B2E9] hover:bg-[#62a0d6] text-white rounded-full transition-colors disabled:opacity-50"
            >
              Post
            </Button>
          </div>
        </div>
      </div>

      {/* Header and Filter */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-[#1D2939] dark:text-gray-100">
            Comments
            </h3>
            <span className="text-xs font-semibold px-1.5 py-0.5 bg-[#0050921A] dark:bg-[#FFFFFF1A] text-[#005092] dark:text-gray-200 rounded-full">
            {commentsResponse?.totalElements ?? rootComments.length}
            </span>
        </div>

        <TagSelector
          multiple={false}
          tags={FILTER_OPTIONS}
          label={selectedLabel}
          className={"text-[13px]! bg-transparent! border border-[#E5E7EB] dark:border-[#FFFFFF33] shadow-none! h-8!"}
          value={[selectedFilter]}
          onChange={(selected) => {
            const next = (selected?.[0] as string) ?? "newest";
            setSelectedFilter(next);
          }}
        />
      </div>

      {/* Comments List */}
      <div className="flex flex-col mt-2 mb-2">
        {isLoading ? (
            <div className="py-4 text-center text-sm text-gray-500">Loading comments...</div>
        ) : rootComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {/* View All Comments Button */}
      {!isNestedView && rootComments.length >= 7 && (
        <div className="flex justify-center mt-3 pb-2 pt-1">
          <button
            onClick={onViewAllComments}
            className="text-[13px] font-semibold text-[#008CFF] hover:underline"
          >
            View all {commentsResponse?.totalElements ?? 7} comments →
          </button>
        </div>
      )}

    </div>
  );
};
