/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import { Input } from "@/components/Input";
import { Logo } from "@/components/ui/logo";
import { useRouter } from "next/navigation";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { SignUpSchema } from "./SignUpForm.schema";
import { useRigester } from "@/mutations/useRegister";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { RegistrationLayout } from "@/layouts/RegistrationLayout";

export const SignUpFormModal = () => {
  const { openModal } = useAuthModal();
  const router = useRouter();

  const initialValues = React.useMemo(
    () => ({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    }),
    []
  );

  const { mutateAsync: rigesterfc, isPending } = useRigester();
  const onSubmit = async (values: any) => {
    try {
      const res = await rigesterfc(values);
      if (res?.status === 200 && res?.data?.user) {
        openModal("signUpSuccessfully");
        toast.success("SignUp Successfully");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login Faild");
    }
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    onSubmit: onSubmit,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    initialValues: initialValues,
    validationSchema: SignUpSchema,
  });

  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <RegistrationLayout
      image={dark ? Assets.Images.SignUpDarkImage : Assets.Images.SignUpImage}
      reverse={true}
      className="overflow-hidden!"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center gap-7 w-full h-full "
      >
        <Logo />
        <div className="flex flex-col gap-6 ">
          <h2 className=" font-extrabold text-2xl">Create Account!</h2>
          <div className="flex flex-col gap-5">
            <Input
              name="username"
              placeholder="Type here"
              label="User Name"
              value={values.username}
              error={errors.username}
              onChange={handleChange}
            />

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
            <Input
              name="confirmPassword"
              placeholder="Type here"
              label="Confirm Password"
              isPassword
              value={values.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
            />

            <Button loading={isPending} type="submit">
              Create Account
            </Button>
            <p className="text-medium-gray font-normal text-xs ">
              Already have an account?{" "}
              <button
                onClick={() => openModal("login")}
                className="text-primary font-semibold cursor-pointer ml-1 underline "
              >
                Login?
              </button>
            </p>
          </div>
        </div>
      </form>
    </RegistrationLayout>
  );
};
