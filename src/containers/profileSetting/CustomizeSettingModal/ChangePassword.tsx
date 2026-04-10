"use client";
import React from "react";
import { useFormik } from "formik";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { ChangePasswordSchema } from "./ChangePassword.schema";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";

export const ChangePassword = () => {
  const { openModal: openSettingModal, closeModal } = useProfileSettingModal();
  const { openModal: openAuthModal } = useAuthModal();
  const initialValues = React.useMemo(
    () => ({
      newPassword: "",
      currentPassword: "",
      confirmPassword: "",
    }),
    []
  );
  const onSubmit = () => {
    openSettingModal("ChangePasswordSuccessfullyModal");
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    onSubmit: onSubmit,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    initialValues: initialValues,
    validationSchema: ChangePasswordSchema,
  });
  return (
    <form onSubmit={handleSubmit} className=" h-full flex flex-col space-y-5">
      <div className=" space-y-1">
        <h2 className=" font-semibold text-xl">Change Password</h2>
        <p className=" text-xs">Edit Your Password </p>
      </div>

      <div className="flex flex-col items-center  h-full  gap-5 ">
        <div className=" w-full">
          <Input
            isPassword
            name="currentPassword"
            onChange={handleChange}
            label="Current Password"
            value={values.currentPassword}
            error={errors.currentPassword}
            placeholder="Enter current password"
          />

          <div className=" flex  justify-end mt-3">
            <button
              type="button"
              onClick={() => openAuthModal("forgotPassword")}
              className="text-destructive font-normal text-[13px]  cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        </div>
        <Input
          isPassword
          name="newPassword"
          label="New Password"
          onChange={handleChange}
          value={values.newPassword}
          error={errors.newPassword}
          placeholder="Enter new password"
        />
        <Input
          isPassword
          name="confirmPassword"
          label="Confirm Password"
          onChange={handleChange}
          value={values.confirmPassword}
          error={errors.confirmPassword}
          placeholder="Enter confirm password"
        />

        <div className="w-full  mt-auto grid grid-cols-2 items-center justify-center gap-4">
          <Button
            onClick={() => closeModal()}
            variant="outline"
            className="border-[#BCBCBC] dark:border-[#565F67] dark:text-[#E7E8E9] hover:bg-[#BCBCBC]/10 text-[#4D4D4D]"
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};
