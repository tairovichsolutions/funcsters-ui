"use client";

import CountryDropdownV2 from "@/components/shared/DropDown/CountryDropdownV2";
import { Select } from "@/components/shared/DropDown/Select";
import { X } from "lucide-react";

export interface LobbyFilterState {
  country?: string;
  difficulty?: string;
  languageId?: number;
  spokenLanguage?: string;
}

interface LobbyFiltersProps {
  value: LobbyFilterState;
  onChange: (next: LobbyFilterState) => void;
  languageOptions: Array<{ id: number; name: string }>;
}

const DIFFICULTY_OPTIONS = ["EASY", "MEDIUM", "HARD", "EXPERT"];
const SPOKEN_LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Chinese", "Japanese", "Korean", "Hindi", "Arabic", "Russian"];
// const COUNTRIES = ["US", "CA", "UK", "DE", "FR", "IN", "BR", "JP", "KR", "CN"];

export const COUNTRIES1 = [
  { name: "All Country", image: null, code: null, },
  {
    name: "United States",
    image: "https://flagcdn.com/w20/us.png",
    code: "US",
  },
  {
    name: "Brazil",
    image: "https://flagcdn.com/w20/br.png",
    code: "BR",
  },
  {
    name: "Japan",
    image: "https://flagcdn.com/w20/jp.png",
    code: "JP",
  },
  {
    name: "Italy",
    image: "https://flagcdn.com/w20/it.png",
    code: "IT",
  },
  {
    name: "United Kingdom",
    image: "https://flagcdn.com/w20/gb.png",
    code: "UK",
  },
  {
    name: "Spain",
    image: "https://flagcdn.com/w20/es.png",
    code: "ES",
  },
];
export function LobbyFilters({ value, onChange, languageOptions }: LobbyFiltersProps) {
  return (
    <div className="flex flex-wrap dark:bg-[#232629] items-center gap-3 rounded-xl border border-border bg-card p-3">
      {/* <CountryDropdownV2
  value={value.country || ""}
  options={COUNTRIES1.map((c) => ({
    // If the name is "All Countries", output "", otherwise output the country name
    value: c.name === "All Countries" ? "" : c.name,
    label: c.name,
    image: c.image 
  }))}
  onChange={(v) => onChange({ ...value, country: v || undefined })}
/> */}
      <CountryDropdownV2
        // 1. Use || "" so that undefined/null strictly becomes ""
        value={value.country || ""}

        options={COUNTRIES1.map((c) => ({
          // 2. BULLETPROOF CHECK: If code is null (the "All" option), force value to ""
          // Otherwise, use the country name (e.g., "United States")
          value: c.code === null ? "" : c.name,

          label: c.name,
          image: c.image
        }))}

        onChange={(v) => onChange({ ...value, country: v || undefined })}
      />
      {/* <Select
        label="Country"
        value={value.country ?? ""}
        options={[{ value: "", label: "All countries" }, ...COUNTRIES.map((c) => ({ value: c, label: c }))]}
        onChange={(v) => onChange({ ...value, country: v || undefined })}
      /> */}
      <Select
        label="Difficulty"
        value={value.difficulty ?? ""}
        options={[
          { value: "", label: "Any difficulty" },
          ...DIFFICULTY_OPTIONS.map((d) => ({ value: d, label: d.charAt(0) + d.slice(1).toLowerCase() })),
        ]}
        onChange={(v) => onChange({ ...value, difficulty: v || undefined })}
      />
      <Select
        label="Dev Language"
        value={value.languageId != null ? String(value.languageId) : ""}
        options={[
          { value: "", label: "Any language" },
          ...languageOptions.map((l) => ({ value: String(l.id), label: l.name })),
        ]}
        onChange={(v) => onChange({ ...value, languageId: v ? Number(v) : undefined })}
      />
      <Select
        label="Spoken Language"
        value={value.spokenLanguage ?? ""}
        options={[
          { value: "", label: "Any spoken language" },
          ...SPOKEN_LANGUAGES.map((s) => ({ value: s, label: s })),
        ]}
        onChange={(v) => onChange({ ...value, spokenLanguage: v || undefined })}
      />

      {(value.country || value.difficulty || value.languageId != null || value.spokenLanguage) && (
        <button
          type="button"
          className="ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-800"
          onClick={() => onChange({})}
        >
          <X size={14} strokeWidth={2.5} />
          Clear filters
        </button>
      )}
    </div>
  );
}




