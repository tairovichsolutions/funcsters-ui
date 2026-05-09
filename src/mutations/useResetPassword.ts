import { apiClient } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export const useResetPassword = () => {
  const resetPassword = async (payload: ResetPasswordPayload) => {
    const URL = "/api/auth/reset-password";
    const { status, data } = await apiClient.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: resetPassword,
  });
};
