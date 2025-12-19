"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  label?: string;
  labelClassName?: string;
}

export function Checkbox({
  className,
  label,
  labelClassName,
  ...props
}: CheckboxProps) {
  const id = React.useId();

  return (
    <div className="flex items-center gap-2">
      <CheckboxPrimitive.Root
        id={id}
        data-slot="checkbox"
        className={cn(
          "peer border-input dark:bg-input/30 data-[state=checked]:bg-secondary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-secondary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none"
        >
          <CheckIcon className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-2 font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
