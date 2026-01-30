import * as React from "react";
import { cn } from "@/lib/utils";
import * as SwitchPrimitives from "@radix-ui/react-switch";

type UISize = "sm" | "md" | "lg";
type TextSize = "xs" | "sm" | "md" | "lg";

type SwitchProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
> & {
  onText?: string;
  offText?: string;
  uiSize?: UISize;
  textSize?: TextSize;
};

const textSizeMap: Record<TextSize, string> = {
  xs: "text-[9px]",
  sm: "text-[11px]",
  md: "text-xs",
  lg: "text-[13px]",
};

const withTextTrackMap: Record<UISize, string> = {
  sm: "min-w-[42px] h-4",
  md: "min-w-[47px] h-5",
  lg: "min-w-[54px] h-[21px] ",
};

const noTextTrackMap: Record<UISize, string> = {
  sm: "w-[28px] h-[16px]",
  md: "w-[32px] h-[18px]",
  lg: "w-[45px] h-[20px]",
};

const withTextThumbMap: Record<UISize, string> = {
  sm: "h-[10px] w-[10px] data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-[calc(100%-0.80rem)]",
  md: "h-[12px] w-[12px] data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-[calc(100%-0.95rem)]",
  lg: "h-[14px] w-[14px] data-[state=checked]:translate-x-[1.92rem] data-[state=unchecked]:translate-x-[calc(100%-1rem)]",
};

const noTextThumbMap: Record<UISize, string> = {
  sm: "!h-[10px] !w-[10px] data-[state=checked]:translate-x-1.5 data-[state=unchecked]:-translate-x-1.5",
  md: "!h-3 !w-3 data-[state=checked]:translate-x-1.5 data-[state=unchecked]:-translate-x-1.5",
  lg: "!h-[13px] !w-[13px] data-[state=checked]:translate-x-4.5 data-[state=unchecked]:-translate-x-[6px]",
};

const clearRightForThumb: Record<UISize, string> = {
  sm: "pr-[12px]",
  md: "pr-[14px]",
  lg: "pr-[18px]",
};
const clearLeftForThumb: Record<UISize, string> = {
  sm: "pl-[12px]",
  md: "pl-[14px]",
  lg: "pl-[18px]",
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      onText = "",
      offText = "",
      uiSize = "md",
      textSize = "xs",
      ...props
    },
    ref
  ) => {
    const hasText = !!onText || !!offText;

    return (
      <SwitchPrimitives.Root
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent px-2 relative group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          hasText ? withTextTrackMap[uiSize] + " px-1" : noTextTrackMap[uiSize],
          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-[#C4DAFA]",
          className
        )}
        {...props}
        ref={ref}
      >
        {onText && (
          <span
            className={cn(
              "absolute left-1 top-1/2 -translate-y-1/2 font-semibold",
              clearRightForThumb[uiSize],
              "group-data-[state=unchecked]:hidden",
              "text-left truncate pointer-events-none z-0 text-white",
              textSizeMap[textSize]
            )}
            aria-hidden
          >
            {onText}
          </span>
        )}

        {offText && (
          <span
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 font-semibold",
              clearLeftForThumb[uiSize],
              "group-data-[state=checked]:hidden",
              "text-right truncate pointer-events-none  z-0 text-[#008CFF]",
              textSizeMap[textSize]
            )}
            aria-hidden
          >
            {offText}
          </span>
        )}

        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none rounded-full shadow-lg bg-white shrink-0 ring-0 transition-transform duration-200 z-10",
            hasText ? withTextThumbMap[uiSize] : noTextThumbMap[uiSize]
          )}
        />
      </SwitchPrimitives.Root>
    );
  }
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
