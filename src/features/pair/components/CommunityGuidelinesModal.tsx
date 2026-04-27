"use client";

import { Shield, X } from "lucide-react";
import { useState } from "react";
import { useAcceptGuidelines } from "../hooks/usePairQueries";

/**
 * Spec story 2.4: "the joiner MUST be prompted with and agree to the Community
 * Guidelines before the session starts and the codebase loads."
 *
 * Shown on /pair/session/[id] when session.status === "AWAITING_GUIDELINES"
 * for the joiner. Agreeing calls POST /sessions/{id}/accept-guidelines which
 * transitions the session to ACTIVE and both peers get SESSION_STARTED via STOMP.
 */
interface CommunityGuidelinesModalProps {
  open: boolean;
  sessionId: number | null;
  onAgreed?: () => void;
  onDecline?: () => void;
}

export function CommunityGuidelinesModal({
  open,
  sessionId,
  onAgreed,
  onDecline,
}: CommunityGuidelinesModalProps) {
  const [agreed, setAgreed] = useState(false);
  const acceptMutation = useAcceptGuidelines();

  if (!open || sessionId == null) return null;

  const handleAgree = async () => {
    if (!agreed) return;
    await acceptMutation.mutateAsync(sessionId);
    onAgreed?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Community Guidelines</h2>
          </div>
          {onDecline && (
            <button onClick={onDecline} className="rounded-md p-1 hover:bg-muted" aria-label="Decline">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Please agree to these before the session starts.
        </p>

        <ul className="mt-4 space-y-3 text-sm">
          <Guideline>Be respectful. No harassment, hateful speech, or personal attacks.</Guideline>
          <Guideline>Stay on topic. The session is for collaborating on the coding challenge.</Guideline>
          <Guideline>Audio only. No camera, no screen-sharing, no recording without consent.</Guideline>
          <Guideline>No sharing of proprietary or sensitive code you don&apos;t own.</Guideline>
          <Guideline>Leave politely. Use the Leave button; abrupt exits may be reported.</Guideline>
          <Guideline>Violations may result in suspension from pair programming.</Guideline>
        </ul>

        <label className="mt-5 flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border accent-blue-600"
          />
          <span>
            <span className="font-medium">I have read and agree to the Community Guidelines.</span>
            <br />
            <span className="text-xs text-muted-foreground">
              By continuing you confirm your behavior during the session will be respectful and collaborative.
            </span>
          </span>
        </label>

        {acceptMutation.isError && (
          <div className="mt-3 rounded-md bg-rose-50 p-2 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            Could not start the session. The invitation may have expired. Please return to the lobby.
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          {onDecline && (
            <button
              onClick={onDecline}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Decline & Leave
            </button>
          )}
          <button
            onClick={handleAgree}
            disabled={!agreed || acceptMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {acceptMutation.isPending ? "Starting…" : "Agree & Join Session"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Guideline({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
      <span>{children}</span>
    </li>
  );
}
