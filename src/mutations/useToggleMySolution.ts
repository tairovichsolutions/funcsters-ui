import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@/constants/queryKey";

interface payloadType {
  challengeId: string | number;
  languageId: string | number;
  visible: boolean;
}
export const useToggleMySolution = () => {
  const client = useQueryClient();
  const togglefc = async (payload: payloadType) => {
    const URL = "/api/toggle-my-solution";

    const { status, data } = await axios.patch(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: togglefc,
    onSuccess: () => {
      client.refetchQueries({ queryKey: [QueryKey.GetMyCommunitySolutions] });
    },
  });
};
