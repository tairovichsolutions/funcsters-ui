"use client";
import { BentoCard } from "./BentoCard";
import { ArrowButton, FocusText } from "@/components";
import { Bold } from "@/components/ui/bold-text";
import { TextFadeAnimation } from "@/components/ui/text-fade-animation";

export const Bento = () => {
  return (
    <div className="section-container-class">
      <div className="flex flex-col items-center justify-center gap-5 mb-12 text-center">
        <TextFadeAnimation
          delay={0.1}
          direction="left"
          className="section-heading-class leading-tight text-center"
        >
          Learn <FocusText>Faster</FocusText>. Code
          <FocusText> Smarter</FocusText>
        </TextFadeAnimation>
        <TextFadeAnimation
          direction="left"
          delay={0.2}
          className="section-sub-heading-class"
        >
          Funcsters makes coding
          <Bold className="font-semibold"> simple and engaging </Bold>
          with <Bold className="font-semibold">real </Bold> challenges,
          <Bold className="font-semibold"> personalized</Bold> learning, and a{" "}
          <Bold className="font-semibold">motivating </Bold>
          community.
        </TextFadeAnimation>
      </div>

      <div className="flex flex-col gap-8 font-imbMono overflow-hidden ">
        <div className="grid grid-cols-12 gap-8 ">
          <BentoCard
            delay={0.16}
            colSpan=" col-span-12 md:col-span-6 lg:col-span-7"
            direction="right"
            imageSrc="/images/Challenges List View.png"
            imageAlt="bento1"
            title="Practical Coding Made Simple!"
          />
          <BentoCard
            delay={0.2}
            direction="left"
            colSpan=" col-span-12 md:col-span-6 lg:col-span-5"
            imageSrc="/images/community.png"
            imageAlt="bento2"
            title="Motivation Through Progress & Community!"
          />
        </div>

        <div className="grid grid-cols-12 gap-8 ">
          <BentoCard
            direction="right"
            colSpan=" col-span-12 md:col-span-6 lg:col-span-5"
            imageSrc="/images/think.png"
            imageAlt="bento3"
            title="Personalized Learning That Grows With You!"
          />
          <BentoCard
            direction="left"
            colSpan=" col-span-12 md:col-span-6 lg:col-span-7"
            imageSrc="/images/challenge.png"
            imageAlt="bento4"
            title="Real-World Preparation for Career Success!"
          />
        </div>
      </div>
      <div className="flex items-center justify-center py-8">
        <TextFadeAnimation direction="left" className="flex justify-center">
          <ArrowButton>Start upgrading your coding skill</ArrowButton>
        </TextFadeAnimation>
      </div>
    </div>
  );
};
