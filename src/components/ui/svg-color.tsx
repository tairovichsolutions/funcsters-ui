"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface SvgColorProps extends React.HTMLAttributes<HTMLSpanElement> {
  src: string;
}

export const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
  ({ src, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-block size-5 bg-black dark:bg-white mask mask-center",
        className
      )}
      style={{
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
      }}
      {...props}
    />
  )
);

SvgColor.displayName = "SvgColor";
