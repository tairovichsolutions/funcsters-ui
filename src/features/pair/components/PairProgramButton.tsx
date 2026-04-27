"use client";

import { UserRoundPlus, Radio } from "lucide-react";
import { useState } from "react";
import { CreatePairRequestModal } from "./CreatePairRequestModal";
import { IncomingJoinsSidebar } from "./IncomingJoinsSidebar";
import { useMyActiveJoin, useMyActiveRequest, useMyActiveSession } from "../hooks/usePairQueries";

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
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Radio className="h-4 w-4 animate-pulse" />
          Broadcasting
        </button>
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
      <button
        onClick={() => setModalOpen(true)}
        disabled={lockedReason != null}
        title={lockedReason ?? undefined}
        className="inline-flex items-center gap-2 rounded-md border border-blue-600 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-950/50"
      >
        <UserRoundPlus className="h-4 w-4" />
        Pair Program
      </button>
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
