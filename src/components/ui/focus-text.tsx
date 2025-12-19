import { cn } from "@/lib";
import { ReactNode } from "react";

interface FocusTextType {
  children: ReactNode;
  className?: string;
}
export const FocusText = ({ className, children }: FocusTextType) => {
  return <span className={cn("text-primary", className)}>{children}</span>;
};
