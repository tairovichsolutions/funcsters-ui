"use client";
import { cn } from "@/lib";
import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface Props {
  delay?: number;
  className?: string;
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
}

export const AnimateFade = ({
  children,
  className,
  delay = 0,
  direction = "up",
}: Props) => {
  const distance = 80;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
      x:
        direction === "left" ? distance : direction === "right" ? -distance : 0,
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={cn("w-full", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "0px 0px -120px 0px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
