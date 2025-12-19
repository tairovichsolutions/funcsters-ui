/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useFormik } from "formik";
import { useTheme } from "next-themes";
import { Input } from "@/components/Input";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { ForgotpasswordSchema } from "./ForgotPassword.schema";
import { useAuthModal } from "@/providers/AuthModalsProvider";

export const ForgotPasswordFormModal = () => {
  const { openModal } = useAuthModal();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const initialValues = React.useMemo(
    () => ({
      email: "",
    }),
    []
  );
  const onSubmit = () => {
    openModal("emailSend");
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
                error={errors.email}
                onChange={handleChange}
              />
              <Button type="submit">Reset Password</Button>
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
