"use client";

import { Code2, MessageCircle, X } from "lucide-react";
import { useAcceptJoin, useIncomingJoins, useRejectJoin } from "../hooks/usePairQueries";
import type { PairJoinRequestDto } from "../types";

/**
 * Right-side drawer that appears when a broadcasting host clicks the
 * "Broadcasting" button. Lists PENDING join requests with Accept / Reject.
 *
 * Matches the "Pair Requeste (N)" drawer in Figma's "accept and pair.png":
 *   - Orange dot + title + count badge
 *   - "N developers want to pair with you on this challenge."
 *   - Each request: avatar + name + role | XP + country | language tags
 *   - Primary Accept & Pair button (blue, full-width)
 *   - Secondary Reject link
 */
interface IncomingJoinsSidebarProps {
  open: boolean;
  onClose: () => void;
  pairRequestId: number | null;
  onAccept?: (sessionId: number) => void;
}

export function IncomingJoinsSidebar({ open, onClose, pairRequestId, onAccept }: IncomingJoinsSidebarProps) {
  const { data: joins = [], isLoading } = useIncomingJoins(open ? pairRequestId ?? undefined : undefined);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex" onClick={onClose}>
      <div className="flex-1" />
      <aside
        className="relative flex h-full w-full max-w-sm flex-col bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
            </span>
            <h2 className="text-base font-semibold">Pair Requests</h2>
            <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
              {joins.length}
            </span>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          <p className="mb-4 text-sm text-muted-foreground">
            {joins.length === 0
              ? isLoading
                ? "Loading…"
                : "No one has requested to join yet."
              : `${joins.length} developer${joins.length === 1 ? "" : "s"} want to pair with you on this challenge.`}
          </p>

          <div className="space-y-3">
            {joins.map((jr) => (
              <JoinRequestCard key={jr.id} jr={jr} onAccept={onAccept} />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function JoinRequestCard({
  jr,
  onAccept,
}: {
  jr: PairJoinRequestDto;
  onAccept?: (sessionId: number) => void;
}) {
  const acceptMutation = useAcceptJoin();
  const rejectMutation = useRejectJoin();

  const handleAccept = async () => {
    const session = await acceptMutation.mutateAsync(jr.id);
    // Host stays on the current challenge page — the top bar widget + editor
    // transition to session mode via the provider once session is ACTIVE.
    // No navigation needed; the global session state drives the UI.
    onAccept?.(session.id);
  };

  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 shrink-0 rounded-full bg-muted">
            <span className="absolute -bottom-0.5 -right-0.5 block h-2 w-2 rounded-full border-2 border-background bg-emerald-500" />
          </div>
          <div>
            <div className="text-sm font-semibold">{jr.joinerUsername}</div>
            <div className="text-xs text-muted-foreground">Developer</div>
          </div>
        </div>
        {jr.joinerCountry && (
          <div className="text-right text-xs text-muted-foreground">{jr.joinerCountry}</div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Code2 className="h-3 w-3" />
          Multiple
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          English
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleAccept}
          disabled={acceptMutation.isPending}
          className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {acceptMutation.isPending ? "Accepting…" : "Accept & Pair"}
        </button>
        <button
          onClick={() => rejectMutation.mutate(jr.id)}
          disabled={rejectMutation.isPending}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          aria-label="Reject"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
