"use client";

import { FocusText } from "@/components";
import { TextFadeAnimation } from "@/components/ui/text-fade-animation";
import { useRef, useState } from "react";
import { ReviewSwiper } from "./ReviewSwiper";

export const WhyDevelopersChoose = () => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="section-container-class">
      <div className="flex justify-center items-center gap-5 flex-col text-center md:px-0 px-3">
        <TextFadeAnimation
          direction="left"
          delay={0.1}
          className="section-heading-class leading-none text-center"
        >
          Why Developers Choose
          <FocusText> Funcstres!</FocusText>
        </TextFadeAnimation>
        <TextFadeAnimation
          direction="left"
          delay={0.2}
          className="section-sub-heading-class"
        >
          Funcsters has been empowering coders for years—and the results speak
          for themselves. See what our community is saying!
        </TextFadeAnimation>
      </div>

      <div className="pt-10 h-full">
        <ReviewSwiper showNavigation />
      </div>
    </div>
  );
};
