/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export const useRunCode = () => {
  const runCodefc = async (payload: any) => {
    const URL = "/api/execution/run";

    const { status, data } = await axios.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: runCodefc,
  });
};
