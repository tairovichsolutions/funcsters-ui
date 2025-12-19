"use client";

import * as React from "react";
import * as Switch from "@radix-ui/react-switch";

function cn(...xs: Array<string | undefined | false>) {
  return xs.filter(Boolean).join(" ");
}

type Size = "sm" | "md" | "lg";
type Intent = "primary" | "neutral";

export interface ToggleSwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Switch.Root>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  size?: Size;
  intent?: Intent;
  textVisible?: boolean;
  ariaLabel?: string;
}

const sizeMap: Record<
  Size,
  {
    track: string;
    thumb: string;
    thumbCheckedTranslate: string;
    thumbUncheckedTranslate: string;
    text: string;
  }
> = {
  sm: {
    track: "h-7 w-20",
    thumb: "h-6 w-6",
    thumbCheckedTranslate: "translate-x-[52px]",
    thumbUncheckedTranslate: "translate-x-1",
    text: "text-[13px]",
  },
  md: {
    track: "h-9 w-24",
    thumb: "h-7 w-7",
    thumbCheckedTranslate: "translate-x-[62px]",
    thumbUncheckedTranslate: "translate-x-1.5",
    text: "text-sm",
  },
  lg: {
    track: "h-10 w-28",
    thumb: "h-8 w-8",
    thumbCheckedTranslate: "translate-x-[74px]",
    thumbUncheckedTranslate: "translate-x-2",
    text: "text-base",
  },
};

const intentMap: Record<
  Intent,
  { on: string; off: string; textOn: string; textOff: string }
> = {
  primary: {
    on: "bg-[#1a73e8]",
    off: "bg-[#cfe3ff]",
    textOn: "text-white",
    textOff: "text-[#1a73e8]",
  },
  neutral: {
    on: "bg-gray-900",
    off: "bg-gray-200",
    textOn: "text-white",
    textOff: "text-gray-700",
  },
};

export const ToggleSwitch = React.forwardRef<
  HTMLButtonElement,
  ToggleSwitchProps
>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      labelOn = "Hide",
      labelOff = "View",
      size = "md",
      intent = "primary",
      textVisible = true,
      ariaLabel,
      className,
      ...rest
    },
    ref
  ) => {
    const s = sizeMap[size];
    const v = intentMap[intent];

    return (
      <Switch.Root
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={ariaLabel ?? `${labelOff}/${labelOn} toggle`}
        className={cn(
          "relative inline-flex select-none items-center rounded-full transition-colors outline-none",
          "data-[state=checked]:shadow-none",
          s.track,
          `data-[state=checked]:${v.on} data-[state=unchecked]:${v.off}`,
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          className
        )}
        {...rest}
      >
        {textVisible && (
          <span
            className={cn(
              "pointer-events-none absolute inset-0 grid place-items-center font-medium",
              s.text
            )}
          >
            <span
              className={cn(
                "transition-opacity duration-200",
                "data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0",
                v.textOn
              )}
            >
              {labelOn}
            </span>
            <span
              className={cn(
                "absolute transition-opacity duration-200",
                "data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100",
                v.textOff
              )}
            >
              {labelOff}
            </span>
          </span>
        )}

=
        <Switch.Thumb
          className={cn(
            "pointer-events-none rounded-full bg-white shadow transition-transform",
            "will-change-transform",
            s.thumb,
       
            `data-[state=checked]:${s.thumbCheckedTranslate} data-[state=unchecked]:${s.thumbUncheckedTranslate}`
          )}
        />
      </Switch.Root>
    );
  }
);

ToggleSwitch.displayName = "ToggleSwitch";
