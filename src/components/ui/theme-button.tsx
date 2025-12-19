"use client";

import { cn } from "@/lib";
import { Button } from "./button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface ThemeButtonType {
  className?: string;
  iconClass?: string;
}

export const ThemeButton = ({
  className,
  iconClass = "size-5!",
}: ThemeButtonType) => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      variant={"ghost"}
      aria-label="Theme Icon"
      className={cn("size-9!", className)}
      size={"icon"}
    >
      {theme === "dark" ? (
        <Sun className={cn(iconClass)} />
      ) : (
        <Moon className={cn(iconClass)} />
      )}
    </Button>
  );
};
