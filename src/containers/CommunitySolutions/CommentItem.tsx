"use client";

import TextEditorPrimary from "@/components/shared/textEditor/TextEditorPrimary";
import { DisplayAvatar } from "@/components/ui/display-avatar";
import { cn } from "@/lib";
import { useCreateComment, useDeleteComment, useEditComment, useVoteComment } from "@/mutations/useCommentsMutations";
import { useReplies } from "@/queries/useComments";
import { useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import {
  ChevronDown,
  ChevronUp, CircleChevronDown, CircleChevronUp, MessageCircle, MoreHorizontal
} from 'lucide-react';
import { useEffect, useRef, useState } from "react";

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
  const [editInput, setEditInput] = useState(comment.comment || "");
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

  // Soft-deleted comments: hidden entirely from the UI
  // The data stays in the DB for thread integrity, but nothing is rendered
  if (comment.deleted) {
    return null;
  }

  return (
    <div className={cn("flex gap-3 w-full", isReply ? "mt-4" : "mt-5")}>

      <DisplayAvatar FallbackName={firstLetter} src={comment.user?.avatarUrl} />
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex justify-between items-center relative group">
          <div className="flex  items-center gap-2  mt-[6.5px]">
            <span className="text-sm font-bold text-neutral-01 dark:text-gray-100">
              {comment.user?.name || "Unknown User"}
            </span>
            <span className="text-[12px] text-neutral-4.8">
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
            <TextEditorPrimary
              value={editInput}
              onChange={setEditInput}
              onSubmit={handleSaveEdit}
              placeholder="Type your message here..."
            />
            {/* <textarea
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              className="w-full text-[13px] p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
              rows={3}
            /> */}
            <div className="flex gap-2 justify-end">
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
                "text-[13px] text-neutral-01  dark:text-gray-300 break-words",
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

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-2  dark:bg-gray-800/50 rounded-md px-1 py-0.5">
            <button
              onClick={() => handleVote("UPVOTE")}
              disabled={isOwner}
              className={cn(
                "text-neutral-4.5 transition-colors",
                !isOwner && "hover:text-[#005092]",
                comment?.currentUserVote === "UPVOTE" && "text-[#005092]",
                isOwner && "cursor-not-allowed opacity-50"
              )}
            >
              <CircleChevronUp className={cn("size-5", comment.currentUserVote === "UPVOTE" && "fill-[#005092] text-white ")} />
            </button>
            <span className="text-xs font-bold min-w-[12px] text-neutral-4.5 text-center">
              {comment.upvotesCount - comment.downvotesCount}
            </span>
            <button
              onClick={() => handleVote("DOWNVOTE")}
              disabled={isOwner}
              className={cn(
                "text-neutral-4.5 transition-colors",
                !isOwner && "hover:text-[#EE3939]",
                comment.currentUserVote === "DOWNVOTE" && "text-[#EE3939]",
                isOwner && "cursor-not-allowed opacity-50"
              )}
            >
              <CircleChevronDown className={cn("size-5 ", comment.currentUserVote === "DOWNVOTE" && "fill-[#EE3939] text-white")} />
            </button>
          </div>

          <button
            onClick={toggleReply}
            className={cn(
              "flex items-center gap-1 text-xs font-medium transition-colors",
              isReplying ? "text-[#005092]" : "text-neutral-4.5 hover:text-[#005092]"
            )}
          ><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
              <g clipPath="url(#clip0_9207_6094)">
                <path d="M5.41708 3.79265V1.48949C5.41753 1.40948 5.39429 1.33112 5.35027 1.26431C5.30626 1.19749 5.24344 1.1452 5.16975 1.11404C5.09606 1.08287 5.01479 1.07422 4.93619 1.08917C4.85759 1.10413 4.78518 1.14202 4.72808 1.19807L0.123916 5.66682C0.0847284 5.70457 0.0535568 5.74983 0.0322654 5.7999C0.0109739 5.84997 0 5.90383 0 5.95824C0 6.01265 0.0109739 6.0665 0.0322654 6.11657C0.0535568 6.16664 0.0847284 6.21191 0.123916 6.24965L4.72808 10.7184C4.84562 10.8322 5.02004 10.8641 5.169 10.8013C5.24248 10.7701 5.30517 10.7179 5.34927 10.6514C5.39338 10.5849 5.41696 10.5068 5.41708 10.427V8.1249H6.18517C8.69633 8.1249 11.0114 9.4899 12.2264 11.6847L12.2377 11.7053C12.281 11.7845 12.3495 11.847 12.4322 11.883C12.515 11.9189 12.6074 11.9263 12.6948 11.904C12.7822 11.8816 12.8597 11.8308 12.9151 11.7595C12.9704 11.6882 13.0004 11.6006 13.0004 11.5103C13.0004 7.2994 9.61121 3.86524 5.41708 3.79265Z" fill="#4D4D4D" />
              </g>
              <defs>
                <clipPath id="clip0_9207_6094">
                  <rect width="13" height="13" fill="white" />
                </clipPath>
              </defs>
            </svg> Reply
          </button>

          {comment.repliesCount > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-xs text-[#005092] hover:underline font-bold"
            >
              <MessageCircle
                className={cn(
                  "size-[12px] transition-colors fill-current text-neutral-4.5 dark:text-gray-100",

                )}
              />
              {showReplies ? "Hide replies" : ` ${comment.repliesCount === 1 ? 'reply' : 'replies'} (${comment.repliesCount})`}
              {showReplies ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
          )}

          {isOwner && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-xs text-neutral-4.5 hover:text-[#005092] font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M7.22534 1.95546L0.787878 8.4002C0.755461 8.43273 0.732359 8.47338 0.720979 8.51789L0.00742295 11.3849C-0.00307164 11.4274 -0.0024285 11.472 0.00929026 11.5142C0.021009 11.5564 0.0434074 11.5949 0.0743218 11.6259C0.121806 11.6733 0.186098 11.6999 0.253138 11.7C0.27382 11.7 0.294421 11.6974 0.314478 11.6924L3.17846 10.978C3.223 10.9668 3.26365 10.9437 3.29606 10.9111L9.73412 4.46683L7.22534 1.95546ZM11.329 1.07673L10.6124 0.359401C10.1334 -0.120038 9.29869 -0.119562 8.8203 0.359401L7.94251 1.23813L10.4512 3.74941L11.329 2.8707C11.5682 2.63131 11.7 2.31266 11.7 1.97377C11.7 1.63488 11.5682 1.31623 11.329 1.07673Z" fill="#4D4D4D" />
                </svg> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 text-xs text-neutral-4.5 hover:text-red-600 font-medium"
              >

                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <g clipPath="url(#clip0_9207_28658)">
                    <path d="M11.7509 3.00732H9.40183V2.48382C9.40183 1.74179 8.8786 1.15039 8.21964 1.15039H5.79615C5.13828 1.15039 4.61396 1.74056 4.61396 2.48382V3.00732H2.24958C1.99562 3.00732 1.80078 3.22709 1.80078 3.51353C1.80078 3.79997 1.99562 4.01974 2.24958 4.01974H2.98297V11.5339C2.9983 12.2759 3.52153 12.8673 4.18049 12.85H9.82107C10.4789 12.8673 11.0033 12.2759 11.0186 11.5339V4.01974H11.752C12.0059 4.01974 12.2008 3.79997 12.2008 3.51353C12.1997 3.22709 12.0048 3.00732 11.7509 3.00732ZM5.51155 2.48506C5.49622 2.31591 5.61663 2.18133 5.7655 2.16405H8.21964C8.36961 2.14676 8.48892 2.28257 8.50424 2.45049V3.00732H5.51155V2.48506ZM6.11031 9.7288C6.11031 10.0152 5.91546 10.235 5.66151 10.235C5.40756 10.235 5.21272 10.0152 5.21272 9.7288V5.97791C5.21272 5.69147 5.40756 5.4717 5.66151 5.4717C5.91546 5.4717 6.11031 5.69147 6.11031 5.97791V9.7288ZM8.80308 9.7288C8.80308 10.0152 8.60823 10.235 8.35428 10.235C8.10033 10.235 7.90549 10.0152 7.90549 9.7288V5.97791C7.90549 5.69147 8.10033 5.4717 8.35428 5.4717C8.60823 5.4717 8.80308 5.69147 8.80308 5.97791V9.7288Z" fill="#4D4D4D" />
                  </g>
                  <defs>
                    <clipPath id="clip0_9207_28658">
                      <rect width="13" height="13" fill="white" />
                    </clipPath>
                  </defs>
                </svg> Delete
              </button>
            </div>
          )}
        </div>

        {isReplying && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-3 items-center">
              {/* <DisplayAvatar FallbackName={"Y"} /> */}
              <div className="flex-1 relative">

                <TextEditorPrimary
                  value={replyInput}
                  onChange={setReplyInput}
                  onSubmit={handlePostReply}
                  placeholder="Type your message here..."
                />
                {/* <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePostReply();
                    }
                    if (e.key === "Escape") {
                      setIsReplying(false);
                    }
                  }}
                  className="w-full text-xs py-2 px-3 border border-[#E5E7EB] dark:border-[#FFFFFF33] rounded-full focus:outline-none focus:ring-1 focus:ring-[#005092] bg-transparent"
                /> */}
              </div>
            </div>
            <div className="flex gap-2 justify-end ml-10">
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
