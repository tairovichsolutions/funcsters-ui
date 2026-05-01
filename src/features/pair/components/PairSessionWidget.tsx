"use client";

import { Clock, Mic, MicOff, UserRound } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useMyActiveSession } from "../hooks/usePairQueries";
import { usePairSession } from "../providers/PairSessionProvider";

/**
 * Compact session widget that sits in the middle of ChallengesWorkSpaceHeader
 * whenever the current user is in an ACTIVE pair-programming session on the
 * SAME challenge they're viewing. Shows: two avatars, partner username, 45-min
 * countdown, mute/unmute mic, Leave Session.
 *
 * Renders null when there's no session or the user is on a different challenge.
 * In that case the global banner at the top of the page handles "return to
 * your session" navigation instead.
 */
export function PairSessionWidget() {
  const { id: urlChallengeSlug } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { data: session } = useMyActiveSession();
  const { connectionState, localMuted, mute, unmute, leave } = usePairSession();

  if (!session || session.status !== "ACTIVE") return null;

  // Only show on the challenge the session is tied to. The provider's
  // auto-redirect + global banner handle the case where the user opens a
  // different challenge while mid-session.
  const sessionSlug = getSessionChallengeSlug(session);
  if (sessionSlug && urlChallengeSlug && sessionSlug !== urlChallengeSlug) return null;

  const isHost = currentUser?.username === session.hostUsername;
  const partner = isHost ? session.joinerUsername : session.hostUsername;

  return (
    <div className="flex items-center gap-2 rounded-full border border-[#EFEFEF] bg-white px-2 py-1">
      <div className="flex -space-x-2">
        <Avatar label="ME" accent="emerald" />
        <Avatar label={(partner ?? "??").slice(0, 2).toUpperCase()} accent="indigo" />
      </div>
      <div className="h-6 w-px bg-[#EFEFEF]"></div>
      <SessionTimerCompact endsAtEpochMs={session.endsAtEpochMs} />
      <MicButton muted={localMuted} connected={connectionState === "connected"} onClick={localMuted ? unmute : mute} />
      <LeaveButton onLeave={async () => {
        await leave();
        router.refresh();
      }} />
    </div>
  );
}

function Avatar({ label, accent }: { label: string; accent: "emerald" | "indigo" }) {
  const bg =
    accent === "emerald"
      ? "bg-emerald-500 text-white"
      : "bg-indigo-500 text-white";
  return (
    <div className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-semibold ${bg}`}>
      {label}
      <span className="absolute -bottom-0.5 -right-0.5 block h-2 w-2 rounded-full border border-background bg-emerald-400" />
    </div>
  );
}

function SessionTimerCompact({ endsAtEpochMs }: { endsAtEpochMs: number | null }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (endsAtEpochMs == null) {
    return <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">--:--</span>;
  }
  const remaining = Math.max(0, endsAtEpochMs - now);
  const total = Math.floor(remaining / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  const urgency =
    remaining < 5 * 60_000
      ? "text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300"
      : remaining < 15 * 60_000
        ? "text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300"
        : "text-[#03CE63] bg-white dark:bg-emerald-950/40 dark:text-emerald-300";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border  border-slate-100  px-4 py-1.5 text-sm font-bold tabular-nums  ${urgency}`}>
      <Clock className="h-5 w-5" strokeWidth={2.5} />
      <span>
        {m}:{s}
      </span>
    </span>
  );
}

function MicButton({ muted, connected, onClick }: { muted: boolean; connected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={muted ? "Unmute" : "Mute"}
      className={`inline-flex h-7 w-7  items-center justify-center rounded-full transition-colors ${!connected
          ? "bg-muted text-muted-foreground"
          : muted
            ? "bg-[#EFEFEF]  text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300"
            : "bg-[#EFEFEF]  text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
        }`}
    >

      {muted ? <MicOff className="h-3.5 w-3.5 font-bold text-neutral-01 text-2xl! " /> : <Mic className="h-3.5 w-3.5 font-bold text-neutral-01 text-2xl! " />}
    </button>
  );
}

function LeaveButton({ onLeave }: { onLeave: () => void | Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-7 rounded-full border-rose-300 bg-rose-50 px-3 py-0 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
        onClick={() => setConfirming(true)}
      >
        Leave
      </Button>
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !busy && setConfirming(false)}>
          <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold">Leave the session?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This ends the session for both you and your partner.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirming(false)} disabled={busy} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted">Stay</button>
              <button
                onClick={async () => { setBusy(true); try { await onLeave(); } finally { setBusy(false); setConfirming(false); } }}
                disabled={busy}
                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
              >{busy ? "Leaving…" : "Leave Session"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getSessionChallengeSlug(session: { challengeSlug?: string }): string | null {
  return session.challengeSlug ?? null;
}
