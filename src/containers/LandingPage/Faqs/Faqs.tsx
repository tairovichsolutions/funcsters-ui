"use client";

import * as React from "react";
import { TextFadeAnimation } from "@/components/ui/text-fade-animation";
import { AnimateFade } from "@/components/ui/animate-fade";
import { FAQ_CATEGORIES, FaqCategoryId } from "@/constants/faqCatagories";
import { FAQAccordion } from "./FaqAccordion";

export const Faqs: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] =
    React.useState<FaqCategoryId>("general");
  const [openItemId, setOpenItemId] = React.useState<string | undefined>(
    "how-to-sell"
  );

  const activeCategory =
    FAQ_CATEGORIES.find((cat) => cat.id === activeCategoryId) ??
    FAQ_CATEGORIES[0];

  return (
    <section className=" section-container-class">
      <div className=" flex justify-center items-center gap-5 flex-col">
        <TextFadeAnimation
          direction="left"
          delay={0.1}
          className=" section-heading-class leading-tight text-center "
        >
          Frequently Asked
        </TextFadeAnimation>
      </div>

      <TextFadeAnimation direction="up" delay={0.2}>
        <div className="flex flex-wrap gap-3 justify-center items-center py-10 relative">
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setOpenItemId(cat.items[0]?.id);
                }}
                className={`rounded-full flex  items-center  gap-2.5 cursor-pointer px-8 md:py-2 py-3 text-xs  md:text-sm/relaxed  transition leading-none  overflow-hidden
                    ${
                      isActive
                        ? "border border-[#FFFFFF33] bg-[#FFFFFF1A] text-[#FFFFFF]"
                        : " bg-[#FFFFFF0D]/90 text-[#FFFFFF99] "
                    }`}
              >
                {cat.label}
                <span className="text-[9px] ">
                  {"("}
                  {cat.items.length}
                  {")"}
                </span>
              </button>
            );
          })}
        </div>
      </TextFadeAnimation>
      <div className="grid gap-12   lg:grid-cols-[0.8fr_1.2fr] relative">
        <div className="flex gap-5 flex-col z-10">
          <TextFadeAnimation
            direction="right"
            delay={0.1}
            className=" text-[40px] 3xl:text-[64px]! leading-none "
          >
            Questions
          </TextFadeAnimation>
          <TextFadeAnimation
            direction="right"
            delay={0}
            className=" text-start section-sub-heading-class"
          >
            Ipsum vulputate arnet ac arnet tellus quis ferrnentum sollicitudin
            diam felis ridiculus a turpis nisl vitae.
          </TextFadeAnimation>
        </div>
        <AnimateFade direction="up" className="z-10">
          <div className="space-y-8">
            <FAQAccordion
              key={activeCategory.id}
              items={activeCategory.items}
              openItemId={openItemId}
              onOpenChange={setOpenItemId}
            />
          </div>
        </AnimateFade>
        <div className=" bg-[#008cff31] w-[90%] h-[200px] absolute top-28  blur-[100px]  xl left-1/2  -translate-x-1/2" />
      </div>
    </section>
  );
};
