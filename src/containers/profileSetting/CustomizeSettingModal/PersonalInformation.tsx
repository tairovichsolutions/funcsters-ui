/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { cn } from "@/lib";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import countryList from "react-select-country-list";
import { SelectBox } from "@/components/ui/select-box";
import { ProfileAvatarUploader } from "./ProfileAvatarUploader";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import { useUpdateProfile } from "@/mutations/useUpdateProfile";
import { useProfileAvatar } from "@/mutations/useProfileAvatar";
import { PersonalInformationSchema } from "./PersonalInformationSchema";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";

type PersonalInformationFormValues = {
  email: string;
  country: string;
  username: string;
  occupation: string;
};

export const PersonalInformation = () => {
  const { closeModal } = useProfileSettingModal();

  const { data, isLoading: isProfileLoading } = useGetUserProfile();
  const userData = data?.data?.user;

  const { mutateAsync: updateProfilefc, isPending: isProfileSaving } =
    useUpdateProfile();

  const { mutateAsync: uploadAvatar, isPending: isAvatarSaving } =
    useProfileAvatar();

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  const options = React.useMemo(() => {
    return countryList()
      .getData()
      .map((country) => ({
        label: country.label,
        startIcon: (
          <img
            src={`https://flagcdn.com/24x18/${country.value.toLowerCase()}.png`}
            alt={country.label}
            className="w-5 h-5 rounded-sm object-cover"
          />
        ),
        value: country.label,
        code: country.value,
      }));
  }, []);

  const initialValues = React.useMemo<PersonalInformationFormValues>(
    () => ({
      username: userData?.username || "",
      email: userData?.email || "",
      country: userData?.country || "",
      occupation: userData?.occupation || "",
    }),
    [userData],
  );
  const onSubmit = async (values: PersonalInformationFormValues) => {
    if (!userData?.id) return;

    const isUserNameChange = userData?.username !== values?.username;

    const selectedCountry = options.find((c) => c.value === values.country);
    const countryCode = selectedCountry?.code?.toLowerCase();
    const flagUrl = countryCode ? `https://flagcdn.com/24x18/${countryCode}.png` : "";

    try {
      await updateProfilefc({
        ...values,
        countryFlag: flagUrl,
        isUserNameChange: isUserNameChange,
      });
      if (avatarFile) {
        await uploadAvatar({ file: avatarFile });
      }
      // if (profileRes?.status === 200) {
      //   toast.success(profileRes?.data?.message ?? "Profile updated");
      // } else {
      //   toast.success("Profile updated");
      // }
      setAvatarFile(null);
      closeModal();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    }
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik<PersonalInformationFormValues>({
    initialValues,
    onSubmit,
    validationSchema: PersonalInformationSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  });

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
  };

  const handleReset = () => {
    resetForm();
    setAvatarFile(null);
  };

  const isAnySaving = isProfileSaving || isAvatarSaving;

  return (
    <div className="flex flex-col  h-full gap-5">
      <div className=" space-y-1">
        <h2 className=" font-semibold text-xl">Personal Information</h2>
        <p className=" text-xs">Edit Your personal Information </p>
      </div>
      <div className=" flex justify-center items-center">
        <ProfileAvatarUploader
          username={userData?.username}
          avatarUrl={userData?.avatarUrl ?? null}
          pendingFile={avatarFile}
          onChange={handleAvatarChange}
          loading={isAnySaving || isProfileLoading}
        />
      </div>

      <form onSubmit={handleSubmit} className="h-full w-full">
        <div className="flex flex-col items-center justify-center gap-5 px-3 h-full">
          <Input
            // disabled
            name="username"
            value={values.username}
            label="Username"
            onChange={handleChange}
            error={errors.username}
            placeholder="Enter User Name"
          />
          <Input
            disabled
            name="email"
            value={values.email}
            label="Email"
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter Your Email"
          />

          <div className="grid grid-cols-2 items-center w-full gap-5 mb-3">
            <SelectBox
              className={cn(
                "! border border-input-border shadow-none!   ",
                values.country
                  ? "bg-primary/10! text-secondary! dark:text-white! "
                  : "bg-input-background!",
              )}
              name="country"
              label="Country"
              options={options}
              value={values.country}
              onValueChange={(value) => setFieldValue("country", value)}
              error={errors.country}
              placeholder="Select your country"
            />

            <Input
              name="occupation"
              value={values.occupation}
              label="Occupation (Optional)"
              onChange={handleChange}
              error={errors.occupation}
              placeholder="Enter your occupation "
            />
          </div>

          <div className="grid grid-cols-2 w-full items-center justify-center gap-4 pb-3 mt-auto">
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              className="border-[#BCBCBC] dark:border-[#565F67] dark:text-[#E7E8E9] hover:bg-[#BCBCBC]/10 text-[#4D4D4D]"
            >
              Reset Changes
            </Button>

            <Button loading={isAnySaving} type="submit">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
