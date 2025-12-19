import { cn } from "@/lib";
import { ReactNode } from "react";

interface BoldType {
  children: ReactNode;
  className?: string;
}
export const Bold = ({ className, children }: BoldType) => {
  return <span className={cn("font-semibold", className)}>{children}</span>;
};
