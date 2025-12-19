import axios from "axios";
import { QueryKey } from "@/constants/queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface payloadType {
  challengeId: string | number;
  languageId: string | number;
  solutionId: string | number;
  vote: string;
}

export const useVoteCommunitySolution = () => {
  const client = useQueryClient();

  const voteSolutionfc = async (payload: payloadType) => {
    const URL = `/api/vote-community-solution?challengeId=${payload.challengeId}&languageId=${payload.languageId}&solutionId=${payload.solutionId}`;

    const body = { vote: payload?.vote };

    const { status, data } = await axios.post(URL, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { status, data };
  };

  return useMutation({
    mutationFn: voteSolutionfc,
    onSuccess: () => {
      client.refetchQueries({ queryKey: [QueryKey.GetAllCommunitySolutions] });
    },
  });
};
