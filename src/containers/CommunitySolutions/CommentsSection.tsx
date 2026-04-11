"use client";

import { TagSelector } from "@/components";
import TextEditorPrimary from "@/components/shared/textEditor/TextEditorPrimary";
import { cn } from "@/lib";
import { useCreateComment } from "@/mutations/useCommentsMutations";
import { useRootComments } from "@/queries/useComments";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CommentItem, CommentType } from "./CommentItem";

const FILTER_OPTIONS: { id: string; label: string }[] = [
  { id: "Most Recent", label: "Most Recent" },
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

const damiComents: CommentType[] = [
  // 1. Standard positive comment
  {
    id: 1,
    comment: "This is a beautifully structured component! Excellent work on handling the recursive replies.",
    createdAt: "2026-03-23T09:00:00.000Z",
    createdAgo: "42 mins ago",
    user: { id: 456, name: "Alex Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    upvotesCount: 24,
    downvotesCount: 2,
    currentUserVote: "UPVOTE",
    deleted: false,
    submissionId: 789,
    repliesCount: 3
  },
  // 2. Extremely long comment
  {
    id: 2,
    comment: "I wanted to test the read more functionality. This comment needs to be quite long so that the scrollHeight exceeds the six lines limit defined in the useEffect hook. When a comment is this long, it should truncate cleanly and display the 'Read more' button right below the text block. Once clicked, it should expand to show this entire paragraph without breaking the layout. Let's see if it works as expected!",
    createdAt: "2026-03-23T07:15:00.000Z",
    createdAgo: "2 hours ago",
    user: { id: 789, name: "Sarah Jenkins" },
    upvotesCount: 15,
    downvotesCount: 0,
    currentUserVote: "UPVOTE",
    deleted: false,
    submissionId: 789,
    repliesCount: 10
  },
  // 3. Standard deleted comment
  {
    id: 3,
    comment: "This text won't be seen because the comment is deleted.",
    createdAt: "2026-03-22T14:00:00.000Z",
    createdAgo: "1 day ago",
    user: { id: 999, name: "Unknown" },
    upvotesCount: 5,
    downvotesCount: 1,
    currentUserVote: null, // ✅ Changed to null for deleted comment
    deleted: true, // ✅ Changed to true
    submissionId: 789,
    repliesCount: 0
  },
  // 4. Downvoted comment with active downvote state
  {
    id: 4,
    comment: "I'm having a bit of trouble getting the avatar fallback to display correctly. Any tips?",
    createdAt: "2026-03-21T09:10:00.000Z",
    createdAgo: "2 days ago",
    user: { id: 104, name: "Alice Smith", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
    upvotesCount: 3,
    downvotesCount: 8,
    currentUserVote: "DOWNVOTE",
    deleted: false,
    submissionId: 789,
    repliesCount: 0
  },
  // 5. Short text with Emojis
  {
    id: 5,
    comment: "Looks great! 🚀🔥💯",
    createdAt: "2026-03-23T09:40:00.000Z",
    createdAgo: "9 mins ago",
    user: { id: 201, name: "EmojiFan", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emoji" },
    upvotesCount: 2,
    downvotesCount: 0,
    currentUserVote: null,
    deleted: false,
    submissionId: 789,
    repliesCount: 0
  },
  // 6. Heavily Downvoted (Negative Total)
  {
    id: 6,
    comment: "I don't think using Tailwind CSS was the right choice here. Vanilla CSS is much better for UI/UX.",
    createdAt: "2026-03-23T01:00:00.000Z",
    createdAgo: "8 hours ago",
    user: { id: 202, name: "ContrarianCoder" },
    upvotesCount: 5,
    downvotesCount: 145,
    currentUserVote: "DOWNVOTE",
    deleted: false,
    submissionId: 789,
    repliesCount: 12
  },
  // 7. Missing Avatar & Missing Name
  // {
  //   id: 7,
  //   comment: "How does the optimistic UI update work during the mutation?",
  //   createdAt: "2026-03-20T12:00:00.000Z",
  //   createdAgo: "3 days ago",
  //   user: { id: 203, name: "" },
  //   upvotesCount: 1,
  //   downvotesCount: 0,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 1
  // },
  // // 8. Very Long Username
  // {
  //   id: 8,
  //   comment: "The component structure is solid, but watch out for performance on deep nesting.",
  //   createdAt: "2026-03-22T08:00:00.000Z",
  //   createdAgo: "1 day ago",
  //   user: { id: 204, name: "MrSuperLongNameThatMightBreakTheUILayoutIfYouDontTruncateItProperly", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Long" },
  //   upvotesCount: 10,
  //   downvotesCount: 2,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 0
  // },
  // // 9. Bangla Language Comment
  // {
  //   id: 9,
  //   comment: "অসাধারণ কাজ! ভাই, এই কম্পোনেন্টটা আমার প্রোজেক্টেও কাজে লাগবে।",
  //   createdAt: "2026-03-23T09:45:00.000Z",
  //   createdAgo: "4 mins ago",
  //   user: { id: 205, name: "Rahim UI", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim" },
  //   upvotesCount: 18,
  //   downvotesCount: 0,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 2
  // },
  // // 10. Massive Upvote Count
  // {
  //   id: 10,
  //   comment: "Are you using Next.js 16 for this? The 'use client' directive suggests the App Router.",
  //   createdAt: "2026-02-15T10:00:00.000Z",
  //   createdAgo: "1 month ago",
  //   user: { id: 206, name: "NextJsWizard" },
  //   upvotesCount: 12450,
  //   downvotesCount: 30,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 89
  // },
  // // 11. Multi-line comment
  // {
  //   id: 11,
  //   comment: "Here is my feedback:\n1. The avatars look great.\n2. The line-clamp logic is smart.\n3. Make sure to memoize the vote handler!",
  //   createdAt: "2026-03-23T08:00:00.000Z",
  //   createdAgo: "1 hour ago",
  //   user: { id: 207, name: "CodeReviewer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Review" },
  //   upvotesCount: 56,
  //   downvotesCount: 0,
  //   currentUserVote: "UPVOTE",
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 4
  // },
  // // 12. Perfectly Balanced Votes
  // {
  //   id: 12,
  //   comment: "I'm using a similar layout for my POD t-shirt store's customer Q&A section.",
  //   createdAt: "2026-03-23T05:00:00.000Z",
  //   createdAgo: "4 hours ago",
  //   user: { id: 208, name: "TShirtHustler" },
  //   upvotesCount: 50,
  //   downvotesCount: 50,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 0
  // },
  // // 13. Brand New Comment
  // {
  //   id: 13,
  //   comment: "First! Testing the mutation caching.",
  //   createdAt: "2026-03-23T09:48:00.000Z",
  //   createdAgo: "Just now",
  //   user: { id: 209, name: "SpeedyGonzales", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Speed" },
  //   upvotesCount: 0,
  //   downvotesCount: 0,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 0
  // },
  // // 14. Deleted comment with replies
  // {
  //   id: 14,
  //   comment: "[Removed by moderator]",
  //   createdAt: "2026-01-01T12:00:00.000Z",
  //   createdAgo: "3 months ago",
  //   user: { id: 210, name: "RuleBreaker" },
  //   upvotesCount: 0,
  //   downvotesCount: 500,
  //   currentUserVote: null,
  //   deleted: true, // ✅ Changed to true
  //   submissionId: 789,
  //   repliesCount: 15
  // },
  // // 15. Comment containing code/symbols
  // {
  //   id: 15,
  //   comment: "You might want to replace `if (height > lineHeight * 6)` with a ResizeObserver for better responsiveness on mobile devices.",
  //   createdAt: "2026-03-22T20:00:00.000Z",
  //   createdAgo: "13 hours ago",
  //   user: { id: 211, name: "RefactorBot", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bot" },
  //   upvotesCount: 102,
  //   downvotesCount: 1,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 2
  // },
  // // 16. Thematic discussion
  // {
  //   id: 16,
  //   comment: "This comment thread is getting as deep and mysterious as the plot of Silo.",
  //   createdAt: "2026-03-23T06:30:00.000Z",
  //   createdAgo: "3 hours ago",
  //   user: { id: 212, name: "SciFiFanatic" },
  //   upvotesCount: 42,
  //   downvotesCount: 0,
  //   currentUserVote: "UPVOTE",
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 1
  // },
  // // 17. Comment from same author
  // {
  //   id: 17,
  //   comment: "Actually, wait, I figured out the avatar fallback issue. Thanks anyway!",
  //   createdAt: "2026-03-22T10:10:00.000Z",
  //   createdAgo: "1 day ago",
  //   user: { id: 104, name: "Alice Smith", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  //   upvotesCount: 8,
  //   downvotesCount: 0,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 0
  // },
  // // 18. Massive Replies Count
  // {
  //   id: 18,
  //   comment: "Megathread: Post your UI/UX suggestions here.",
  //   createdAt: "2025-10-15T00:00:00.000Z",
  //   createdAgo: "5 months ago",
  //   user: { id: 213, name: "Admin", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" },
  //   upvotesCount: 3000,
  //   downvotesCount: 5,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 1204
  // },
  // // 19. Owner comment
  // {
  //   id: 19,
  //   comment: "Just testing the edit and delete buttons on my own comment block.",
  //   createdAt: "2026-03-23T09:47:00.000Z",
  //   createdAgo: "2 mins ago",
  //   user: { id: 1000, name: "My Own Account", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me" },
  //   upvotesCount: 1,
  //   downvotesCount: 0,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 0
  // },
  // // 20. Short one-word comment
  // {
  //   id: 20,
  //   comment: "Clean.",
  //   createdAt: "2026-03-23T09:30:00.000Z",
  //   createdAgo: "19 mins ago",
  //   user: { id: 214, name: "Minimalist", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Min" },
  //   upvotesCount: 11,
  //   downvotesCount: 0,
  //   currentUserVote: null,
  //   deleted: false,
  //   submissionId: 789,
  //   repliesCount: 0
  // }
];
  const selectedLabel =
    FILTER_OPTIONS.find((x) => x.id === selectedFilter)?.label ?? "Most Recent";

  const rootComments: CommentType[] = commentsResponse?.content || [];
  const [markdownContent, setMarkdownContent] = useState("jahid ## Heading");

  const handleComentSubmit = () => {
    if (markdownContent.length === 0) return alert("Please type something!");    
    console.log("Parent receiving data:", markdownContent);   
  };
  return (
    <div className={cn("flex flex-col border-t border-[#00509233] dark:border-[#FFFFFF33] pt-4 mt-2", className)}>
      
      {/* Input Area */}
      <div className="flex gap-3 items-start w-full">
 
        <div className="flex-1 flex flex-col dark:border-[#FFFFFF33]  focus-within:ring-1 focus-within:ring-[#005092] transition-shadow">
        <TextEditorPrimary 
        value={markdownContent} 
        onChange={setMarkdownContent} 
        onSubmit={handleComentSubmit}
        placeholder="Type your message here..."
      />   
          {/* <textarea
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
          </div> */}
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

      {/* //TODO: coment dami */}
      {/* Comments List */}
      {/* <div className="flex flex-col mt-2 mb-2">
        {isLoading ? (
            <div className="py-4 text-center text-sm text-gray-500">Loading comments...</div>
        ) : rootComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div> */}
      <div className="flex flex-col mt-2 mb-2">
        { damiComents.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {/* View All Comments Button */}
      {/* {!isNestedView && rootComments.length >= 7 && (
        <div className="flex justify-center mt-3 pb-2 pt-1">
          <button
            onClick={onViewAllComments}
            className="text-[13px] font-semibold text-[#008CFF] hover:underline"
          >
            View all {commentsResponse?.totalElements ?? 7} comments →
          </button>
        </div>
      )} */}
         {!isNestedView && damiComents.length >= 5 && (
        <div className="flex justify-center mt-3 pb-2 pt-1">
          <button
            onClick={onViewAllComments}
            className="text-[13px] font-semibold text-[#008CFF] hover:underline"
          >
            View all {damiComents.length ?? 5} comments →
          </button>
        </div>
      )}


    </div>
  );
};
