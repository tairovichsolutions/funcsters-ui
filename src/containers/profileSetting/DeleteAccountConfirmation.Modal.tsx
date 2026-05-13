/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { useDeleteAccount } from "@/mutations/useDeleteAccount";

export const DeleteAccountConfirmationModal = () => {
  const { closeModal } = useAuthModal();
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const [confirmation, setConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValid = confirmation === "I understand";
  const showError = submitted && !isValid;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage("");

    if (!isValid) return;

    deleteAccount(undefined, {
        onSuccess: () => {
            closeModal();
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message || "Something went wrong. Please try again.";
            setErrorMessage(message);
        }
    });
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
          Deleting your account will <span className="font-semibold text-primary">permanently remove all your data</span>, 
          including solutions, comments, history, and achievements. This action is irreversible. 
          Please type{" "}
          <span className="font-semibold text-nowrap text-primary">
            I understand
          </span>{" "}
          below to confirm.
        </p>
      </div>

      <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
        <Input
          name="confirmation"
          label="Confirmation"
          value={confirmation}
          onChange={(e: any) => setConfirmation(e.target.value)}
          placeholder='Type "I understand"'
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
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="destructive"
            className="h-11!"
            disabled={!isValid || isPending}
          >
            {isPending ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-[13px] font-medium text-center">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
};
