/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLogin } from "@/mutations/useLogin";
import { Button, Checkbox, Input, Logo, Modal } from "@/components";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { LoginSchema } from "@/containers/AuthModals/LoginForm.schema";

interface loginType {
  email: string;
  password: string;
}
const HomeLoginModal = ({ open, onClose }: any) => {
  const router = useRouter();
  const { mutateAsync: loginfc, isPending } = useLogin();
  const { openModal } = useAuthModal();
  const initialValues = React.useMemo(
    () => ({
      email: "",
      password: "",
    }),
    []
  );

  const onSubmit = async (values: loginType) => {
    try {
      const res = await loginfc(values);
      if (res?.status === 200 && res?.data?.user) {
        openModal("loginSuccessfully");
        router.refresh();
      } else {
        console.error("Unexpected response:", res);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login Failed!");
    }
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    onSubmit: onSubmit,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    initialValues: initialValues,
    validationSchema: LoginSchema,
  });
  return (
    <Modal open={open} onClose={onClose} className="bg-black w-[430px]! ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center gap-6  "
      >
        <Logo />
        <div className="flex flex-col gap-4 ">
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
            <div className="flex justify-between items-center">
              <Checkbox label="Remember me " />
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
    </Modal>
  );
};

export default HomeLoginModal;
