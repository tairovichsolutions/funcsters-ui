import { apiClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/constants/commentQueryKeys";

export const useRootComments = (
  submissionId: string | number,
  enabledFlag: boolean,
  sort: string = "newest",
  page: number = 0,
  size: number = 10
) => {
  const fetchRootComments = async () => {
    const { data } = await apiClient.get(`/api/v1/comments/submission/1?sort=top&page=0&size=10`, {
      params: { submissionId, sort, page, size },
    });
    return data;
  };

  return useQuery({
    queryKey: [QueryKey.GetRootComments, submissionId, sort, page, size],
    queryFn: fetchRootComments,
    enabled: !!submissionId && enabledFlag,
  });
};
///todo:real from beckend for now coment
// export const useReplies = (rootId: string | number | null, enabledFlag: boolean) => {
//   const fetchReplies = async () => {
//     if (!rootId) return [];
//     const { data } = await apiClient.get(`/api/comments/${rootId}/replies`);
//     return data;
//   };

//   return useQuery({
//     queryKey: [QueryKey.GetReplies, rootId],
//     queryFn: fetchReplies,
//     enabled: !!rootId && enabledFlag,
//   });
// };


export const useReplies = (rootId: string | number | null, enabledFlag: boolean) => {
  const fetchReplies = async () => {
    if (!rootId) return [];
    
    // --- REAL API CALL (Commented out for now) ---
    // const { data } = await apiClient.get(`/api/comments/${rootId}/replies`);
    // return data;

    // --- MOCK API CALL ---
    // 1. Simulate an 800ms network delay to test your UI loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. Return the dummy replies
 return [
      // 1. Standard Reply (The Baseline)
      {
        id: Number(`${rootId}101`), 
        comment: "This is a standard nested reply! The component structure is working perfectly.",
        createdAt: new Date().toISOString(),
        createdAgo: "10 mins ago",
        user: {
          id: 901,
          name: "Reply Guy",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Reply"
        },
        upvotesCount: 5,
        downvotesCount: 0,
        currentUserVote: null,
        deleted: false,
        submissionId: 789,
        repliesCount: 0,
      },

      // 2. Missing Avatar (Tests your DisplayAvatar FallbackName logic)
      {
        id: Number(`${rootId}102`),
        comment: "I totally agree with this point. Notice I don't have an avatar image.",
        createdAt: new Date(Date.now() - 300000).toISOString(), 
        createdAgo: "5 mins ago",
        user: {
          id: 902,
          name: "Agreeable Alice",
          // No avatarUrl provided
        },
        upvotesCount: 2,
        downvotesCount: 0,
        currentUserVote: "UPVOTE", // Tests the blue upvote fill
        deleted: false,
        submissionId: 789,
        repliesCount: 0,
      },

      // 3. Deleted Reply (Tests the early return `if (comment.deleted)` block)
      {
        id: Number(`${rootId}103`),
        comment: "This text shouldn't render at all.",
        createdAt: new Date(Date.now() - 86400000).toISOString(), 
        createdAgo: "1 day ago",
        user: {
          id: 903,
          name: "Regretful Poster",
        },
        upvotesCount: 0,
        downvotesCount: 0,
        currentUserVote: null,
        deleted: false, // Triggers the italic [deleted] UI
        submissionId: 789,
        repliesCount: 0,
      },

      //
      {
        id: Number(`${rootId}104`),
        comment: "I completely disagree. I think this approach is entirely wrong.",
        createdAt: new Date(Date.now() - 7200000).toISOString(), 
        createdAgo: "2 hours ago",
        user: {
          id: 904,
          name: "Contrarian Chris",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris"
        },
        upvotesCount: 1,
        downvotesCount: 15,
        currentUserVote: "DOWNVOTE",
        deleted: false,
        submissionId: 789,
        repliesCount: 0,
      },

     
      {
        id: Number(`${rootId}105`),
        comment: "reply exceeds six lines of text, it should automatically hide the overflow and display a 'Read more' button. Clicking that button toggles the `isExpanded` state, allowing the user to read this entire massive block of text without leaving the page or ruining the indented layout of the reply chain. Let's see if it wraps properly!",
        createdAt: new Date(Date.now() - 14400000).toISOString(), 
        createdAgo: "4 hours ago",
        user: {
          id: 905,
          name: "Verbose Victor",
        },
        upvotesCount: 12,
        downvotesCount: 1,
        currentUserVote: null,
        deleted: false,
        submissionId: 789,
        repliesCount: 0,
      },

     
      {
        id: Number(`${rootId}106`),
        comment: "Wait, can replies have their own replies? Let's find out.",
        createdAt: new Date(Date.now() - 3600000).toISOString(), 
        createdAgo: "1 hour ago",
        user: {
          id: 906,
          name: "Inception User",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Inception"
        },
        upvotesCount: 8,
        downvotesCount: 0,
        currentUserVote: null,
        deleted: false,
        submissionId: 789,
        repliesCount: 2,
      },

     
     
      {
        id: Number(`${rootId}107`),
        comment: "This is my own reply. I should see the Edit (Pencil) and Delete (Trash) buttons here, and the voting arrows should be disabled.",
        createdAt: new Date().toISOString(), 
        createdAgo: "Just now",
        user: {
          id: 9999, 
          name: "My Account",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me"
        },
        upvotesCount: 0,
        downvotesCount: 0,
        currentUserVote: null,
        deleted: false,
        submissionId: 789,
        repliesCount: 0,
      }
    ];
  };

  return useQuery({

    queryKey: ['GetReplies', rootId], 
    queryFn: fetchReplies,
    enabled: !!rootId && enabledFlag,
  });
};