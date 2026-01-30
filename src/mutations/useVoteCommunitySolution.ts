import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axiosClient";

interface payloadType {
  vote: string;
  challengeId: string | number;
  languageId: string | number;
  solutionId: string | number;
}

export const useVoteCommunitySolution = () => {
  const voteSolutionfc = async (payload: payloadType) => {
    const URL = `/api/vote-community-solution?challengeId=${payload.challengeId}&languageId=${payload.languageId}&solutionId=${payload.solutionId}`;

    const body = { vote: payload?.vote };

    const { status, data } = await apiClient.post(URL, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { status, data };
  };

  return useMutation({
    mutationFn: voteSolutionfc,
  });
};
