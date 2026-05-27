"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowButton, FocusText } from "@/components";
import { Assets } from "@/constants/assets";
import { TextFadeAnimation } from "@/components/ui/text-fade-animation";
import { Bold } from "@/components/ui/bold-text";
import { AnimateFade } from "@/components/ui/animate-fade";

export const Hero = () => {
  return (
    <main className="relative pt-32! section-container-class overflow-hidden">
      <img
        alt="group"
        src="/images/group.png"
        className="absolute inset-0 mt-10 w-full h-full object-cover opacity-10 z-0 "
      />
      <div className="flex justify-center items-center text-center flex-col space-y-3 relative z-10">
        <TextFadeAnimation
          delay={0.1}
          direction="left"
          className="section-heading-class leading-tight text-center"
        >
          Learn <FocusText> Smarter. </FocusText> Code Better.
          <FocusText> Grow </FocusText> Faster.
        </TextFadeAnimation>

        <TextFadeAnimation
          delay={0.2}
          direction="left"
          className="section-sub-heading-class"
        >
          Take on <Bold className=" font-semibold">real coding </Bold>
          challenges, sharpen your logic, and build the skills to
          <Bold className=" font-semibold"> level up</Bold> — one solution at a
          time.
        </TextFadeAnimation>
        <div>
          <TextFadeAnimation direction="left" className="flex justify-center">
            <ArrowButton>Start upgrading your coding skill</ArrowButton>
          </TextFadeAnimation>
        </div>
        <AnimateFade
          delay={0.4}
          className="mt-4 flex items-center justify-center"
        >
          <img
            src={Assets.Images.ChallengesWorkSpaceImage}
            alt="challenge_progress_image"
            className="object-contain max-h-[625.966px] 3xl:max-h-[750px] "
          />
        </AnimateFade>
      </div>
    </main>
  );
};
