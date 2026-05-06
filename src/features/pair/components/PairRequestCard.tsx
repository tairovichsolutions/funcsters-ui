/* eslint-disable @next/next/no-img-element */
"use client";

import { DifficultyChip } from "@/components";
import { DifficultyLevelTypes } from "@/types";
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
const braketSign = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M6 3.33335L10.6667 8.00002L6 12.6667" stroke="#038CFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
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
          <span className="relative h-9 w-9 shrink-0 rounded-full bg-muted">
            <img alt="jahid" className="rounded-full " src={"https://lh3.googleusercontent.com/a/ACg8ocJR6GXSaAwU-Qs1DTc7B8zuObbvc4bh2UXPB2XKnB7e_WN6uEE=s96-c"} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{card.hostUsername}</div>
            <div className="truncate text-xs text-muted-foreground">{card?.occupation || "Developer"}</div>
          </div>
        </div>
        <div className="shrink-0 text-right text-xs">
          <div className="text-muted-foreground">

            {card.hostCountry ? (
              <>
                {/* {card.hostCountryFlag && <span className="mr-1">{card.hostCountryFlag}</span>} */}

                <div className="flex flex-col justify-end gap-1">
                  <span className="text-[#FFA539] bg-[#fff1df] px-1 text-xs   text-center   py-0.5 rounded-md">{card?.xp  } xp</span>
                  <div className="flex gap-1">
                    {card.hostCountryFlag && <img src={card.hostCountryFlag || ''} className="w-3 h-3" alt="country flag" />}
                    <span className="text-[10px]">{card.hostCountry}</span>
                  </div>
                </div>
              </>
            ) :
              <div className="flex flex-col gap-1">
                <span className="text-[#FFA539] bg-[#fff1df] px-1 text-xs  py-0.5 rounded-md">00 xp</span>
                <div className="flex gap-1">
                  <span></span>
                  <span className="text-[10px]"></span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <div className="my-5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 text-sm font-medium text-[#0F172A] hover:text-blue-500 hover:underline dark:text-blue-400">
          <span className="line-clamp-1 font-semibold">{card.challengeTitle}</span>
        </div>
        {card.challengeDifficulty && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium
              `}
          //  ${difficultyClass(              card.challengeDifficulty            )}
          >
            <DifficultyChip
              className="text-[10px] px-4 py-[5px] mb-1"
              level={(card?.challengeDifficulty as DifficultyLevelTypes)}
            />           
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm italic text-[#5A5D65]">
        {card?.description ? (
          <>{card.description}</>
        ) : (
          <>&quot;{focusAreaLabel(card.focusArea)}&quot;</>
        )}
      </p>

      <div className="my-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <div className="flex w-min">
            <span className="rotate-180">{braketSign}</span>
            <span className="-ml-1.5">{braketSign}</span>
          </div>
          {card.languageName}
        </span>
        <span className="inline-flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 14V6.31217C2 3.93465 3.60073 2 5.5679 2H11.4312C13.3988 2 15 3.93465 15 6.31217V7.63819C15 10.0157 13.3993 11.9504 11.4321 11.9504H5.65061L2 14ZM5.5679 2.96137C4.03917 2.96137 2.79544 4.46454 2.79544 6.31217V12.4932L5.47532 10.9885H11.4321C12.9608 10.9885 14.2046 9.4853 14.2046 7.63767V6.31165C14.2046 4.46402 12.9604 2.96085 11.4312 2.96085L5.5679 2.96137Z" fill="#00C851" />
          </svg>
          {card.spokenLanguages.join(", ") || "—"}
        </span>
      </div>



      <button
        type="button"
        disabled={disabled}
        title={lockedReason ?? undefined}
        onClick={() => createJoin.mutate(card.id)}
        className={`flex items-center justify-center gap-1 w-full rounded-md py-2 text-sm font-medium transition-colors ${disabled
          ? "bg-blue-200 text-white dark:bg-blue-900/30 dark:text-blue-400/60"
          : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
          <path d="M8.25 1.87848C8.86079 1.18646 9.75442 0.75 10.75 0.75C12.591 0.75 14.0833 2.24238 14.0833 4.08333C14.0833 5.92428 12.591 7.41667 10.75 7.41667C9.75442 7.41667 8.86079 6.9802 8.25 6.28819M10.75 15.75H0.75V14.9167C0.75 12.1552 2.98858 9.91667 5.75 9.91667C8.51142 9.91667 10.75 12.1552 10.75 14.9167V15.75ZM10.75 15.75H15.75V14.9167C15.75 12.1552 13.5114 9.91667 10.75 9.91667C9.83928 9.91667 8.98543 10.1602 8.25 10.5856M9.08333 4.08333C9.08333 5.92428 7.59095 7.41667 5.75 7.41667C3.90905 7.41667 2.41667 5.92428 2.41667 4.08333C2.41667 2.24238 3.90905 0.75 5.75 0.75C7.59095 0.75 9.08333 2.24238 9.08333 4.08333Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>  Pair With @{card.hostUsername}
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
//TODO: delete after pr done
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
