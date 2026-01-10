/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { useFormik } from "formik";
import { useTheme } from "next-themes";
import { Input } from "@/components/Input";
import { Assets } from "@/constants/assets";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { useLogin } from "@/mutations/useLogin";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "./LoginForm.schema";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { RegistrationLayout } from "@/layouts/RegistrationLayout";

interface loginType {
  email: string;
  password: string;
}

export const LoginFormModal = () => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const router = useRouter();
  const { mutateAsync: loginfc, isPending } = useLogin();
  const { openModal, closeModal } = useAuthModal();
  const initialValues = React.useMemo(
    () => ({
      email: "anas1234@gmail.com",
      password: "Anas1234!",
    }),
    []
  );

  const onSubmit = async (values: loginType) => {
    try {
      const res = await loginfc(values);
      if (res?.status === 200 && res?.data?.user) {
        closeModal();
        router.refresh();
      } else {
        console.error("Unexpected Login response:", res);
      }
    } catch (error: any) {
      console.error("Login Failed :", error);
    }
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    onSubmit: onSubmit,
    validationSchema: LoginSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <RegistrationLayout
      reverse={false}
      image={dark ? Assets.Images.LoginDarkImage : Assets.Images.LoginImage}
      className="overflow-hidden"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center gap-6 w-full "
      >
        <Logo />
        <div className="flex flex-col gap-8 ">
          <h2 className=" font-extrabold text-2xl">Welcome Back!</h2>
          <div className="flex flex-col gap-5">
            <Input
              name="email"
              placeholder="Type here"
              label="Email"
              value={values.email}
              error={errors.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              placeholder="Type here"
              label="Password"
              isPassword
              value={values.password}
              error={errors.password}
              onChange={handleChange}
            />
            <div className="flex justify-end items-center">
              {/* <Checkbox label="Remember me " /> */}
              <button
                type="button"
                onClick={() => openModal("forgotPassword")}
                className="text-destructive font-normal text-xs underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <Button loading={isPending} type="submit">
              Login
            </Button>
            <p className="text-medium-gray font-normal text-xs mt-4">
              Don’t have an account?{" "}
              <button
                onClick={() => openModal("signUp")}
                className="text-primary font-semibold cursor-pointer ml-1 underline "
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </form>
    </RegistrationLayout>
  );
};
