/* eslint-disable @next/next/no-img-element */
"use client";
import { StepItem } from "./Steps";
import { useState, useRef, useEffect } from "react";
import { FocusText } from "@/components/ui/focus-text";
import { AnimateFade } from "@/components/ui/animate-fade";
import { HowToJoinSteps } from "@/constants/howToJoinSteps";
import { TextFadeAnimation } from "@/components/ui/text-fade-animation";
import { AnimatePresence, motion } from "framer-motion";

export const HowToJoin = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        setActiveStepIndex((prev) =>
          prev === HowToJoinSteps.length - 1 ? 0 : prev + 1
        );
      }, 1500);
    };

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible]);

  const handleStepClick = (idx: number) => {
    setActiveStepIndex(idx);

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Restart interval with extended timeout (5 seconds)
    intervalRef.current = setInterval(() => {
      setActiveStepIndex((prev) =>
        prev === HowToJoinSteps.length - 1 ? 0 : prev + 1
      );
    }, 3500);
  };

  return (
    <section ref={sectionRef} className="section-container-class">
      <div className="flex justify-center items-center gap-5 flex-col text-center">
        <TextFadeAnimation
          direction="left"
          delay={0.1}
          className="section-heading-class"
        >
          How To Join our <FocusText>Community!</FocusText>
        </TextFadeAnimation>

        <TextFadeAnimation direction="left" delay={0.2}>
          <p className="section-sub-heading-class max-w-xl">
            Connect, collaborate, and level up with like-minded coders.
          </p>
        </TextFadeAnimation>
      </div>

      <AnimateFade direction="up">
        <div className="w-full mt-20 lg:flex hidden">
          <div className="  font-magseva flex items-center w-full ">
            <div className="3xl:gap-[26px]! space-y-4! lg:space-y-3 w-[50%] h-full  self-start! flex flex-col items-center justify-center  ">
              {HowToJoinSteps.map((step, idx) => (
                <StepItem
                  key={step.number}
                  title={step.title}
                  number={step.number}
                  description={step.description}
                  isActive={idx === activeStepIndex}
                  onClick={() => handleStepClick(idx)}
                />
              ))}
            </div>

            <div className="  flex  w-[50%] justify-center items-center">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={activeStepIndex}
                  alt={"how_to_join_steps_img"}
                  src={HowToJoinSteps[activeStepIndex].image}
                  className="relative h-[350px] md:h-[420px] lg:min-h-[490px] 3xl:h-[730px]! w-auto! object-contain"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </AnimateFade>

      <div className="w-full lg:hidden flex flex-col overflow-hidden mt-5">
        {HowToJoinSteps.map((step, index) => (
          <AnimateFade
            key={index}
            delay={0.1}
            direction={index % 2 === 0 ? "right" : "left"}
          >
            <div className="flex flex-col items-start gap-5 mt-10">
              <StepItem
                key={step.number}
                title={step.title}
                number={step.number}
                description={step.description}
                className="bg-[linear-gradient(131.27deg,rgba(0,140,255,0.2)_20.18%,rgba(0,84,153,0)_69.87%)]"
              />
              <img
                src={step.image}
                alt={step.title}
                className="object-contain h-full w-full"
              />
            </div>
          </AnimateFade>
        ))}
      </div>
    </section>
  );
};
