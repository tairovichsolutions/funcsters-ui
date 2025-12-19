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
import { NewPasswordSchema } from "./NewPassword.schema";
import { useAuthModal } from "@/providers/AuthModalsProvider";

export const NewPasswordFormModal = () => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { openModal } = useAuthModal();

  const initialValues = React.useMemo(
    () => ({
      password: "",
      confirmPassword: "",
    }),
    []
  );
  const onSubmit = () => {
    openModal("congratulation");
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    onSubmit: onSubmit,
    validationSchema: NewPasswordSchema,
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
            <h2 className=" font-extrabold text-2xl">Set New Password!</h2>
            <div className="flex flex-col gap-5">
              <Input
                name="password"
                placeholder="Type here"
                label="Password"
                isPassword
                value={values.password}
                error={errors.password}
                onChange={handleChange}
              />
              <Input
                name="confirmPassword"
                placeholder="Type here"
                label="Retype New Password"
                isPassword
                value={values.confirmPassword}
                error={errors.confirmPassword}
                onChange={handleChange}
              />

              <Button type="submit">Save Password</Button>
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
        <div className=" w-[50%] flex items-center justify-center  p-6">
          <img
            src={
              dark
                ? Assets.Images.NewPasswordDarkImage
                : Assets.Images.NewPasswordImage
            }
            className="object-contain w-full h-80 "
          />
        </div>
      </div>
    </form>
  );
};
