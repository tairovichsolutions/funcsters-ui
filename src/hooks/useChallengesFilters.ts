"use client";

import { useCallback, useMemo, useState } from "react";

export type Filters = {
  search: string;
  difficulty: string[];
  status: string[];
  tags: string[];
};

export const defaultFilters = (): Filters => ({
  search: "",
  difficulty: [],
  status: [],
  tags: [],
});

export type FilterKey = keyof Filters;

export type ChallengeQueryParams = {
  search?: string;
  difficulties?: string;
  status?: string;
  tags?: string;
};

const normalizeToStringArray = (
  value: string[] | string | null | undefined
): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (value === null || value === undefined) return [];
  return [String(value)];
};

export const buildChallengeQueryParams = (
  filters: Filters
): ChallengeQueryParams => {
  const params: ChallengeQueryParams = {};
  const trimmedSearch = filters.search.trim();

  if (trimmedSearch) params.search = trimmedSearch;
  if (filters.difficulty.length)
    params.difficulties = filters.difficulty.join(",");
  if (filters.status.length) params.status = filters.status.join(",");
  if (filters.tags.length) params.tags = filters.tags.join(",");

  return params;
};

export function useChallengesFilters() {
  const [filters, setFilters] = useState<Filters>(() => defaultFilters());

  const setSearch = useCallback((s: string) => {
    setFilters((prev) => ({ ...prev, search: s }));
  }, []);

  const setDifficulty = useCallback((d: string[] | string | null) => {
    const next = normalizeToStringArray(d);
    setFilters((prev) => ({ ...prev, difficulty: next }));
  }, []);

  const setStatus = useCallback((s: string[] | string | null) => {
    const next = normalizeToStringArray(s);
    setFilters((prev) => ({ ...prev, status: next }));
  }, []);

  const setTags = useCallback((t: string[] | string | null) => {
    const next = normalizeToStringArray(t);
    setFilters((prev) => ({ ...prev, tags: next }));
  }, []);

  const clearAll = useCallback(() => setFilters(defaultFilters()), []);

  const remove = useCallback((key: FilterKey, value?: string) => {
    setFilters((prev) => {
      if (key === "search") return { ...prev, search: "" };

      if (key === "difficulty" || key === "status" || key === "tags") {
        if (!value) return { ...prev, [key]: [] };
        return {
          ...prev,
          [key]: (prev[key] as string[]).filter((x) => x !== value),
        };
      }

      return prev;
    });
  }, []);

  const queryParams = useMemo(
    () => buildChallengeQueryParams(filters),
    [filters]
  );

  return {
    filters,
    setSearch,
    setDifficulty,
    setStatus,
    setTags,
    clearAll,
    remove,
    queryParams,
  } as const;
}
