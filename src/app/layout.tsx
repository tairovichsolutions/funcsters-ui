import "./globals.css";

import type { Metadata } from "next";
import { localFontVars } from "@/fonts/local-fonts";
import { googleFontVars } from "@/fonts/google-fonts";
import { AuthModal } from "@/containers/AuthModals/AuthModal";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ToasterComponent } from "@/components/ToasterComponent";
import { AuthModalsProvider } from "@/providers/AuthModalsProvider";
import { NextThemesProvider } from "@/providers/NextThemesProvider";
import { EditorSettingsProvider } from "@/context/EditorSettingsContext";
import { ProfileSettingModal } from "@/containers/profileSetting/ProfileSettingModal";
import { ProfileSetingModalsProvider } from "@/providers/ProfileSettingModalsProvider";
import { LanguageImplementationsProvider } from "@/context/languageImplementationsContext";
import { PairSessionProvider } from "@/features/pair/providers/PairSessionProvider";
import { GlobalPairAlertBanner } from "@/features/pair/components/GlobalPairAlertBanner";

export const metadata: Metadata = {
  title: "funcsters",
  description: "Created by funcsters app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${googleFontVars} ${localFontVars} font-inter antialiased`}
      >
        <NextThemesProvider>
          <ReactQueryProvider>
            <LanguageImplementationsProvider>
              <EditorSettingsProvider>
                <AuthModalsProvider>
                  <ProfileSetingModalsProvider>
                    <PairSessionProvider>
                      {/* Spec v2 global rule 3: persistent alert banner on every
                          page when the user has any in-flight pair-programming
                          state (broadcasting, pending join, permission granted,
                          or active session). Self-renders null when no state. */}
                      <div className="sticky top-0 z-40 w-full pt-2">
                        <GlobalPairAlertBanner />
                      </div>
                      {children}
                      <AuthModal />
                      <ToasterComponent />
                      <ProfileSettingModal />
                    </PairSessionProvider>
                  </ProfileSetingModalsProvider>
                </AuthModalsProvider>
              </EditorSettingsProvider>
            </LanguageImplementationsProvider>
          </ReactQueryProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
