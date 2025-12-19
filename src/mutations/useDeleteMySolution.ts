import { QueryKey } from "@/constants/queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface DeletePayload {
  challengeId: string | number;
  languageId: string | number;
}

export const useDeleteMySolution = () => {
  const client = useQueryClient();

  const deleteMySolutionfc = async ({
    challengeId,
    languageId,
  }: DeletePayload) => {
    const URL = `/api/delete-community-solution?challengeId=${challengeId}&languageId=${languageId}`;
    const { status, data } = await axios.delete(URL, {
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
