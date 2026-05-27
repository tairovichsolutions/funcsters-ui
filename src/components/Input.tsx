import React from "react";
import { cn } from "@/lib";
import { Iconify, SvgColor } from "./ui";
import { Assets } from "@/constants/assets";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  label?: string;
  error?: string;
  value?: string;
  endIcon?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  startIcon?: string;
  inputClass?: string;
  isLoading?: boolean;
  loadingIcon?: string;
  isPassword?: boolean;
  placeholder?: string;
  endIconClass?: string;
  startIconClass?: string;
  innerInputClass?: string;
  endIconProps?: React.ComponentProps<"span">;
  startIconProps?: React.ComponentProps<"span">;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Input = React.memo(
  ({
    name,
    label,
    error,
    endIcon,
    readOnly,
    onChange,
    disabled,
    className,
    startIcon,
    inputClass,
    value = "",
    placeholder,
    endIconProps,
    endIconClass,
    type = "text",
    startIconProps,
    startIconClass,
    innerInputClass,
    isPassword = false,
    isLoading = false,
    loadingIcon,
    ...rests
  }: InputProps) => {
    const [showPassword, TogglePassword] = React.useState(false);

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div
        className={cn(
          "flex flex-col gap-1 w-full",
          className,
          disabled && "cursor-not-allowed"
        )}
      >
        {label && <label className="text-sm font-semibold ">{label}</label>}

        <div
          className={cn(
            "flex items-center rounded-md p-2 h-full gap-1.5 border border-input-border focus-within:border-primary",
            value.length > 0 ? "bg-primary/10!" : "bg-input-background",
            error && "bg-destructive/10 border-[#940014]",
            inputClass,
            disabled && value.length > 0
              ? "bg-primary/10 opacity-70 cursor-not-allowed"
              : "bg-input-background",
            startIcon || endIcon ? "px-2.5 md:px-4" : "px-2.5"
          )}
        >
          {!isPassword && (
            <>
              {isLoading ? (
                <Iconify
                  iconName={loadingIcon ?? "lucide:loader-2"}
                  className={cn(
                    "animate-spin text-medium-gray",
                    startIconClass
                  )}
                  {...startIconProps}
                />
              ) : (
                startIcon && (
                  <Iconify
                    iconName={startIcon}
                    className={startIconClass}
                    {...startIconProps}
                  />
                )
              )}
            </>
          )}

          <input
            name={name}
            type={inputType}
            readOnly={readOnly}
            value={value}
            autoComplete="off"
            placeholder={placeholder}
            className={cn(
              "w-full text-sm placeholder:text-[#AFAFAF]! 2xl:text-sm outline-none font-normal px-1 text-secondary dark:text-white font-inter placeholder:font-normal  bg-transparent appearance-none!",
              innerInputClass,
              disabled && "pointer-events-none"
            )}
            onChange={onChange}
            disabled={disabled}
            {...rests}
          />

          {isPassword ? (
            <SvgColor
              src={showPassword ? Assets.Svgs.CloseEye : Assets.Svgs.Eye}
              onClick={() => TogglePassword(!showPassword)}
              className={cn(
                "w-5 cursor-pointer bg-medium-gray",
                error && "bg-[#940014]"
              )}
            />
          ) : (
            endIcon && (
              <span className="size-5 flex justify-center items-center">
                <Iconify
                  iconName={endIcon}
                  className={cn(
                    "cursor-pointer size-5 text-neutral-300 hover:text-neutral-400/80 transition-colors",
                    endIconClass
                  )}
                  {...endIconProps}
                />
              </span>
            )
          )}
        </div>

        {error && (
          <h1 className="text-xs font-normal text-[#D7263D] font-inter">
            {error}
          </h1>
        )}
      </div>
    );
  }
);
