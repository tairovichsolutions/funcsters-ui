/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useFormik } from "formik";
import { useTheme } from "next-themes";
import { Input } from "@/components/Input";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { ForgotpasswordSchema } from "./ForgotPassword.schema";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { useForgotPassword } from "@/mutations/useForgotPassword";

export const ForgotPasswordFormModal = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const { openModal, setResetEmail } = useAuthModal();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { mutateAsync: forgotPasswordFc, isPending } = useForgotPassword();

  const initialValues = React.useMemo(
    () => ({
      email: "",
    }),
    []
  );
  const onSubmit = async (values: { email: string }) => {
    try {
      setApiError(null);
      const res = await forgotPasswordFc(values);
      if (res?.status === 200) {
        setResetEmail(values.email);
        openModal("resetPassword");
      } else {
        setApiError(res?.data?.message || "Failed to send reset instructions");
      }
    } catch (error: any) {
      setApiError(error?.response?.data?.message || "Failed to send reset instructions");
    }
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    onSubmit: onSubmit,
    validationSchema: ForgotpasswordSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
  });
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between ">
        <div className="flex flex-col gap-8 w-[50%] p-6 shadow-2xl">
          <Logo />
          <div className="flex flex-col gap-8 ">
            <h2 className="font-extrabold text-2xl">Forget Password!</h2>
            <div className="flex flex-col gap-5">
              <Input
                name="email"
                placeholder="Type here"
                label="Enter Your Email"
                value={values.email}
                error={apiError || errors.email}
                onChange={(e) => {
                  setApiError(null);
                  handleChange(e);
                }}
              />
              <Button loading={isPending} type="submit">Reset Password</Button>
              <div
                onClick={() => openModal("login")}
                className="cursor-pointer flex items-center gap-2 text-medium-gray text-xs font-normal mt-3  "
              >
                <ChevronLeft size={16} />
                Back to login
              </div>
            </div>
          </div>
        </div>
        <div className=" w-[50%]  p-6">
          <img
            src={
              dark
                ? Assets.Images.ForgotPasswordImageDark
                : Assets.Images.ForgotPasswordImage
            }
            className="object-contain w-full h-80 "
          />
        </div>
      </div>
    </form>
  );
};
