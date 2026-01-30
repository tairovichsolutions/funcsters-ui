import React from "react";
import { KeyValueBox } from "./KeyValueBox";

const formatValue = (value: unknown): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  if (Array.isArray(value)) {
    return `[ ${value.map(formatValue).join(", ")} ]`;
  }

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export const InputKeyValues = React.memo(({ input }: { input: unknown }) => {
  if (typeof input === "object" && input !== null && !Array.isArray(input)) {
    const entries = Object.entries(input as Record<string, unknown>);

    const combined = entries
      .map(([key, value]) => `${key} = ${formatValue(value)}`)
      .join("\n\n");

    return <KeyValueBox label="Input" value={combined || "{}"} />;
  }

  return <KeyValueBox label="Input" value={formatValue(input)} />;
});
