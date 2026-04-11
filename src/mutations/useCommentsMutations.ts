import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axiosClient";
import toast from "react-hot-toast";
import { QueryKey } from "@/constants/commentQueryKeys";

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      submissionId: number;
      comment: string;
      parentId?: number;
    }) => {
      const { data } = await apiClient.post("/api/comments", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GetRootComments] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.GetReplies] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add comment");
    },
  });
};

export const useEditComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { data } = await apiClient.put(`/api/comments/${id}`, { content });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GetRootComments] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.GetReplies] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to edit comment");
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/api/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GetRootComments] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.GetReplies] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete comment");
    },
  });
};

export const useVoteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type }: { id: number; type: "UPVOTE" | "DOWNVOTE" }) => {
      await apiClient.post(`/api/comments/${id}/vote?type=${type}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GetRootComments] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.GetReplies] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to vote");
    },
  });
};
