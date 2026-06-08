"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export const NextThemesProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};
