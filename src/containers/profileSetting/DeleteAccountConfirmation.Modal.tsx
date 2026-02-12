/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components";
import { useAuthModal } from "@/providers/AuthModalsProvider";

export const DeleteAccountConfirmationModal = () => {
  const { closeModal } = useAuthModal();

  const [confirmation, setConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValid = confirmation === "I understand";
  const showError = submitted && !isValid;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isValid) return;

    closeModal();
  };

  return (
    <div className="p-8 flex flex-col gap-4 justify-center items-center">
      <div>
        <img src={Assets.Images.ConfirmationImage} alt="confirmation_image" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-[27px] leading-none text-center">
          Delete Account
        </h2>
        <p className="font-normal text-[13px] max-w-md text-center text-medium-gray">
          Deleting your account will permanently remove all your data, progress,
          and achievements. This action cannot be undone. Please type{" "}
          <span className="font-semibold text-nowrap text-primary">
            I understand
          </span>{" "}
          below to confirm.
        </p>
      </div>

      <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
        <Input
          name="confirmation"
          label="Type"
          value={confirmation}
          onChange={(e: any) => setConfirmation(e.target.value)}
          // placeholder='Type "I understand" here'
          error={
            showError ? "You must type 'I understand' to confirm" : undefined
          }
        />

        <div className="grid grid-cols-2 items-center justify-center gap-4 w-full">
          <Button
            type="button"
            className="w-full! border h-11! border-[#0000004D] dark:border-gray-400 dark:text-gray-400 text-[#000000B2]"
            variant="outline"
            onClick={() => closeModal()}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="destructive"
            className="h-11!"
            disabled={!isValid}
          >
            Yes, Delete
          </Button>
        </div>
      </form>
    </div>
  );
};
