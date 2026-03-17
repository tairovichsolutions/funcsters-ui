/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useFormik } from "formik";
import { useTheme } from "next-themes";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { CustomOtpInput } from "@/components/CustomOtpInput";
import { ResetPasswordSchema } from "./ResetPassword.schema";
import { useAuthModal } from "@/providers/AuthModalsProvider";

export const ResetPasswordFormModal: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { openModal } = useAuthModal();

  const initialValues = {
    otp: "",
  };

  const onSubmit = () => {
    openModal("newPassword");
  };

  const { values, errors, setFieldValue, handleSubmit } = useFormik({
    initialValues,
    onSubmit,
    validationSchema: ResetPasswordSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
  });

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
                jonson32@gmail.com{" "}
                <span className="underline text-primary font-semibold cursor-pointer">
                  Change.
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <CustomOtpInput
                error={errors.otp}
                value={values.otp}
                label="Enter Code"
                onChange={(val) => setFieldValue("otp", val)}
              />

              <p className="text-medium-gray font-normal text-xs text-center">
                Resend code in <span className="">01:30</span>
              </p>

              <Button type="submit" size="lg">
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
