/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import PrimaryContainer from "@/components/shared/container/PrimaryContainer";
import { Clock, Mic, UserRoundPlus, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useCancelJoinRequest, useCancelPairRequest, useIncomingJoins, useMyActiveJoin, useMyActiveRequest, useMyActiveSession } from "../hooks/usePairQueries";
import { usePairSession } from "../providers/PairSessionProvider";

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
export function GlobalPairAlertBanner({ data }: { data: any }) {
  const pathname = usePathname() ?? "";
  const { data: currentUser } = useCurrentUser();
  const { data: mySession } = useMyActiveSession();
  const { data: myJoin } = useMyActiveJoin();
  const { data: myRequest } = useMyActiveRequest();
  const { data: joins = [] } = useIncomingJoins(myRequest?.id);



  // The session/pair context is always tied to a specific challenge. When a
  // session exists, we link to THAT challenge's detail page rather than a
  // separate session route — that's where the inline session UI lives.
  const sessionChallengeHref = mySession
    ? `/challenges/${mySession.challengeSlug}/detail`
    : null;
    const sessionChallengeTitle= mySession?.challengeTitle
  const onChallengePage =
    mySession && pathname.startsWith(`/challenges/${mySession.challengeSlug}/detail`);
  console.log({ mySession, myRequest, onChallengePage, sessionChallengeHref, currentUser, myJoin, joins });
  if (mySession && mySession.status === "ACTIVE" && !onChallengePage) {
    const partner =
      currentUser?.username === mySession.hostUsername
        ? mySession.joinerUsername
        : mySession.hostUsername;
    return <ActiveSessionBanner href={sessionChallengeHref!} partnerUsername={partner} />;
  }
  if (mySession && mySession.status === "AWAITING_GUIDELINES" && !onChallengePage) {
    return (
      <PermissionGrantedBanner
        currentUser={currentUser} data={data} pairRequestId={myJoin?.pairRequestId} joinId={myJoin?.id}
        href={sessionChallengeHref!}
        sessionChallengeTitle={sessionChallengeTitle}
        hostUsername={mySession.hostUsername}
        expiresAtEpochMs={mySession.acceptedAtEpochMs + 2 * 60 * 1000}
      />
    );
  }

  // Better - assert myJoin.pairrequestId if needed
  // Current - has unnecessary assertion at the end
  if (myJoin && myJoin.status === "PENDING" && data.some((item: { id: any; }) => item.id === myJoin?.pairRequestId)) {


    //TODO: delete after pr done
    return <>


      {/* <div>{JSON.stringify(data)}<br/> <div className="mt-10"></div>
      myjoin:{JSON.stringify(myJoin)}<br/> <div className="mt-10"></div>
      myRequest:{JSON.stringify(myRequest)}<br/> <div className="mt-10"></div>
      mySession:{JSON.stringify(mySession)}<br/> <div className="mt-10"></div>
      joins:{JSON.stringify(joins)}<br/> <div className="mt-10"></div>
      </div> */}
      <JoinPendingBanner currentUser={currentUser} data={data} pairRequestId={myJoin.pairRequestId} joinId={myJoin.id} expiresAtEpochMs={myJoin.expiresAtEpochMs} /></>;
  }
  if (myRequest && (myRequest.status === "BROADCASTING" || myRequest.status === "AWAITING_JOINER")) {
    return (
      <BroadcastingBanner
        requestId={myRequest.id}
        challengeSlug={myRequest.challengeSlug}
        challengeTitle={myRequest.challengeTitle}
        expiresAtEpochMs={myRequest.expiresAtEpochMs}
      />
    );
  }
  return null;
}

function ActiveSessionBanner({ href, partnerUsername }: { href: string; partnerUsername: string }) {
  return (
    <PrimaryContainer >
      <div className="relative overflow-hidden flex items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 pl-5 dark:border-blue-900/50 dark:bg-blue-950/30">

        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#008CFF]" />
        <Mic className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            Pair session in progress
          </div>
          <div className="mt-1 truncate text-sm text-indigo-900 dark:text-indigo-100">
            You&apos;re currently paired with @{partnerUsername}.
          </div>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Return to Session
        </Link>
      </div>
    </PrimaryContainer>
  );
}

