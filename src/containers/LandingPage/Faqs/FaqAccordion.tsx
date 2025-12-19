import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components";
import { TextFadeAnimation } from "@/components/ui/text-fade-animation";
import React from "react";

interface FAQItem {
  id: string;
  answer: string;
  question: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  openItemId?: string;
  onOpenChange?: (value: string) => void;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  openItemId,
  onOpenChange,
}) => {
  const [internalOpenId, setInternalOpenId] = React.useState<string>("");

  const currentOpenId = openItemId !== undefined ? openItemId : internalOpenId;
  const handleValueChange = onOpenChange || setInternalOpenId;

  return (
    <Accordion
      collapsible
      type="single"
      className="space-y-3"
      value={currentOpenId}
      onValueChange={handleValueChange}
    >
      {items.map((item) => (
        <TextFadeAnimation direction="left">
          <div
            key={item.id}
            className=" bg-linear-to-tl from-[#ffffff]/40 via-transparent to-[#ffffff]/40  p-px rounded-3xl"
          >
            <div className=" bg-[#0d1a26] p-0 rounded-3xl">
              <AccordionItem
                value={item.id}
                className="border-b-0 last:border-b-0  rounded-3xl overflow-hidden bg-linear-to-r  from-[#111111] via-[#008cff31]  to-[#008cff2c]/20   shadow-2xl "
              >
                <AccordionTrigger
                  ChevronDownIconClass="3xl:size-[16px]! text-white"
                  className="px-6 py-4 md:px-8 cursor-pointer md:py-5 text-left text-sm md:text-base font-medium text-sky-50 hover:no-underline [&[data-state=open]>span.icon]:rotate-180"
                >
                  <div className="flex w-full items-center justify-between gap-4 text-lg md:text-xl 3xl:text-[30px]">
                    <span>{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="3xl:text-[24px]! px-6 pb-5 md:px-8 md:pb-6 text-xs md:text-base/tight text-slate-200/90 border-none text-start section-sub-heading-class font-light!">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </div>
          </div>
        </TextFadeAnimation>
      ))}
    </Accordion>
  );
};
