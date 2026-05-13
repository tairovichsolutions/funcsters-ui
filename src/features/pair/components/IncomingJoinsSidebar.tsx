/* eslint-disable @next/next/no-img-element */
"use client";

import { Clock, X } from "lucide-react";
import { useAcceptJoin, useIncomingJoins, useMyActiveRequest, useRejectJoin } from "../hooks/usePairQueries";
import type { PairJoinRequestDto } from "../types";
import { formatCountdown, useCountdown } from "./GlobalPairAlertBanner";
import { resolveAvatarUrl } from "../utils/resolveAvatarUrl";

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
  const { data: myRequest } = useMyActiveRequest();
  const remaining = useCountdown(myRequest?.expiresAtEpochMs || 0);
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
            <h2 className="text-base font-bold">Pair Requests</h2>
            <span className="inline-flex w-6 h-6 min-w-6 items-center justify-center rounded-full bg-[#FF6C0A29]  py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
              {joins.length}
            </span>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <style>{`
        /* Wave Animation (Kept from previous) */
        @keyframes wave {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-wave {
          animation: wave 2s cubic-bezier(0.3, 0, 0.3, 1) infinite;
        }
        .delay-0s { animation-delay: 0s; }
        .delay-1s { animation-delay: 1s; }
        .delay-2s { animation-delay: 2s; }

        /* NEW: Spinner Variation Animations */
        @keyframes spin-slow {
          100% { transform: rotate(360deg); }
        }
        
        /* This stretches and shrinks the stroke length */
        @keyframes dash-morph {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animate-dash-morph {
          animation: dash-morph 1.5s ease-in-out infinite;
        }
      `}</style>


        <div className="overflow-y-auto ">
          <div className="mb-4 text-sm  bg-[#FBFCFC] text-muted-foreground">
            {joins.length === 0
              ? isLoading
                ? "Loading…"
                : <div className="w-full max-w-[400px] bg-white   shadow-sm flex flex-col font-sans mx-auto">
                  {/* Top Banner */}
                  <p className="p-4 bg-[#FBFCFC]!  border-b-[1px]">{joins.length} developer want to pair with you on this challenge.</p>


                  {/* Main Content */}
                  <div className="flex-1 flex flex-col items-center px-8 pt-12 pb-8  text-center relative overflow-hidden">

                    {/* Wave Animation Wrapper */}
                    <div className="relative flex items-center justify-center w-40 h-40 mb-6">
                      <div className="absolute inset-0 bg-blue-100 rounded-full animate-wave delay-0s opacity-0"></div>
                      <div className="absolute inset-0 bg-blue-100 rounded-full animate-wave delay-1s opacity-0"></div>
                      <div className="absolute inset-0 bg-blue-100 rounded-full animate-wave delay-2s opacity-0"></div>

                      <div className="relative border-2 border-[#008CFF33] flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)]">

                        <svg
                          width="38"
                          height="39"
                          viewBox="0 0 38 39"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="animate-[spin_3s_linear_infinite]"
                        >
                          <path
                            d="M13.9893 20.5L1.98926 25C3.32259 29 8.98926 37.1 20.9893 37.5"
                            stroke="#008CFF"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18.9893"
                            cy="19.5"
                            r="4"
                            stroke="#008CFF"
                            strokeWidth="3"
                          />
                          <circle
                            cx="27.2393"
                            cy="35.25"
                            r="1.75"
                            fill="#008CFF"
                          />
                          <circle
                            cx="23.2393"
                            cy="10.25"
                            r="1.75"
                            fill="#008CFF"
                          />
                          <path
                            d="M1.48926 18C2.15592 12.5 6.48926 1.5 18.4893 1.5C33.4893 1.5 36.4893 14 36.4893 19C36.4893 24 34.9893 28.5 32.4893 31M7.98926 23C9.32259 26.0925 13.4893 31 20.4893 30C29.2007 28.7555 30.8649 21.5 28.9893 14.5"
                            stroke="#008CFF"
                            strokeWidth="3"
                          />
                          <path
                            d="M8.48926 16.5C9.15592 14.1667 11.8893 9.4 17.4893 9"
                            stroke="#008CFF"
                            strokeWidth="3"
                          />
                        </svg>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Broadcasting...</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-[280px]">
                      Your request is live in the Lobby! Hang tight while we find the perfect partner for your challenge.
                    </p>

                    {/* Timer Card with Morphing Spinner */}
                    <div className="w-full flex items-center justify-between bg-[#00000005] rounded-xl p-4 mb-10">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Expires In</span>
                          <span className="text-lg font-bold text-gray-900 tabular-nums leading-tight mt-0.5">      {formatCountdown(remaining)}</span>
                        </div>
                      </div>

                      {/* Morphing Circular Loading Spinner */}
                      <div className="relative w-8 h-8">
                        {/* Added animate-spin-slow directly to the SVG container */}
                        <svg className="w-full h-full animate-spin-slow" viewBox="0 0 36 36">
                          {/* Background track */}
                          <path
                            className="text-gray-200"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Blue spinner path with morphing dash animation */}
                          <path
                            className="text-blue-500 animate-dash-morph"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                      </div>
                    </div>

                    <p className="text-[13px] text-gray-400 max-w-[250px] leading-relaxed">
                      You can browse other pages; we&#39;ll alert you if someone wants to join.
                    </p>
                  </div>
                </div>
              : <span className="p-4 bg-[#FBFCFC]!  border-b-[1px]">{joins.length} developer {joins.length === 1 ? "" : "s"} want to pair with you on this challenge.</span>}
          </div>
          {/* <div>{JSON.stringify(joins)}</div> */}
          <div className="space-y-3 p-4">
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
    <div className="rounded-xl border p-4  border-border bg-background ">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 shrink-0 rounded-full bg-muted">
            <span className="relative h-10 w-10 shrink-0 rounded-full bg-muted">
              <img alt={jr.joinerUsername} className="rounded-full h-8 w-8 object-cover" src={resolveAvatarUrl(jr.joinerProfileImageUrl, jr.joinerUsername)} />
              <div className="h-2 w-2 bg-[#00C851] rounded-full absolute -bottom-0.5 -right-0.5"></div>
            </span>
          </div>
          <div>
            <div className="text-sm text-[#0F172A] font-semibold">{jr.joinerUsername}</div>
            <div className="text-xs text-[#64748B]">{jr?.joinerOccupation || "Developer"}</div>
          </div>
        </div>
        <div className="flex flex-col justify-end gap-1">
          <span className="text-[#FFA539] bg-[#fff1df] px-1 text-xs text-center py-0.5 rounded-md">{jr?.joinerXp ?? jr?.xp ?? 0} xp</span>
          {jr.joinerCountry && (
            <div className="flex gap-1 items-center justify-end">
              {jr.joinedCountryFlag && !jr.joinedCountryFlag.includes('undefined') && (
                <img
                  src={jr.joinedCountryFlag}
                  className="w-3 h-3"
                  alt="country flag"
                />
              )}
              <span className="text-[10px]">{jr.joinerCountry}</span>
            </div>
          )}
        </div>

      </div>

      {/* <div className="mt-2 hidden flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Code2 className="h-3 w-3" />
          Multiple
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          English
        </span>
      </div> */}

      <div className="mt-6 flex gap-2">
        <button
          onClick={handleAccept}
          disabled={acceptMutation.isPending}
          className="flex-1 min-h-10 rounded-md bg-[#008CFF] py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {acceptMutation.isPending ? "Accepting…" : "Accept & Pair"}
        </button>
        <button
          onClick={() => rejectMutation.mutate(jr.id)}
          disabled={rejectMutation.isPending}
          className="rounded-md min-h-10 bg-white dark:bg-transparent border border-border px-3 py-2 text-sm font-medium text-[#64748B] hover:bg-muted"
          aria-label="Reject"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
