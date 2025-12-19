/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Children } from "react";
import type { JSX, ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib";

const softEase: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

const textBlockVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: softEase,
    },
  },
};

const wordsContainerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: softEase,
      staggerChildren: 0.05,
      when: "beforeChildren",
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: softEase,
    },
  },
};

type FadeInTextProps = {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  once?: boolean;
  amount?: number;
};

export const FadeInText: React.FC<FadeInTextProps> = ({
  children,
  className,
  as = "p",
  once = false,
  amount = 0.4,
}) => {
  const MotionTag: any = (motion as any)[as] ?? motion.p;

  return (
    <MotionTag
      className={cn(className)}
      variants={textBlockVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </MotionTag>
  );
};

type StaggeredTextProps = {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  once?: boolean;
  amount?: number;
};

export const StaggeredText: React.FC<StaggeredTextProps> = ({
  children,
  className,
  as = "h1",
  once = false,
  amount = 0.4,
}) => {
  const MotionTag: any = (motion as any)[as] ?? motion.h1;

  const renderedWords: ReactNode[] = [];
  let keyIndex = 0;

  Children.forEach(children, (child) => {
    if (typeof child === "string") {
      const parts = child.split(" ");
      parts.forEach((word) => {
        if (!word) return;
        renderedWords.push(
          <motion.span
            key={`word-${keyIndex++}`}
            variants={wordVariants}
            className="inline-block mr-1"
          >
            {word}
          </motion.span>
        );
      });
    } else {
      renderedWords.push(
        <motion.span
          key={`node-${keyIndex++}`}
          variants={wordVariants}
          className="inline-block mr-1"
        >
          {child}
        </motion.span>
      );
    }
  });

  return (
    <MotionTag
      className={cn(className)}
      variants={wordsContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {renderedWords}
    </MotionTag>
  );
};
