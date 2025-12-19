/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useTags } from "@/queries/useTags";

type ApiTag = {
  tagId: number;
  tagName: string;
  tagSlug: string;
};

export type TagOption = {
  id: string;
  label: string;
};

type UseTagOptionsResult = {
  tagOptions: TagOption[];
  tagLabelMap: Record<string, string>;
  isLoading: boolean;
  isError: boolean;
  raw: any;
};

export const useTagOptions = (): UseTagOptionsResult => {
  const { data, isLoading, isError } = useTags();

  const tagOptions = React.useMemo(
    () =>
      (data?.data ?? []).map((tag: ApiTag) => ({
        id: String(tag.tagId),
        label: tag.tagName,
      })),
    [data]
  );

  const tagLabelMap = React.useMemo(
    () =>
      (data?.data ?? []).reduce((acc: Record<string, string>, tag: ApiTag) => {
        acc[String(tag.tagId)] = tag.tagName;
        return acc;
      }, {}),
    [data]
  );

  return {
    tagOptions,
    tagLabelMap,
    isLoading,
    isError,
    raw: data,
  };
};
