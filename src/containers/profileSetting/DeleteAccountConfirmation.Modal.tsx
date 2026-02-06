/* eslint-disable @next/next/no-img-element */
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import React from "react";

export const DeleteAccountConfirmationModal = () => {
  const [reason, setReason] = React.useState("I Understand");
  const { closeModal } = useAuthModal();
  const onDelete = () => {
    closeModal();
  };
  return (
    <div className="p-8 flex flex-col gap-4 justify-center items-center">
      <div>
        <img src={Assets.Images.ConfirmationImage} alt="" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-[27px]  leading-none text-black text-center">
          Account Deletion?
        </h2>
        <p className="font-normal text-[13px] max-w-md text-center text-medium-gray">
          Are you sure you want to delete your account? This action will
          permanently remove all your data, progress, and achievements from
          Funcsters, and you won’t be able to recover them later.
        </p>
      </div>

      <div className="w-full">
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          label="Type"
          placeholder="Enter your reason"
          onFocus={(e) => {
            const len = e.target.value.length;
            e.target.setSelectionRange(len, len);
          }}
        />
      </div>
      <div className=" grid grid-cols-2 items-center justify-center gap-4  w-full">
        <Button
          className=" w-full! border h-11! border-[#0000004D] dark:border-gray-400 dark:text-gray-400 text-[#000000B2]"
          variant="outline"
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
        <Button
          disabled={!reason.trim()}
          variant="destructive"
          className="h-11!"
          onClick={onDelete}
        >
          Yes,Delete
        </Button>
      </div>
    </div>
  );
};
