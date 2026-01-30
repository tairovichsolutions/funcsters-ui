"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowButton } from "@/components";
import { AnimateFade } from "@/components/ui/animate-fade";
import { TextFadeAnimation } from "@/components/ui/text-fade-animation";
import { Assets } from "@/constants/assets";

export const KillerCoder = () => {
  return (
    <div className=" section-container-class relative">
      <div className="muclass md:px-20 px-3 md:pt-20 pt-10 overflow-hidden">
        <div className="flex justify-center md:space-y-6 space-y-3 items-center flex-col ">
          <TextFadeAnimation
            direction="left"
            delay={0.2}
            className=" md:text-5xl text-4xl text-center "
          >
            Become a Killer Coder
          </TextFadeAnimation>

          <TextFadeAnimation direction="left" className="flex justify-center">
            <ArrowButton>Start upgrading your coding skill</ArrowButton>
          </TextFadeAnimation>
        </div>

        <AnimateFade>
          <div className=" flex justify-center items-center mt-14 relative  pb-0 rounded-t-3xl">
            <div className=" bg-[#008CFF] rounded-full blur-[80px] z-0  w-[65%] h-28  absolute left-1/2  -translate-x-1/2 top-5" />
            <img
              src={Assets.Images.killerCode}
              alt="challenge_playground"
              className=" z-20"
            />
          </div>
        </AnimateFade>
      </div>
    </div>
  );
};
