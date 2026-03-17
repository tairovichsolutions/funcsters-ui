"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MoreHorizontal, 
  MessageSquare, 
  Reply, 
  Pencil, 
  Trash2, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { DisplayAvatar } from "@/components/ui/display-avatar";
import { cn } from "@/lib";
import { useReplies } from "@/queries/useComments";
import { useVoteComment, useCreateComment, useEditComment, useDeleteComment } from "@/mutations/useCommentsMutations";
import { useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export interface CommentType {
  id: number;
  comment: string;
  createdAt: string;
  createdAgo: string;
  user: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  upvotesCount: number;
  downvotesCount: number;
  currentUserVote: "UPVOTE" | "DOWNVOTE" | null;
  deleted: boolean;
  submissionId: number;
  repliesCount: number;
}

interface CommentItemProps {
  comment: CommentType;
  isReply?: boolean;
}

export const CommentItem = ({ comment, isReply = false }: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(comment.comment);
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  
  const contentRef = useRef<HTMLParagraphElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const currentUserId = getCookie("userId");

  const { data: repliesResponse, isLoading: repliesLoading } = useReplies(
    showReplies ? comment.id : null,
    showReplies
  );

  const { mutate: voteComment } = useVoteComment();
  const { mutate: createReply, isPending: creatingReply } = useCreateComment();
  const { mutate: editComment } = useEditComment();
  const { mutate: deleteComment } = useDeleteComment();

  useEffect(() => {
    if (contentRef.current) {
      const lineHeightStr = window.getComputedStyle(contentRef.current).lineHeight;
      const lineHeight = parseInt(lineHeightStr === 'normal' ? '20' : lineHeightStr);
      const height = contentRef.current.scrollHeight;
      if (height > lineHeight * 6) {
        setShouldShowReadMore(true);
      } else {
        setShouldShowReadMore(false);
      }
    }
  }, [comment.comment]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVote = (type: "UPVOTE" | "DOWNVOTE") => {
    if (isOwner) return;
    voteComment({ id: comment.id, type });
  };

  const toggleReply = () => {
    if (!isReplying) {
      setReplyInput(`@${comment.user.name} `);
    }
    setIsReplying(!isReplying);
  };

  const handlePostReply = () => {
    if (!replyInput.trim()) return;
    createReply(
      {
        submissionId: comment.submissionId,
        comment: replyInput,
        parentId: comment.id,
      },
      {
        onSuccess: () => {
          setReplyInput("");
          setIsReplying(false);
          setShowReplies(true);
          queryClient.invalidateQueries({ queryKey: ["GetReplies", comment.id] });
          queryClient.invalidateQueries({ queryKey: ["GetRootComments"] });
        },
      }
    );
  };

  const handleSaveEdit = () => {
    if (!editInput.trim()) return;
    editComment({ id: comment.id, content: editInput }, {
      onSuccess: () => {
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ["GetRootComments"] });
        queryClient.invalidateQueries({ queryKey: ["GetReplies"] });
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment(comment.id);
    }
  };

  const firstLetter = comment.user?.name?.charAt(0)?.toUpperCase() || "A";
  const isOwner = !!(currentUserId && String(comment.user.id) === String(currentUserId));

  if (comment.deleted) {
      return (
        <div className={cn("flex gap-3", isReply ? "mt-4" : "mt-5")}>
            <div className="flex-1 space-y-1">
                <p className="text-[13px] text-gray-500 italic">[deleted]</p>
            </div>
        </div>
      );
  }

  return (
    <div className={cn("flex gap-3 w-full", isReply ? "mt-4" : "mt-5")}>
      <DisplayAvatar FallbackName={firstLetter} src={comment.user?.avatarUrl} />
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex justify-between items-center relative group">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1D2939] dark:text-gray-100">
              {comment.user?.name || "Unknown User"}
            </span>
            <span className="text-[12px] text-gray-500">
              {comment.createdAgo}
            </span>
          </div>
          
          <div className="relative" ref={menuRef}>
            {!isOwner && (
              <>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MoreHorizontal className="size-4" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden">
                    <button 
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Report
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              className="w-full text-[13px] p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
              rows={3}
            />
            <div className="flex gap-2">
              <button 
                onClick={handleSaveEdit}
                className="text-xs px-3 py-1 bg-[#005092] text-white rounded-md"
              >
                Save
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p 
              ref={contentRef}
              className={cn(
                "text-[13px] text-[#344054] dark:text-gray-300 break-words",
                !isExpanded && "line-clamp-6"
              )}
            >
              {comment.comment}
            </p>
            {shouldShowReadMore && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-[#005092] font-semibold mt-1 hover:underline"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-md px-1 py-0.5">
            <button
              onClick={() => handleVote("UPVOTE")}
              disabled={isOwner}
              className={cn(
                "text-gray-500 transition-colors",
                !isOwner && "hover:text-[#005092]",
                comment.currentUserVote === "UPVOTE" && "text-[#005092]",
                isOwner && "cursor-not-allowed opacity-50"
              )}
            >
              <ArrowBigUp className={cn("size-5", comment.currentUserVote === "UPVOTE" && "fill-[#005092]")} />
            </button>
            <span className="text-xs font-bold min-w-[12px] text-center">
              {comment.upvotesCount - comment.downvotesCount}
            </span>
            <button
              onClick={() => handleVote("DOWNVOTE")}
              disabled={isOwner}
              className={cn(
                "text-gray-500 transition-colors",
                !isOwner && "hover:text-[#EE3939]",
                comment.currentUserVote === "DOWNVOTE" && "text-[#EE3939]",
                isOwner && "cursor-not-allowed opacity-50"
              )}
            >
              <ArrowBigDown className={cn("size-5", comment.currentUserVote === "DOWNVOTE" && "fill-[#EE3939]")} />
            </button>
          </div>

          <button 
            onClick={toggleReply}
            className={cn(
               "flex items-center gap-1 text-xs font-medium transition-colors",
               isReplying ? "text-[#005092]" : "text-gray-500 hover:text-[#005092]"
            )}
          >
            <Reply className="size-4" /> Reply
          </button>

          {comment.repliesCount > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-xs text-[#005092] hover:underline font-bold"
            >
              <MessageSquare className="size-4" />
              {showReplies ? "Hide replies" : `${comment.repliesCount} ${comment.repliesCount === 1 ? 'reply' : 'replies'}`}
              {showReplies ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
          )}

          {isOwner && (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#005092] font-medium"
              >
                <Pencil className="size-4" /> Edit
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 font-medium"
              >
                <Trash2 className="size-4" /> Delete
              </button>
            </div>
          )}
        </div>

        {isReplying && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-3 items-center">
              <DisplayAvatar FallbackName={"Y"} />
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                      if(e.key === "Enter") {
                          handlePostReply();
                      }
                      if(e.key === "Escape") {
                          setIsReplying(false);
                      }
                  }}
                  className="w-full text-xs py-2 px-3 border border-[#E5E7EB] dark:border-[#FFFFFF33] rounded-full focus:outline-none focus:ring-1 focus:ring-[#005092] bg-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 ml-10">
              <button 
                onClick={handlePostReply}
                disabled={creatingReply || !replyInput.trim()}
                className="text-[11px] font-bold px-3 py-1 bg-[#005092] text-white rounded-full disabled:opacity-50"
              >
                Reply
              </button>
              <button 
                onClick={() => setIsReplying(false)}
                className="text-[11px] font-bold px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showReplies && (
          <div className="mt-2 border-l-2 border-[#0050921A] dark:border-gray-800 pl-4 space-y-4">
            {repliesLoading ? (
                <div className="text-xs text-gray-400">Loading replies...</div>
            ) : (
                repliesResponse?.map((reply: any) => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
