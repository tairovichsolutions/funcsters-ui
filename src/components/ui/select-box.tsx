"use client";

import {
  ChevronDown,
  Check,
  Loader2,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib";
import * as React from "react";
import { useSafeArray } from "@/hooks";
import * as Select from "@radix-ui/react-select";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export interface SelectBoxProps
  extends React.ComponentPropsWithoutRef<typeof Select.Root> {
  error?: string;
  value?: string;
  hasMore?: boolean;
  loading?: boolean;
  className?: string;
  labelClass?: string;
  placeholder?: string;
  defaultValue?: string;
  emptyMessage?: string;
  contantClass?: string;
  loadMoreLabel?: string;
  loadingMessage?: string;
  label?: string;
  options: SelectOption[];
  onRetry?: () => void;
  onLoadMore?: () => void;
  onValueChange?: (value: string) => void;
}

export const SelectBox = React.forwardRef<
  React.ElementRef<typeof Select.Trigger>,
  SelectBoxProps
>(
  (
    {
      error,
      value,
      loading,
      options,
      label,
      hasMore,
      className,
      labelClass,
      onRetry,
      onLoadMore,
      onValueChange,
      contantClass,
      defaultValue,
      placeholder = "Select...",
      loadingMessage = "Loading...",
      emptyMessage = "No options",
      loadMoreLabel = "Load more",
      ...props
    },
    ref
  ) => {
    const selectOptions = useSafeArray(options);
    const selected = selectOptions?.find((o) => o.value === value);

    const rootValueProps = value !== undefined ? { value } : { defaultValue };
    return (
      <div>
        {label && (
          <label className={cn("text-sm mb-1! font-semibold", labelClass)}>
            {label}
          </label>
        )}
        <Select.Root
          {...rootValueProps}
          onValueChange={onValueChange}
          {...props}
        >
          <Select.Trigger
            ref={ref}
            className={cn(
              "inline-flex w-full outline-none  truncate  items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
              " placeholder:text-muted-foreground shadow-sm",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              {selected?.startIcon && (
                <span className="shrink-0">{selected?.startIcon}</span>
              )}

              <Select.Value
                placeholder={
                  <span className="text-muted-foreground ">{placeholder}</span>
                }
              ></Select.Value>

              {selected?.endIcon && (
                <span className="shrink-0">{selected?.endIcon}</span>
              )}
            </div>

            <Select.Icon asChild>
              <ChevronDown className="ml-2 size-4 opacity-70" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              position="popper"
              side="bottom"
              sideOffset={4}
              className={cn(
                "relative z-50 min-w-32 max-h-[300px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
                "w-(--radix-select-trigger-width)"
              )}
            >
              <Select.Viewport className="p-1">
                {error ? (
                  <div
                    className="flex items-center text-xs gap-2 flex-col justify-center rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2"
                    role="alert"
                  >
                    <AlertCircle className="size-4 shrink-0" />
                    <span className="truncate">{error}</span>
                    {onRetry && (
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRetry();
                        }}
                        className=" inline-flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs underline underline-offset-2 hover:opacity-80"
                      >
                        <RotateCw className="size-3" />
                        Retry
                      </button>
                    )}
                  </div>
                ) : loading ? (
                  <div
                    className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-muted-foreground"
                    aria-live="polite"
                  >
                    <Loader2 className="size-4 animate-spin shrink-0" />
                    <span className="text-nowrap  truncate">
                      {loadingMessage}
                    </span>
                  </div>
                ) : selectOptions?.length === 0 ? (
                  <div className="rounded-sm px-3 py-2 text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                ) : (
                  <>
                    {selectOptions?.map((opt) => (
                      <Select.Item
                        key={opt?.value}
                        value={opt?.value}
                        className={cn(
                          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm py-2 px-2 text-sm outline-none",
                          "focus:bg-accent focus:text-accent-foreground",
                          "data-disabled:pointer-events-none data-disabled:opacity-50",
                          contantClass
                        )}
                      >
                        {opt?.startIcon && <span>{opt?.startIcon}</span>}

                        <Select.ItemText>{opt?.label}</Select.ItemText>

                        {opt?.endIcon && (
                          <span className="ml-auto">{opt?.endIcon}</span>
                        )}

                        <Select.ItemIndicator className="absolute right-2 inline-flex items-center justify-center">
                          <Check className="size-3" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}

                    {hasMore && (
                      <>
                        <Select.Separator className="my-1 h-px bg-border" />
                        <div
                          role="button"
                          tabIndex={0}
                          className={cn(
                            "flex cursor-pointer items-center justify-center  text-[11px]! gap-2 rounded-sm px-3 py-1.5",
                            "hover:bg-accent hover:text-accent-foreground"
                          )}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.stopPropagation();
                            onLoadMore?.();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onLoadMore?.();
                            }
                          }}
                        >
                          <RotateCw className="size-2.5" />
                          <span>{loadMoreLabel}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  }
);

SelectBox.displayName = "SelectBox";
