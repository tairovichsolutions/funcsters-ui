"use client";
import { motion, Variants } from "framer-motion";
import { ReactNode, useState } from "react";

interface Props {
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  children: ReactNode;
}

export const TextFadeAnimation = ({
  children,
  className,
  delay = 0,
  duration = 0.65,
  direction,
}: Props) => {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.h1
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false }}
      variants={variants}
    >
      {children}
    </motion.h1>
  );
};
