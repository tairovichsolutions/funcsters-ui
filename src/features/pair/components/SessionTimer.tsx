"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * 45-minute session countdown.
 *
 * Server-authoritative: consumes session.endsAtEpochMs (set by the backend on
 * accept-guidelines). Client clock is only used to tick; both peers see the
 * same remaining time because both read the same server timestamp. This
 * prevents the "joiner-side timer drift" bug bashar hit.
 */
export function SessionTimer({ endsAtEpochMs }: { endsAtEpochMs: number | null }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (endsAtEpochMs == null) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        Waiting…
      </span>
    );
  }

  const remainingMs = Math.max(0, endsAtEpochMs - now);
  const total = Math.floor(remainingMs / 1000);
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");

  // Red when < 5 minutes left, amber when < 15, else normal.
  const urgency =
    remainingMs < 5 * 60_000
      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
      : remainingMs < 15 * 60_000
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
      : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tabular-nums ${urgency}`}>
      <Clock className="h-3 w-3" />
      {m}:{s}
    </span>
  );
}
