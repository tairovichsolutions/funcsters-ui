/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useFormik } from "formik";
import { useTheme } from "next-themes";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { CustomOtpInput } from "@/components/CustomOtpInput";
import { ResetPasswordSchema } from "./ResetPassword.schema";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { useVerifyOtp } from "@/mutations/useVerifyOtp";
import { useForgotPassword } from "@/mutations/useForgotPassword";
import toast from "react-hot-toast";

export const ResetPasswordFormModal: React.FC = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { openModal, resetEmail, setResetOtp } = useAuthModal();
  const { mutateAsync: verifyOtpFc, isPending } = useVerifyOtp();
  const { mutateAsync: forgotPasswordFc, isPending: isResending } = useForgotPassword();

  const initialValues = {
    otp: "",
  };

  const onSubmit = async (values: { otp: string }) => {
    try {
      setApiError(null);
      const res = await verifyOtpFc({ email: resetEmail, otp: values.otp });
      if (res?.status === 200) {
        setResetOtp(values.otp);
        openModal("newPassword");
      } else {
        setApiError(res?.data?.message || "Failed to verify OTP");
      }
    } catch (error: any) {
      setApiError(error?.response?.data?.message || "Invalid OTP");
    }
  };

  const { values, errors, setFieldValue, handleSubmit } = useFormik({
    initialValues,
    onSubmit,
    validationSchema: ResetPasswordSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
  });

  const onResend = async () => {
    try {
      const res = await forgotPasswordFc({ email: resetEmail });
      if (res?.status === 200) {
        setFieldValue("otp", "");
        toast.success("If applicable, a new code has been sent.");
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between">
        <div className="w-[50%] flex justify-center items-center p-6">
          <img
            src={
              dark
                ? Assets.Images.ResetPasswordDarkImage
                : Assets.Images.ResetPasswordImage
            }
            className="object-cover w-full h-80"
          />
        </div>

        <div className="flex flex-col gap-7 w-[50%] p-6 shadow-2xl">
          <Logo />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-extrabold text-2xl">Reset Password!</h2>
              <p className="font-normal text-xs">
                {resetEmail}{" "}
                <span onClick={() => openModal("forgotPassword")} className="underline text-primary font-semibold cursor-pointer">
                  Change.
                </span>
              </p>
              <p className="font-normal text-[11px] text-medium-gray italic mt-1">
                If an account with this email exists and supports password login, you'll receive a reset code shortly.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <CustomOtpInput
                error={apiError || errors.otp}
                value={values.otp}
                label="Enter Code"
                onChange={(val) => {
                  setApiError(null);
                  setFieldValue("otp", val);
                }}
              />

              <p className="text-medium-gray font-normal text-xs text-center">
                Didn't receive the code? <span onClick={onResend} className="underline text-primary font-semibold cursor-pointer">{isResending ? "Resending..." : "Resend code"}</span>
              </p>

              <Button loading={isPending} type="submit" size="lg">
                Continue
              </Button>

              <div
                onClick={() => openModal("login")}
                className="cursor-pointer flex items-center gap-2 text-medium-gray text-xs font-normal mt-3"
              >
                <ChevronLeft size={16} />
                Back to login
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
