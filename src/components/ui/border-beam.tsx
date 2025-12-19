"use client";

import { motion, MotionStyle, Transition } from "framer-motion";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  size?: number;
  delay?: number;
  colorTo?: string;
  duration?: number;
  reverse?: boolean;
  colorFrom?: string;
  className?: string;
  borderWidth?: number;
  initialOffset?: number;
  transition?: Transition;
  style?: React.CSSProperties;
}

export const BorderBeam = ({
  style,
  className,
  size = 50,
  delay = 0,
  transition,
  duration = 6,
  reverse = false,
  borderWidth = 1,
  initialOffset = 0,
  colorTo = "#9c40ff",
  colorFrom = "#ffaa40",
}: BorderBeamProps) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
      style={
        {
          "--border-beam-width": `${borderWidth}px`,
        } as React.CSSProperties
      }
    >
      <motion.div
        className={cn(
          "absolute aspect-square",
          "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            ...style,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
};
