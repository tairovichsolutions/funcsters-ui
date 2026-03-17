import React from "react";
import { cn } from "@/lib";
import OtpInput from "react-otp-input";

interface CustomOtpInputProps {
  value: string;
  error?: string;
  label?: string;
  onChange: (value: string) => void;
}

export const CustomOtpInput: React.FC<CustomOtpInputProps> = ({
  error,
  label,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <h1 className="text-sm font-semibold font-inter">{label}</h1>}
      <OtpInput
        value={value}
        onChange={onChange}
        numInputs={5}
        renderInput={(props) => (
          <input
            {...props}
            className={cn(
              "h-12 w-full text-center rounded-lg text-primary focus:outline-none focus:ring-2 focus:border-transparent",
              value.length > 0
                ? "bg-primary/10!"
                : "bg-input-background border border-input-border! ",
              error
                ? "border-[#940014] focus:ring-red-300"
                : "border-medium-gray focus:ring-blue-500"
            )}
            style={{
              fontSize: "20px",
              transition: "border-color 0.3s ease",
            }}
          />
        )}
        containerStyle={{
          display: "flex",
          gap: "0.75rem",
        }}
      />
      {error && (
        <h1 className="text-xs font-normal text-destructive font-inter">
          {error}
        </h1>
      )}
    </div>
  );
};
