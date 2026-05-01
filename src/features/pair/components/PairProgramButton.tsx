"use client";

import { UserRoundPlus, Radio } from "lucide-react";
import { useState } from "react";
import { CreatePairRequestModal } from "./CreatePairRequestModal";
import { IncomingJoinsSidebar } from "./IncomingJoinsSidebar";
import { useCancelPairRequest, useMyActiveJoin, useMyActiveRequest, useMyActiveSession } from "../hooks/usePairQueries";
import { formatCountdown, useCountdown } from "./GlobalPairAlertBanner";
import { cn } from "@/lib";

/**
 * Button that sits on the challenge detail page ("top of the editor" per spec
 * story 1.1). Three visual states:
 *   - "Pair Program" — user has no active state; clicking opens the modal
 *   - "Broadcasting" — user has an active request; clicking toggles sidebar
 *   - Disabled with tooltip — user is already busy (pending join or active session)
 *
 * The broadcasting state + sidebar live in PairProgramButton's parent layout.
 * Here we expose onBroadcastingClick for the caller to open its sidebar.
 */
interface PairProgramButtonProps {
  challengeId: number;
  challengeTitle: string;
  languageOptions: Array<{ id: number; name: string }>;
}

export function PairProgramButton({
  challengeId,
  challengeTitle,
  languageOptions,
}: PairProgramButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: myRequest } = useMyActiveRequest();
  const { data: myJoin } = useMyActiveJoin();
  const { data: mySession } = useMyActiveSession();
  const cancel = useCancelPairRequest();
  const remaining = useCountdown(myRequest?.expiresAtEpochMs || 0);
  const isBroadcasting =
    myRequest &&
    (myRequest.status === "BROADCASTING" || myRequest.status === "AWAITING_JOINER");
  const lockedReason =
    mySession && mySession.status !== "ENDED"
      ? "You are in an active session"
      : myJoin && myJoin.status === "PENDING"
        ? "You have a pending join request"
        : null;

  if (isBroadcasting) {
    return (
      <>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-[#038CFF0F] py-1.5 pl-3 pr-1.5 text-sm font-semibold text-[#008CFF] transition-colors hover:bg-blue-100"
          >
            {/* Pulsing Blue Dot */}
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>

            {/* Truncated Text */}
            <span className="max-w-[200px] truncate">
              Broadcasting For Missing Number O....
            </span>

            {/* Timer Badge */}
            <span className="rounded-md bg-[#FF6C0A29] min-w-[2.8rem] px-1.5 py-0.5 text-xs font-bold text-[#FF6C0A]">
              {formatCountdown(remaining)}
            </span>
          </button>

          {/* Cancel Button */}
          <button
            className="text-sm font-medium text-[#808080] transition-colors hover:text-gray-600"
            onClick={() => cancel.mutate(myRequest?.id)}
          >
            Cancel
          </button>
        </div>
        <IncomingJoinsSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          pairRequestId={myRequest?.id ?? null}
        />
      </>
    );
  }

  return (
    <>
      <div className={cn(
        lockedReason === "You are in an active session" ? "hidden" : "inline-block",
        "group relative "
      )}>
        <button
          onClick={() => setModalOpen(true)}
          disabled={lockedReason != null}

          className="inline-flex items-center gap-2 rounded-md bg-[#e5edf4] border-[#e5edf4] px-3 py-2 text-sm font-medium text-neutral-01 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-950/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14.6666 14V12.6667C14.6666 11.4241 13.8167 10.38 12.6666 10.084M10.3333 2.19384C11.3105 2.58943 11.9999 3.54754 11.9999 4.66667C11.9999 5.78579 11.3105 6.7439 10.3333 7.13949M11.3333 14C11.3333 12.7575 11.3333 12.1362 11.1303 11.6462C10.8596 10.9928 10.3405 10.4736 9.68707 10.203C9.19702 10 8.57576 10 7.33325 10H5.33325C4.09074 10 3.46949 10 2.97943 10.203C2.32602 10.4736 1.80689 10.9928 1.53624 11.6462C1.33325 12.1362 1.33325 12.7575 1.33325 14M8.99992 4.66667C8.99992 6.13943 7.80601 7.33333 6.33325 7.33333C4.86049 7.33333 3.66659 6.13943 3.66659 4.66667C3.66659 3.19391 4.86049 2 6.33325 2C7.80601 2 8.99992 3.19391 8.99992 4.66667Z" stroke="#00010F" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Pair Program
        </button>


        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 mt-2 z-10 w-max">
          <div className="bg-[#19619D] text-white text-xs py-2 px-4 rounded-xl relative shadow-lg">
            {lockedReason ?? "Find a partner to solve this Together"}


            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#19619D] rotate-45"></div>
          </div>
        </div>
      </div>
      <CreatePairRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        challengeId={challengeId}
        challengeTitle={challengeTitle}
        languageOptions={languageOptions}
      />
    </>
  );
}
