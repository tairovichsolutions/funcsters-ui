import { apiClient } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

interface ForgotPasswordPayload {
  email: string;
}

export const useForgotPassword = () => {
  const forgotPassword = async (payload: ForgotPasswordPayload) => {
    const URL = "/api/auth/forgot-password";
    const { status, data } = await apiClient.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: forgotPassword,
  });
};
