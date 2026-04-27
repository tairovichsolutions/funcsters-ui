"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";

/**
 * Spec story 3.5: "a confirmation alert is displayed preventing accidental
 * clicks. When the leave action is confirmed, then the session is immediately
 * terminated for both users, kicking them to a post-session state."
 */
export function LeaveSessionConfirm({
  onConfirm,
  disabled,
}: {
  onConfirm: () => void | Promise<void>;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
      >
        Leave Session
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !busy && setOpen(false)}>
          <div
            className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/40">
                <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Leave the session?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  This ends the session immediately for both you and your partner. You can&apos;t rejoin.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                disabled={busy}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Stay
              </button>
              <button
                onClick={async () => {
                  setBusy(true);
                  try {
                    await onConfirm();
                  } finally {
                    setBusy(false);
                    setOpen(false);
                  }
                }}
                disabled={busy}
                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {busy ? "Leaving…" : "Leave Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
