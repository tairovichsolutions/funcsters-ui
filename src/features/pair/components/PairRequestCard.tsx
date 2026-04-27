"use client";

import { Code2, MessageCircle } from "lucide-react";
import { useCreateJoinRequest, useMyActiveJoin, useMyActiveRequest, useMyActiveSession } from "../hooks/usePairQueries";
import type { PairRequestCardDto } from "../types";

/**
 * Lobby / request list card. Mirrors the Figma "Jane Cooper" card structure:
 *   avatar + name/role | XP + country
 *   challenge link + difficulty tag
 *   italic focus-area excerpt
 *   primary language tag with code icon
 *   spoken languages with chat icon
 *   "Pair With @user" button (disabled when user has any active request/join/session)
 *
 * Privacy invariant: DTO has no email field — we literally can't expose one here.
 */
export function PairRequestCard({ card }: { card: PairRequestCardDto }) {
  const createJoin = useCreateJoinRequest();
  const { data: myRequest } = useMyActiveRequest();
  const { data: myJoin } = useMyActiveJoin();
  const { data: mySession } = useMyActiveSession();

  // Spec v2 story 1.3: a user with any active state cannot also join.
  const lockedReason =
    mySession && mySession.status !== "ENDED"
      ? "You are in an active session"
      : myRequest && myRequest.status !== "EXPIRED" && myRequest.status !== "CANCELED"
      ? "You already have an active pair request"
      : myJoin && myJoin.status === "PENDING"
      ? "You already have a pending join request"
      : null;

  const disabled = lockedReason != null || createJoin.isPending;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 shrink-0 rounded-full bg-muted">
            <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{card.hostUsername}</div>
            <div className="truncate text-xs text-muted-foreground">Developer</div>
          </div>
        </div>
        <div className="shrink-0 text-right text-xs">
          <div className="text-muted-foreground">
            {card.hostCountry ? (
              <>
                {card.hostCountryFlag && <span className="mr-1">{card.hostCountryFlag}</span>}
                {card.hostCountry}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          <span className="line-clamp-1">{card.challengeTitle}</span>
        </div>
        {card.challengeDifficulty && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${difficultyClass(
              card.challengeDifficulty
            )}`}
          >
            {toTitle(card.challengeDifficulty)}
          </span>
        )}
      </div>

      <p className="mt-2 line-clamp-2 text-sm italic text-muted-foreground">
        {focusAreaLabel(card.focusArea)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Code2 className="h-3 w-3" />
          {card.languageName}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          {card.spokenLanguages.join(", ") || "—"}
        </span>
      </div>

      <div className="mt-4 flex-1" />

      <button
        type="button"
        disabled={disabled}
        title={lockedReason ?? undefined}
        onClick={() => createJoin.mutate(card.id)}
        className={`w-full rounded-md py-2 text-sm font-medium transition-colors ${
          disabled
            ? "bg-blue-200 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400/60"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Pair With @{card.hostUsername}
      </button>
    </div>
  );
}

function focusAreaLabel(f: PairRequestCardDto["focusArea"]): string {
  switch (f) {
    case "DEBUGGING":
      return "Looking for help debugging this challenge.";
    case "REFACTORING":
      return "Looking to refactor and improve my solution.";
    case "LEARNING":
      return "Looking to learn — happy to be walked through it.";
    case "OPTIMIZATION":
      return "Looking to discuss complexity / optimizations.";
    case "GENERAL":
    default:
      return "Looking for someone to pair with.";
  }
}

function difficultyClass(d: string): string {
  switch (d.toUpperCase()) {
    case "EASY":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "MEDIUM":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    case "HARD":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300";
    case "EXPERT":
      return "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function toTitle(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
