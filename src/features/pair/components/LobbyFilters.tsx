"use client";

import { ChevronDown } from "lucide-react";

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
const COUNTRIES = ["US", "CA", "UK", "DE", "FR", "IN", "BR", "JP", "KR", "CN"];

export function LobbyFilters({ value, onChange, languageOptions }: LobbyFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
      <Select
        label="Country"
        value={value.country ?? ""}
        options={[{ value: "", label: "All countries" }, ...COUNTRIES.map((c) => ({ value: c, label: c }))]}
        onChange={(v) => onChange({ ...value, country: v || undefined })}
      />
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
          className="ml-auto text-xs font-medium text-muted-foreground hover:text-foreground"
          onClick={() => onChange({})}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
}

function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="relative inline-flex items-center rounded-lg border border-border bg-background">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent py-2 pl-3 pr-8 text-sm focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-muted-foreground" />
    </label>
  );
}
