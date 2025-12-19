import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  repeat?: number;
  reverse?: boolean;
  vertical?: boolean;
  className?: string;
  horizontal?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
}

export function Marquee({
  className,
  children,
  horizontal,
  repeat = 4,
  reverse = false,
  vertical = false,
  pauseOnHover = false,
  ...props
}: MarqueeProps) {
  const isHorizontal = horizontal ?? !vertical;
  const isVertical = vertical ?? !horizontal;

  return (
    <div
      {...props}
      className={cn(
        "group flex gap-(--gap) overflow-hidden p-3 bgo [--duration:40s] [--gap:1.3rem]",
        {
          "flex-row": isHorizontal,
          "flex-col": isVertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around gap-(--gap)", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:paused": pauseOnHover,
              "direction-[reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
