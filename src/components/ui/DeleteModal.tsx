/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Modal } from "./modal";
import { useTheme } from "next-themes";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  open: boolean;
  title?: string;
  isPending: boolean;
  onClose: () => void;
  description?: string;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  isPending,
  onConfirm,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {  
  const { theme } = useTheme();
  const dark = theme === "dark";
  const loginSuccessImgSrc = dark
    ? Assets.Images.InboxCleanupDarkV2
    : Assets.Images.InboxCleanup;
  return (
    <Modal open={open} className="dark:bg-[#181A1D]" onClose={onClose} size="md">
      <div className=" flex flex-col gap-4 justify-center  items-center">
        <div>
          <img src={loginSuccessImgSrc} className="max-h-48  "   alt="login_successfully_image" />
        </div>
        <div className="flex flex-col gap-2 px-5">
          <h2 className="font-extrabold text-3xl text-center">{title}</h2>
          <p className="font-normal text-sm text-center dark:text-[#AFAFAF]  text-medium-gray">
            {description}
          </p>
        </div>

        <div className=" grid w-full grid-cols-2  gap-3 mt-3 px-5">
          <Button
            className=" w-full! border h-11! border-[#0000004D] dark:bg-[#CDDDEE] dark:hover:bg-[#CDDDEE] dark:border-gray-400 dark:text-[#4D4D4D] text-[#000000B2]"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            loading={isPending}
            onClick={onConfirm}
            className="bg-[#D7263D] h-11! hover:bg-red-700 text-white w-full!"
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
