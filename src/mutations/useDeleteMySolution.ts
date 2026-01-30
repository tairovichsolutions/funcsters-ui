import { QueryKey } from "@/constants/queryKey";
import { apiClient } from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeletePayload {
  languageId: string | number;
  challengeId: string | number;
}

export const useDeleteMySolution = () => {
  const client = useQueryClient();

  const deleteMySolutionfc = async ({
    challengeId,
    languageId,
  }: DeletePayload) => {
    const URL = `/api/delete-community-solution?challengeId=${challengeId}&languageId=${languageId}`;

    const { status, data } = await apiClient.delete(URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { status, data };
  };

  return useMutation({
    mutationFn: deleteMySolutionfc,
    onSuccess: () => {
      client.refetchQueries({ queryKey: [QueryKey.GetMyCommunitySolutions] });
    },
  });
};
