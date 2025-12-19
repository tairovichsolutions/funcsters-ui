/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, FocusText, Iconify, Modal } from "@/components";
import { Assets } from "@/constants/assets";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const ShareIcon = ({ name }: { name: string }) => (
  <div className="border p-2 cursor-pointer border-[#005092] text-[#005092] dark:text-white bg-[#0050921A] size-9 rounded-full flex justify-center items-center dark:border-[#FFFFFF]">
    <Iconify iconName={name} />
  </div>
);

export const SolutionSubmittedModal = ({ open, onClose, xpCount }: any) => {
  const shareIcons = [
    "iconoir:facebook",
    "iconoir:twitter",
    "basil:linkedin-outline",
    "solar:link-broken",
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-5 px-5">
        <img
          src={Assets.Images.SolutionSubmitted}
          alt="Solution Submitted"
          className="max-h-48"
        />

        <h4 className="text-3xl font-bold">Solution Submitted!</h4>

        <p className="text-sm text-center px-5">
          <FocusText>Congratulations!</FocusText> You’ve successfully solved
          this challenge and earned your reward.
        </p>

        <div className="grid grid-cols-2 w-full gap-5">
          <div className="flex flex-col gap-2.5">
            <h6 className="text-sm font-medium text-[#005092] dark:text-white">
              Share your achievement on
            </h6>

            <div className="flex items-center gap-3">
              {shareIcons.map((icon) => (
                <ShareIcon key={icon} name={icon} />
              ))}
            </div>
          </div>

          <div className="bg-[#FF9E2B0D] p-3 rounded-3xl flex items-center gap-3 w-full justify-center">
            <Image src={Assets.Svgs.XpCoin} alt="XP" height={44} width={44} />
            <div>
              <p className="text-[#FF9E2B] text-sm">Challenge Reward</p>
              <h2 className="text-[#FF9E2B] text-2xl font-bold">
                {xpCount} XP
              </h2>
            </div>
          </div>
        </div>

        <Button
          endIcon={<ArrowUpRight />}
          className="w-full h-12 rounded-xl text-sm"
          onClick={onClose}
        >
          Continue to next Challenge
        </Button>
      </div>
    </Modal>
  );
};
