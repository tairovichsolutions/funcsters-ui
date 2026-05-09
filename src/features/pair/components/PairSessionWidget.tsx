"use client";

import { AlertTriangle, Clock, Mic, MicOff, UserRound } from "lucide-react";
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


        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.10)',
            backdropFilter: 'blur(6px)'
          }}
          onClick={() => !busy && setConfirming(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white py-8 px-12 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderRadius: '12px', // Applying the 12px box-radius you requested
              boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.15)' // Applying the 0.15 shadow requested
            }}
          >

            {/* Icon Section */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M59.3333 46L37.7733 8.66666C37.1881 7.65328 36.3465 6.81177 35.3331 6.2267C34.3197 5.64163 33.1701 5.33362 31.9999 5.33362C30.8297 5.33362 29.6802 5.64163 28.6667 6.2267C27.6533 6.81177 26.8117 7.65328 26.2266 8.66666L4.6666 46C4.08126 47.0138 3.77321 48.1639 3.77344 49.3346C3.77366 50.5053 4.08216 51.6553 4.66789 52.6689C5.25363 53.6825 6.09594 54.524 7.11013 55.1088C8.12431 55.6935 9.27459 56.0009 10.4453 56H53.5546C54.7248 56 55.8744 55.6919 56.8879 55.1068C57.9013 54.5216 58.7429 53.68 59.328 52.6666C59.9131 51.6531 60.2211 50.5035 60.2211 49.3333C60.2211 48.1631 59.913 47.0134 59.3279 46H59.3333Z" fill="url(#paint0_linear_62485_6843)" />
                  <path d="M32 40C32.6986 40.0032 33.3732 39.7451 33.8913 39.2764C34.4093 38.8076 34.7335 38.1622 34.8 37.4667L36.3733 21.7334C36.4293 21.1766 36.3678 20.6143 36.1928 20.0827C36.0179 19.5512 35.7333 19.0623 35.3576 18.6476C34.9819 18.2329 34.5233 17.9017 34.0116 17.6753C33.4998 17.4489 32.9463 17.3324 32.3867 17.3334H31.6133C31.0543 17.3334 30.5015 17.4505 29.9905 17.6773C29.4796 17.9041 29.0218 18.2355 28.6468 18.6501C28.2718 19.0647 27.9879 19.5532 27.8133 20.0843C27.6387 20.6154 27.5774 21.1772 27.6333 21.7334L29.2067 37.4667C29.2731 38.161 29.5963 38.8056 30.1129 39.2741C30.6296 39.7427 31.3025 40.0016 32 40Z" fill="url(#paint1_linear_62485_6843)" />
                  <path d="M32.0007 50.6667C34.578 50.6667 36.6673 48.5774 36.6673 46C36.6673 43.4227 34.578 41.3334 32.0007 41.3334C29.4233 41.3334 27.334 43.4227 27.334 46C27.334 48.5774 29.4233 50.6667 32.0007 50.6667Z" fill="url(#paint2_linear_62485_6843)" />
                  <defs>
                    <linearGradient id="paint0_linear_62485_6843" x1="16.1786" y1="27.1147" x2="56.0359" y2="55.1853" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FED200" />
                      <stop offset="1" stopColor="#F59815" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_62485_6843" x1="27.0907" y1="20.784" x2="36.7333" y2="34.82" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3E4154" />
                      <stop offset="1" stopColor="#1B2129" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_62485_6843" x1="29.0393" y1="43.0387" x2="34.7687" y2="48.768" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3E4154" />
                      <stop offset="1" stopColor="#1B2129" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Text Section */}
            <div className=" text-center mt-5">
              <h3 className="text-xl font-bold text-neutral-01">Are you sure you want to leave?</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-05">
                You&apos;ll lose your current progress in this pair programming session
              </p>
            </div>

            {/* Divider */}
            <hr className="my-6 border-slate-100" />

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirming(false)}
                disabled={busy}
                className="min-w-[120px] rounded-xl border-2 border-blue-100 px-6 py-2.5 text-sm font-bold text-blue-500 transition-colors hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setBusy(true);
                  try {
                    await onLeave();
                  } finally {
                    setBusy(false);
                    setConfirming(false);
                  }
                }}
                disabled={busy}
                className="min-w-[120px] rounded-xl bg-[#DB122B] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
              >
                {busy ? "Leaving…" : "Leave"}
              </button>
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
