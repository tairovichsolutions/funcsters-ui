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

export const SolutionSubmittedModal = ({
  open,
  onClose,
  xpCount,
}: any) => {
  console.log("xpCount", xpCount);

  const shareIcons = [
    "iconoir:facebook",
    "iconoir:twitter",
    "basil:linkedin-outline",
    "solar:link-broken",
  ];

  return (
    <Modal
      ClossBtnIconClass="size-6!"
      ClossBtnClass=" text-xl top-6 right-6! text-primary "
      open={open}
      onClose={onClose}
    >
      <div className="  space-y-5 ">
        <div className=" bg-[#E5F3FF] dark:bg-primary/15 rounded-lg flex flex-col items-center gap-6 p-4">
          <div className=" size-[110px] bg-[#008CFF]/20 rounded-full  flex justify-center items-center">
            <img
              src={Assets.Svgs.CelebrationImg}
              alt="Solution Submitted"
              className="size-16"
            />
          </div>

          <h4 className="text-[33px] leading-none font-bold">
            Solution Submitted!
          </h4>

          <p className="text-sm text-center px-5">
            <FocusText className=" font-bold!">Congratulations!</FocusText>{" "}
            You’ve successfully solved this challenge and earned your reward.
          </p>

          <div className=" flex  justify-center items-center  w-full gap-10">
            <div className="flex flex-col gap-2.5">
              <h6 className="text-sm font-medium text-nowrap text-[#005092] dark:text-white">
                Share your achievement on
              </h6>

              <div className="flex items-center gap-3">
                {shareIcons.map((icon) => (
                  <ShareIcon key={icon} name={icon} />
                ))}
              </div>
            </div>

            {xpCount > 0 && (
              <div className="bg-[#FFFAF4] dark:bg-[#FFFAF4]/15 p-3 rounded-3xl flex items-center gap-3 w-full justify-center">
                <Image
                  src={Assets.Svgs.XpCoin}
                  alt="XP"
                  height={44}
                  width={44}
                />
                <div>
                  <p className="text-[#FF9E2B] text-xs font-semibold">
                    Challenge Reward
                  </p>
                  <h2 className="text-[#FF9E2B] text-[28px] tracking-tighter font-bold">
                    {xpCount} XP
                  </h2>
                </div>
              </div>
            )}
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
