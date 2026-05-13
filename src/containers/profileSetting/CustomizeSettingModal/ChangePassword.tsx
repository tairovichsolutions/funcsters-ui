"use client";
import React from "react";
import { useFormik } from "formik";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";

import { ChangePasswordSchema } from "./ChangePassword.schema";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import * as Yup from "yup";

const SetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export const ChangePassword = () => {
  const { closeModal } = useProfileSettingModal();

  const { data, refetch } = useGetUserProfile();
  const user = data?.data?.user;
  const hasPassword = user?.hasPassword ?? true;

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = React.useState<string | null>(null);

  const initialValues = React.useMemo(
    () => ({
      newPassword: "",
      currentPassword: "",
      confirmPassword: "",
    }),
    [],
  );

  const onSubmitChangePassword = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    setApiError(null);
    setApiSuccess(null);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      if (res.ok) {
        resetForm();
        setApiSuccess("Password changed successfully.");
      } else {
        const body = await res.json();
        setApiError(body.message || "Failed to change password.");
      }
    } catch {
      setApiError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitSetPassword = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    setApiError(null);
    setApiSuccess(null);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: values.newPassword }),
      });
      if (res.ok) {
        refetch();
        resetForm();
        setApiSuccess("Password set successfully.");
      } else {
        const body = await res.json();
        setApiError(body.message || "Failed to set password.");
      }
    } catch {
      setApiError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { values, errors, handleChange, handleSubmit, resetForm } = useFormik({
    onSubmit: hasPassword ? onSubmitChangePassword : onSubmitSetPassword,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    initialValues: initialValues,
    validationSchema: hasPassword ? ChangePasswordSchema : SetPasswordSchema,
  });

  return (
    <form onSubmit={handleSubmit} className=" h-full flex flex-col space-y-5">
      <div className=" space-y-1">
        <h2 className=" font-semibold text-xl">
          {hasPassword ? "Change Password" : "Set Password"}
        </h2>
        <p className=" text-xs">
          {hasPassword
            ? "Edit Your Password "
            : "You signed up via a social account. Set a password to also log in with email."}
        </p>
      </div>

      <div className="flex flex-col items-center  h-full  gap-5 ">
        {hasPassword && (
          <div className=" w-full">
            <Input
              isPassword
              name="currentPassword"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setApiError(null);
                setApiSuccess(null);
                handleChange(e);
              }}
              label="Current Password"
              value={values.currentPassword}
              error={errors.currentPassword}
              placeholder="Enter current password"
            />
          </div>
        )}
        <Input
          isPassword
          name="newPassword"
          label="New Password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setApiError(null);
            setApiSuccess(null);
            handleChange(e);
          }}
          value={values.newPassword}
          error={errors.newPassword}
          placeholder="Enter new password"
        />
        <Input
          isPassword
          name="confirmPassword"
          label="Confirm Password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setApiError(null);
            setApiSuccess(null);
            handleChange(e);
          }}
          value={values.confirmPassword}
          error={errors.confirmPassword}
          placeholder="Enter confirm password"
        />

        {/* Inline error/success message below confirm password */}
        {apiError && (
          <p className="w-full text-destructive text-[12px] font-medium -mt-3 animate-in fade-in duration-200">
            {apiError}
          </p>
        )}
        {apiSuccess && (
          <p className="w-full text-green-600 dark:text-green-400 text-[12px] font-medium -mt-3 animate-in fade-in duration-200">
            {apiSuccess}
          </p>
        )}

        <div className="w-full  mt-auto grid grid-cols-2 items-center justify-center gap-4">
          <Button
            onClick={() => closeModal()}
            variant="outline"
            className="border-[#BCBCBC] dark:border-[#565F67] dark:text-[#E7E8E9] hover:bg-[#BCBCBC]/10 text-[#4D4D4D]"
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            {hasPassword ? "Change Password" : "Set Password"}
          </Button>
        </div>
      </div>
    </form>
  );
};
