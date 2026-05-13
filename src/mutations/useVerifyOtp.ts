import { apiClient } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export const useVerifyOtp = () => {
  const verifyOtp = async (payload: VerifyOtpPayload) => {
    const URL = "/api/auth/verify-otp";
    const { status, data } = await apiClient.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  };

  return useMutation({
    mutationFn: verifyOtp,
  });
};
