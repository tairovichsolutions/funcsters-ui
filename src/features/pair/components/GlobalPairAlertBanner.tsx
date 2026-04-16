"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, UserRoundPlus, Users } from "lucide-react";
import { useCancelJoinRequest, useCancelPairRequest, useMyActiveJoin, useMyActiveRequest, useMyActiveSession } from "../hooks/usePairQueries";

/**
 * Spec v2 global rule 3: persistent banner on every page when the current user
 * has any in-flight pair-programming state.
 *
 * Three visual states:
 *   1. PERMISSION GRANTED (orange) — session in AWAITING_GUIDELINES, 2-min grace
 *      running, joiner needs to click "Join Session Now"
 *   2. REQUEST SENT (green)        — user's own join request is PENDING
 *   3. BROADCASTING (blue)         — user's own pair request is BROADCASTING
 *
 * Priority: session > join > request.
 */
export function GlobalPairAlertBanner() {
  const { data: mySession } = useMyActiveSession();
  const { data: myJoin } = useMyActiveJoin();
  const { data: myRequest } = useMyActiveRequest();

  if (mySession && mySession.status === "AWAITING_GUIDELINES") {
    return (
      <PermissionGrantedBanner
        sessionId={mySession.id}
        hostUsername={mySession.hostUsername}
        expiresAtEpochMs={mySession.acceptedAtEpochMs + 2 * 60 * 1000}
      />
    );
  }
  if (myJoin && myJoin.status === "PENDING") {
    return <JoinPendingBanner joinId={myJoin.id} expiresAtEpochMs={myJoin.expiresAtEpochMs} />;
  }
  if (myRequest && (myRequest.status === "BROADCASTING" || myRequest.status === "AWAITING_JOINER")) {
    return (
      <BroadcastingBanner
        requestId={myRequest.id}
        challengeId={myRequest.challengeId}
        challengeTitle={myRequest.challengeTitle}
        expiresAtEpochMs={myRequest.expiresAtEpochMs}
      />
    );
  }
  return null;
}

function PermissionGrantedBanner({
  sessionId,
  hostUsername,
  expiresAtEpochMs,
}: {
  sessionId: number;
  hostUsername: string;
  expiresAtEpochMs: number;
}) {
  const remaining = useCountdown(expiresAtEpochMs);

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="relative flex items-center gap-4 rounded-lg border border-orange-200 bg-orange-50 p-4 pl-5 dark:border-orange-900/50 dark:bg-orange-950/30">
        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-orange-500" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-orange-700 dark:text-orange-300">PERMISSION GRANTED!</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-xs text-orange-800 dark:bg-orange-900/40 dark:text-orange-200">
              <Clock className="h-3 w-3" />
              {formatCountdown(remaining)}
            </span>
          </div>
          <div className="mt-1 truncate text-sm text-orange-900 dark:text-orange-100">
            @{hostUsername} accepted your request. Join the session before this timer runs out.
          </div>
        </div>
        <Link
          href={`/pair/session/${sessionId}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          <Users className="h-4 w-4" />
          Join Session Now
        </Link>
      </div>
    </div>
  );
}

function JoinPendingBanner({ joinId, expiresAtEpochMs }: { joinId: number; expiresAtEpochMs: number }) {
  const remaining = useCountdown(expiresAtEpochMs);
  const cancel = useCancelJoinRequest();

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="relative flex items-center gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 pl-5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-emerald-500" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">REQUEST SENT:</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
              <Clock className="h-3 w-3" />
              {formatCountdown(remaining)}
            </span>
          </div>
          <div className="mt-1 text-sm text-emerald-900 dark:text-emerald-100">
            Waiting for the host to respond to your join request.
          </div>
        </div>
        <button
          onClick={() => cancel.mutate(joinId)}
          disabled={cancel.isPending}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900 disabled:opacity-50 dark:text-emerald-300 dark:hover:text-emerald-100"
        >
          Cancel Request
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Waiting For Response...
        </span>
      </div>
    </div>
  );
}

function BroadcastingBanner({
  requestId,
  challengeId,
  challengeTitle,
  expiresAtEpochMs,
}: {
  requestId: number;
  challengeId: number;
  challengeTitle: string;
  expiresAtEpochMs: number;
}) {
  const remaining = useCountdown(expiresAtEpochMs);
  const cancel = useCancelPairRequest();
  // Return user to their challenge detail where the PairProgramButton
  // renders in "Broadcasting" mode and opens the incoming-joins sidebar.
  const challengeHref = `/challenges/${challengeId}/detail`;

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="relative flex items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 pl-5 dark:border-blue-900/50 dark:bg-blue-950/30">
        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-blue-500" />
        <UserRoundPlus className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-blue-700 dark:text-blue-300">BROADCASTING:</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
              <Clock className="h-3 w-3" />
              {formatCountdown(remaining)}
            </span>
          </div>
          <div className="mt-1 truncate text-sm text-blue-900 dark:text-blue-100">
            Waiting for a pair on{" "}
            <Link href={challengeHref} className="font-medium underline-offset-2 hover:underline">
              “{challengeTitle}”
            </Link>
          </div>
        </div>
        <button
          onClick={() => cancel.mutate(requestId)}
          disabled={cancel.isPending}
          className="text-sm font-medium text-blue-700 hover:text-blue-900 disabled:opacity-50 dark:text-blue-300 dark:hover:text-blue-100"
        >
          Cancel Request
        </button>
        <Link
          href={challengeHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          View Incoming
        </Link>
      </div>
    </div>
  );
}

/** Ticks every 1s, returns ms-remaining against a server-authoritative epoch. */
function useCountdown(expiresAtEpochMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return Math.max(0, expiresAtEpochMs - now);
}

function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