function PermissionGrantedBanner({
  href,
  hostUsername,
  sessionChallengeTitle,
  expiresAtEpochMs,
  currentUser, 
}: {
  href: string;
  sessionChallengeTitle:string;
  hostUsername: string;
  expiresAtEpochMs: number;
}) {
  const remaining = useCountdown(expiresAtEpochMs);

  const pair = usePairSession();
  return (
    <PrimaryContainer >
      <div className="relative overflow-hidden flex items-center gap-4 rounded-lg border-2 border-[#F372111A] bg-[#F372111A] p-4 pl-5 dark:border-blue-900/50 dark:bg-orange-950/30">
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#F27313]" />
        <div className="relative h-12 w-12 shrink-0">      
          <img        
            src={
              currentUser?.avatarUrl
                ? currentUser?.avatarUrl.startsWith("https")
                  ? currentUser.avatarUrl
                  : `https://www.funcsters.io/static${currentUser?.avatarUrl}`
                : null
            }
            alt="Profile"
            className="h-full w-full rounded-full border-2 border-[#F37211] object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white  border-[#EBF5F3]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
              <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="#F37211" />
              <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="white" />
              <path d="M8.97222 10.0556H10.7778L10.2704 9.54822C10.1329 9.41063 10.0556 9.22402 10.0556 9.02944V7.88889C10.0556 6.94551 9.45264 6.14295 8.61111 5.84551V5.72222C8.61111 5.32335 8.28776 5 7.88889 5C7.49002 5 7.16667 5.32335 7.16667 5.72222V5.84551C6.32514 6.14295 5.72222 6.94551 5.72222 7.88889V9.02944C5.72222 9.22402 5.64493 9.41063 5.50734 9.54822L5 10.0556H6.80556M8.97222 10.0556V10.4167C8.97222 11.015 8.4872 11.5 7.88889 11.5C7.29058 11.5 6.80556 11.015 6.80556 10.4167V10.0556M8.97222 10.0556H6.80556" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-[#F27313] dark:text-orange-300">PERMISSION GRANTED!</span>
            <span className="inline-flex items-center gap-1 rounded-[4px] border border-[#64748B] bg-white/50 px-2 py-0.5 text-[10px] font-medium text-black">
              <Clock className="h-3 w-3" />
              <span className="font-bold">{formatCountdown(remaining)}</span>
            </span>
          </div>
          <div className="mt-0.5 text-base font-bold text-slate-900">
            Requested to Help @{hostUsername}
          </div>
          <Link
           href={href}
          >
            <div className="text-xs text-[#64748B]">
              Challenge: <span className="font-semibold underline decoration-slate-400 decoration-1 underline-offset-2 text-slate-700">
                &ldquo;{sessionChallengeTitle}&ldquo;
                </span>
            </div></Link>
        </div>
        <button
          onClick={() => pair.leave()}
          // disabled={cancel.isPending}
          className="text-sm font-medium text-[#808080] hover:text-orange-900  disabled:opacity-50"
        >
          Cancel Request
        </button>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-[#F27313]"
        >
          <Users className="h-4 w-4" />
          Join Session Now
        </Link>
      </div>
    </PrimaryContainer>
  );
}

function JoinPendingBanner({ currentUser, data, pairRequestId, joinId, expiresAtEpochMs, }: { joinId: number; expiresAtEpochMs: number }) {
  console.log({ currentUser }, 'yhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');

  const challengeCardData = [...data].find(item => item.id === pairRequestId);

  const remaining = useCountdown(expiresAtEpochMs);
  const cancel = useCancelJoinRequest();


  return (
    <PrimaryContainer >
      <div
        className="relative overflow-hidden flex items-center gap-4 p-4 pl-6"
        style={{
          borderRadius: '12px',
          borderTop: '1px solid #BEE9D0',
          borderRight: '1px solid #BEE9D0',
          borderBottom: '1px solid #BEE9D0',
          background: '#EBF5F3',
          boxShadow: '0 10px 14px 0 rgba(0, 199, 73, 0.10)',
        }}
      >

        {/* Left Accent Bar */}
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#00C749]" />
        <div className="relative h-12 w-12 shrink-0">
          <img
            // src={currentUser.avatarUrl || ""} // Replace with your image variable
            src={
              currentUser?.avatarUrl
                ? currentUser?.avatarUrl.startsWith("https")
                  ? currentUser.avatarUrl
                  : `https://www.funcsters.io/static${currentUser.avatarUrl}`
                : null
            }
            alt="Profile"
            className="h-full w-full rounded-full border-2 border-emerald-400 object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#00C749] border-2 border-[#EBF5F3]">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
              <g clip-path="url(#clip0_62254_16042)">
                <path d="M1.13749 3.58149C0.939044 3.50432 0.839819 3.46573 0.810851 3.41013C0.785738 3.36193 0.785704 3.30451 0.81076 3.25629C0.839663 3.20065 0.938842 3.16195 1.1372 3.08454L6.76645 0.887758C6.94551 0.817881 7.03504 0.782942 7.09225 0.802054C7.14193 0.818652 7.18092 0.857641 7.19752 0.907324C7.21663 0.964533 7.18169 1.05406 7.11181 1.23312L4.91503 6.86237C4.83763 7.06073 4.79892 7.15991 4.74329 7.18881C4.69506 7.21387 4.63764 7.21383 4.58944 7.18872C4.53384 7.15975 4.49525 7.06053 4.41808 6.86208L3.54204 4.60941C3.52638 4.56913 3.51854 4.54899 3.50645 4.53203C3.49572 4.517 3.48258 4.50385 3.46754 4.49313C3.45058 4.48103 3.43044 4.4732 3.39016 4.45753L1.13749 3.58149Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_62254_16042">
                  <rect width="8" height="8" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">REQUEST SENT:</span>
            <span className="inline-flex items-center gap-1 rounded-[4px] border border-[#64748B] bg-white/50 px-2 py-0.5 text-[10px] font-medium text-black">
              <Clock className="h-3 w-3" />
              <span className="font-bold">{formatCountdown(remaining)}</span>
            </span>
          </div>

          <div className="mt-0.5 text-base font-bold text-slate-900">
            Requested to Help <span className="text-neutral-01"> @{challengeCardData?.hostUsername}</span>
          </div>

          <Link href={`/challenges/${challengeCardData?.challengeSlug}/detail`}>
            <div className="text-xs text-[#64748B]">
              Challenge: <span className="font-semibold underline decoration-slate-400 decoration-1 underline-offset-2 text-slate-700">{challengeCardData?.challengeTitle}</span>
            </div></Link>
        </div>

        <button
          onClick={() => cancel.mutate(joinId)}
          disabled={cancel.isPending}
          className="text-sm font-medium text-[#808080] hover:text-emerald-900 disabled:opacity-50"
        >
          Cancel Request
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Waiting For Response...
        </span>
      </div>
    </PrimaryContainer>
  );
}

function BroadcastingBanner({
  requestId,
  challengeSlug,
  challengeTitle,
  expiresAtEpochMs,
}: {
  requestId: number;
  challengeSlug: string;
  challengeTitle: string;
  expiresAtEpochMs: number;
}) {
  const remaining = useCountdown(expiresAtEpochMs);
  const cancel = useCancelPairRequest();
  // Return user to their challenge detail where the PairProgramButton
  // renders in "Broadcasting" mode and opens the incoming-joins sidebar.
  // Detail page route uses challenge SLUG, not numeric id.
  const challengeHref = `/challenges/${challengeSlug}/detail`;

  return (
    <PrimaryContainer >
      <div className="relative overflow-hidden flex items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 pl-5 dark:border-blue-900/50 dark:bg-blue-950/30">
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#008CFF]" />
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
    </PrimaryContainer>
  );
}

/** Ticks every 1s, returns ms-remaining against a server-authoritative epoch. */
export function useCountdown(expiresAtEpochMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return Math.max(0, expiresAtEpochMs - now);
}

export function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
