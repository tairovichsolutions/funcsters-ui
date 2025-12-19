import React from "react";

interface KeyValueBoxType {
  label: string;
  value: string | number;
}
export const KeyValueBox = React.memo(({ label, value }: KeyValueBoxType) => {
  return (
    <div>
      <p className="font-medium text-[13px] text-foreground/90">{label}</p>
      <div className="mt-1 rounded-md bg-white/70 dark:bg-muted/50 border p-2 text-xs font-mono text-foreground/80 break-all">
        {value}
      </div>
    </div>
  );
});
