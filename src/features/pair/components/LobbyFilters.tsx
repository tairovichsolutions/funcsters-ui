"use client";

import CountryDropdownV2 from "@/components/shared/DropDown/CountryDropdownV2";
import { ChevronDown, GlobeIcon, X } from "lucide-react";

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
const SPOKEN_LANGUAGES = ["EN", "ES", "FR", "DE", "PT", "ZH", "JA", "KO", "HI", "AR", "RU"];
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
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
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




import { useState, useRef, useEffect } from "react";


interface SelectProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
}

export function Select({ label, value, options, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find the selected label for the trigger button, fallback to the label prop
  const selectedLabel = options.find((opt) => opt.value === value)?.label || label;

  return (
    <div className="relative inline-block w-full   sm:w-50" ref={dropdownRef}>
      {/* Trigger Button (Matches your old select's look) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full h-[46px] bg-[#F8F9FB] dark:bg-background items-center justify-between rounded-lg border border-border  py-2 pl-3 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <span className="truncate text-[15px] ">{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-neutral-05   transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* New Dropdown Menu with Checkboxes */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[200px] rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="py-3.5 max-h-64 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = value === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false); // Close dropdown after selection
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span className="text-xs ">{opt.label}</span>

                  {/* Visual Checkbox */}
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${isSelected
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300 bg-white"
                      }`}
                  >
                    {isSelected && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7L6 10L11 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}