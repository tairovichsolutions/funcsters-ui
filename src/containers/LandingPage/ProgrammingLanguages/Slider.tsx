/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { Assets } from "@/constants/assets";
import { SvgColor } from "@/components";

export const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  const images = [
    { id: 3, src: Assets.Svgs.language.C, alt: "C" },
    { id: 6, src: Assets.Svgs.language.Rust, alt: "Rust" },
    { id: 9, src: Assets.Svgs.language.Java, alt: "Java" },
    { id: 8, src: Assets.Svgs.language.Swift, alt: "Swift" },
    { id: 1, src: Assets.Svgs.language.CPlusPlus, alt: "C++" },
    { id: 4, src: Assets.Svgs.language.Python, alt: "Python" },
    { id: 5, src: Assets.Svgs.language.kotlin, alt: "Kotlin" },
    { id: 7, src: Assets.Svgs.language.Typescript, alt: "TypeScript" },
    { id: 2, src: Assets.Svgs.language.javascript, alt: "JavaScript" },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  const getVisibleItems = () => {
    const items = [];
    const totalVisible = isMobile ? 5 : 8;
    const halfVisible = Math.floor(totalVisible / 2);

    for (let i = -halfVisible; i <= halfVisible; i++) {
      const index = (activeIndex + i + images.length) % images.length;
      items.push({
        ...images[index],
        offset: i,
        index: index,
      });
    }
    return items;
  };

  const visibleItems = getVisibleItems();

  return (
    <div className="flex flex-col items-center py-16 gap-6 justify-center overflow-hidden ">
      <div className="w-full ">
        <div className="flex items-center justify-center gap-2 md:gap-4 shrink-0">
          {visibleItems.map((item, idx) => {
            const isCenter = item.offset === 0;
            const distance = Math.abs(item.offset);
            let size = 20;
            let opacity = 0.3;
            let rounded = 20;

            if (isMobile) {
              if (isCenter) {
                size = 135;
                opacity = 1;
                rounded = 24;
              } else if (distance === 1) {
                size = 95;
                opacity = 0.5;
                rounded = 20;
              } else {
                size = 50;
                opacity = 0.3;
                rounded = 16;
              }
            } else {
              if (isCenter) {
                size = 210;
                opacity = 1;
                rounded = 40;
              } else if (distance === 1) {
                size = 170;
                opacity = 0.5;
                rounded = 34;
              } else if (distance === 2) {
                size = 130;
                opacity = 0.6;
                rounded = 26;
              } else if (distance === 3) {
                size = 100;
                opacity = 0.5;
                rounded = 26;
              } else {
                size = 70;
                opacity = 0.4;
                rounded = 22;
              }
            }

            return (
              <div
                key={`${item.index}-${idx}`}
                className={`flex shrink-0 p-3 md:p-7 items-center justify-center transition-all duration-500 cursor-pointer ${
                  isCenter
                    ? "bg-white shadow-[0_0_108.681px_0_rgba(255,255,255,0.5)]! shadow-white/20"
                    : "bg-white"
                }`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: `${rounded}px`,
                  opacity: opacity,
                }}
                onClick={() => setActiveIndex(item.index)}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="object-contain w-full h-full"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-5 space-y-6 md:space-y-10">
        <SvgColor
          src={Assets.Svgs.ArrowUp}
          className="size-6 md:size-8 animate-bounce bg-white duration-100 mx-auto"
        />
        <p className="text-gray-500 text-xl md:text-3xl 3xl:text-[3.8rem] font-mono px-4">
          {"{{ "}
          <span className="text-white">{images[activeIndex].alt}</span>
          {" }}"}
        </p>
      </div>
    </div>
  );
};
