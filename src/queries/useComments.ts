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
    const { data } = await apiClient.get(`/api/comments/submission`, {
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

export const useReplies = (rootId: string | number | null, enabledFlag: boolean) => {
  const fetchReplies = async () => {
    if (!rootId) return [];
    const { data } = await apiClient.get(`/api/comments/${rootId}/replies`);
    return data;
  };

  return useQuery({
    queryKey: [QueryKey.GetReplies, rootId],
    queryFn: fetchReplies,
    enabled: !!rootId && enabledFlag,
  });
};
