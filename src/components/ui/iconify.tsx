import { cn } from "@/lib";
import { Icon } from "@iconify/react";

interface IconifyProps {
  iconName: string | undefined;
  className?: string;
  strokeWidth?: number;
}

export const Iconify = ({
  iconName,
  className,
  strokeWidth,
  ...rests
}: IconifyProps) => {
  return (
    <Icon
      strokeWidth={strokeWidth}
      {...rests}
      icon={iconName ?? "mdi:alert-circle-outline"}
      className={cn("size-5", className)}
    />
  );
};
