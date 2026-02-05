"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface LanguageImplementation {
  languageId: number;
  starterCode: string;
  languageName: string;
  userProgress: string;
  viewedSolution: boolean;
}

interface LanguageImplementationsContextType {
  xpCount: number;
  starterCode: string;
  userProgress: string;
  selectedLanguage: string;
  viewedSolution: boolean;
  languageId: number | null;
  setXpCount: (xp: number) => void;
  languageList: LanguageImplementation[];
  handleLanguageChange: (lang: string) => void;
  setLanguages: (langs: LanguageImplementation[]) => void;
  updateUserProgress?: (languageId: number, newProgress: string) => void;
  markViewedSolution?: (languageId: number) => void;
}

const LanguageImplementationsContext = createContext<
  LanguageImplementationsContextType | undefined
>(undefined);

export const LanguageImplementationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [xpCount, setXpCount] = useState<number>(0);
  const [starterCode, setStarterCode] = useState<string>("");
  const [userProgress, setUserProgress] = useState<string>("TODO");
  const [languageId, setLanguageId] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [languageList, setLanguageList] = useState<LanguageImplementation[]>(
    [],
  );

  const handleLanguageChange = useCallback(
    (lang: string) => {
      setSelectedLanguage(lang);
      localStorage.setItem("selectedLanguage", lang);
      const found = languageList.find(
        (l) => l.languageName.toLowerCase() === lang.toLowerCase(),
      );
      if (found) {
        setStarterCode(found.starterCode);
        setLanguageId(found.languageId);
        setUserProgress(found.userProgress);
      }
    },
    [languageList],
  );

  const viewedSolution =
    languageList.find((l) => l.languageId === languageId)?.viewedSolution ??
    false;

  const markViewedSolution = useCallback((id: number) => {
    setLanguageList((prev) =>
      prev.map((l) =>
        l.languageId === id ? { ...l, viewedSolution: true } : l,
      ),
    );
  }, []);

  const setLanguages = useCallback((langs: LanguageImplementation[]) => {
    setLanguageList(langs);

    if (langs.length === 0) {
      setSelectedLanguage("");
      setStarterCode("");
      setLanguageId(null);
      setUserProgress("TODO");
      return;
    }

    setSelectedLanguage((prev) => {
      const saved = localStorage.getItem("selectedLanguage");
      const existing =
        (saved && langs.find((l) => l.languageName === saved)) ||
        (prev && langs.find((l) => l.languageName === prev));

      const target = existing || langs[0];

      setStarterCode(target.starterCode);
      setLanguageId(target.languageId);
      setUserProgress(target.userProgress);

      return target.languageName;
    });
  }, []);

  const updateUserProgress = useCallback(
    (id: number, newProgress: string) => {
      setLanguageList((prev) =>
        prev.map((l) =>
          l.languageId === id ? { ...l, userProgress: newProgress } : l,
        ),
      );

      if (languageId === id) {
        setUserProgress(newProgress);
      }
    },
    [languageId],
  );

  return (
    <LanguageImplementationsContext.Provider
      value={{
        xpCount,
        setXpCount,
        languageId,
        starterCode,
        setLanguages,
        userProgress,
        languageList,
        selectedLanguage,
        viewedSolution,
        updateUserProgress,
        handleLanguageChange,
        markViewedSolution,
      }}
    >
      {children}
    </LanguageImplementationsContext.Provider>
  );
};

export const useLanguageImplementations = () => {
  const context = useContext(LanguageImplementationsContext);
  if (!context) {
    throw new Error(
      "useLanguageImplementations must be used within LanguageImplementationsProvider",
    );
  }
  return context;
};
