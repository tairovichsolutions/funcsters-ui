"use client";

import { cn } from "@/lib";
import React, { useMemo } from "react";
import { Iconify } from "@/components/ui/iconify";
import { SelectBox, type SelectOption } from "@/components/ui/select-box";
import { LANGUAGE_ICON_MAP, prettifyLanguageName } from "@/constants/Language";
import { useLanguageImplementations } from "@/context/languageImplementationsContext";

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  const { languageList, selectedLanguage, handleLanguageChange } =
    useLanguageImplementations();

  const options: SelectOption[] = useMemo(() => {
    return (languageList ?? []).map((lang) => {
      const key = lang.languageName.toLowerCase();
      const iconConfig = LANGUAGE_ICON_MAP[key];

      return {
        value: lang.languageName,
        label: iconConfig?.label ?? prettifyLanguageName(lang.languageName),
        startIcon: iconConfig ? (
          <Iconify
            iconName={iconConfig.iconName}
            className="size-3.5 leading-none shrink-0"
          />
        ) : undefined,
      };
    });
  }, [languageList]);

  const handleChange = (value: string) => {
    handleLanguageChange(value);
  };

  const currentValue = selectedLanguage || languageList[0]?.languageName || "";
  return (
    <SelectBox
      contantClass="text-xs!"
      value={currentValue}
      onValueChange={handleChange}
      options={options}
      className={cn(className)}
      placeholder="Select language"
    />
  );
};
