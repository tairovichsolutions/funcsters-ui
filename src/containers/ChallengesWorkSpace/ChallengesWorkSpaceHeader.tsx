"use client";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Timer } from "./Timer";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMetrics } from "@/queries/useMetrics";
import { Navigation } from "@/constants/navigation";
import { XPPoints } from "@/components/ui/xp-points";
import { ChevronLeft, Settings, Users, Mic, MicOff, Clock, AlertCircle } from "lucide-react";
import { ProblemListButton } from "./ProblemListButton";
import { ThemeButton } from "@/components/ui/theme-button";
import { EditerSettingPopover } from "./EditerSettingPopover";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import { useChallengeById } from "@/queries/useChallengeById";
import React, { useState, useEffect } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { PairProgrammingRequestModal } from "@/containers/PairProgramming/PairProgrammingRequestModal";
import { PairProgrammingSidebar } from "@/containers/PairProgramming/PairProgrammingSidebar";
import { PairProgrammingRulesModal } from "@/containers/PairProgramming/PairProgrammingRulesModal";
import { usePairingStore, pairingStore } from "@/mock/pairingStore";
import { toast } from "react-hot-toast";
import { useAudioCall } from "@/hooks/useAudioCall";

export const ChallengesWorkSpaceHeader = () => {
  const { id } = useParams();
  const challengeId = String(id);
  const { data: rawChallengeData, isLoading: isChallengeLoading } = useChallengeById(challengeId);
  
  // Safe extraction mirroring ChallengesDetailScreen.tsx
  const challengeData = (rawChallengeData as any)?.data ?? rawChallengeData;
  const challengeTitle = challengeData?.title || "";
  const challengeSlug = challengeData?.slug || challengeId;

  const { data: metricsData } = useMetrics();
  const userXP = metricsData?.xpPoints || 0;
  const { data: userData } = useGetUserProfile();
  const isAuthenticated = userData?.data?.authenticated || false;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isPairModalOpen, setIsPairModalOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [connectedPartner, setConnectedPartner] = useState<any>(null);

  const { isRequesting: isPartnerRequested, requestExpiry, activeChallengeSlug: storeChallengeSlug, activeChallengeTitle, incomingRequests, hasPermission, sessionStarted, mode, requestId } = usePairingStore();
  const storeSlug = String(storeChallengeSlug || '').toLowerCase();
  const currentSlug = String(challengeSlug || '').toLowerCase();
  
  const isThisChallengeActive = isPartnerRequested && storeSlug === currentSlug && storeSlug !== '';
  const isAnotherChallengeActive = isPartnerRequested && storeSlug !== currentSlug && storeSlug !== '';

  const [requestTimeLeft, setRequestTimeLeft] = useState(0);

  useEffect(() => {
    pairingStore.rehydrateActiveRequest();
  }, []);

  useEffect(() => {
    if (!isPartnerRequested || requestExpiry === 0) return;
    
    setRequestTimeLeft(Math.max(0, Math.floor((requestExpiry - Date.now()) / 1000)));

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((requestExpiry - Date.now()) / 1000));
      setRequestTimeLeft(remaining);
      
      if (remaining <= 0) {
        pairingStore.cancelRequest();
        setIsSidebarOpen(false);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPartnerRequested, requestExpiry]);

  // Keep store in sync if title loads lazily
  useEffect(() => {
    if (isThisChallengeActive && !activeChallengeTitle && challengeTitle) {
        pairingStore.state.activeChallengeTitle = challengeTitle;
        // Trigger re-render in listeners
        pairingStore.dispatchEvent(new Event('change'));
    }
  }, [isThisChallengeActive, activeChallengeTitle, challengeTitle]);

  useEffect(() => {
    if (searchParams.get("sidebar") === "open") {
      setIsSidebarOpen(true);
      router.replace(pathname);
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    if (!isPartnerRequested) {
      setIsSidebarOpen(false);
    }
  }, [isPartnerRequested]);

  const [isMuted, setIsMuted] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  
  // ─── Session timer (45 min) — persists across page refresh via localStorage ───
  const SESSION_DURATION = 45 * 60; // seconds
  const timerKey = requestId ? `pairing-session-timer-${requestId}` : null;

  const getStoredTimeLeft = (): number => {
    if (!timerKey) return SESSION_DURATION;
    const stored = localStorage.getItem(timerKey);
    if (stored) {
      const endTime = parseInt(stored, 10);
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      return remaining > 0 ? remaining : 0;
    }
    return SESSION_DURATION; // not started yet
  };

  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);

  // When session actually starts, set the end time in localStorage (only once)
  useEffect(() => {
    if (hasPermission && sessionStarted && timerKey) {
      if (!localStorage.getItem(timerKey)) {
        const endTime = Date.now() + SESSION_DURATION * 1000;
        localStorage.setItem(timerKey, endTime.toString());
      }
      // Restore from localStorage
      setTimeLeft(getStoredTimeLeft());
    }
  }, [hasPermission, sessionStarted, timerKey]);

  // Countdown effect — reads from localStorage end time for accuracy
  useEffect(() => {
    if (hasPermission && sessionStarted && timeLeft > 0 && timerKey) {
      const timer = setInterval(() => {
        const remaining = getStoredTimeLeft();
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          localStorage.removeItem(timerKey);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hasPermission, sessionStarted, timeLeft > 0, timerKey]);

  // Wire up the WebRTC voice chat + DataChannel automatically when session activates
  useAudioCall(hasPermission ? requestId : null, isMuted, sessionStarted);

  useEffect(() => {
    if (searchParams.get("session") === "active") {
      const rulesAlreadyAgreed = searchParams.get("rules") === "agreed";
      
      if (rulesAlreadyAgreed) {
          pairingStore.setPermission(true);
      } else {
          setIsRulesModalOpen(true);
      }
      
      setConnectedPartner({
        username: "dev_partner",
        avatarUrl: "https://i.pravatar.cc/150?u=lobby_partner",
      });
    }
  }, [searchParams]);

  const { targetUser } = usePairingStore();
  
  // Sync connected partner from store for Joiners
  useEffect(() => {
    if (hasPermission && mode === 'join' && targetUser) {
        setConnectedPartner(targetUser);
    }
  }, [hasPermission, mode, targetUser]);

  // Signal join to start session timer
  useEffect(() => {
    if (hasPermission && mode === 'join' && requestId && !sessionStarted) {
        pairingStore.joinSession(requestId);
    }
  }, [hasPermission, mode, requestId, sessionStarted]);

  const handleAcceptRules = () => {
    setIsRulesModalOpen(false);
    pairingStore.setPermission(true);
    router.replace(pathname);
  };

  const handleDeclineRules = () => {
    setIsRulesModalOpen(false);
    router.replace("/lobby");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handlePairRequest = (data: any) => {
    if (userXP < 1) {
      toast.error("You need at least 1 XP to request a programming partner.");
      return;
    }

    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setIsPairModalOpen(false);
      const actualId = challengeData?.id ? String(challengeData.id) : challengeId;
      pairingStore.startBroadcast(actualId, String(challengeSlug), challengeTitle, data);
    }, 1500);
  };

  const handleLeaveSession = () => {
    pairingStore.endActiveSession();
    setConnectedPartner(null);
    setTimeLeft(45 * 60);
  };

  return (
    <>
      <PairProgrammingRulesModal 
        open={isRulesModalOpen}
        onAccept={handleAcceptRules}
        onDecline={handleDeclineRules}
      />
      
      <header className="dashboard-headers-class px-12 py-3.5 h-[60px] flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Link href={Navigation.Challenges}>
            <Button
              size={"sm"}
              variant={"ghost"}
              className="pl-1! pr-2.5! gap-1 font-normal!"
              startIcon={<ChevronLeft size={50} className="size-5" />}
            >
              Back
            </Button>
          </Link>

          <ProblemListButton />
          {isAuthenticated && (
            <XPPoints>{metricsData?.xpPoints || 0} XP</XPPoints>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 mr-2">
            {!hasPermission ? (
              isThisChallengeActive ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-3 py-1.5 h-[34px] text-xs font-bold bg-primary/10 hover:bg-primary/20 border-primary shadow-sm text-primary transition-all rounded-full"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Broadcasting for {challengeTitle}...
                    <span className="ml-1 bg-orange-500/20 text-orange-500 font-bold px-1.5 py-0.5 rounded-sm tabular-nums text-[10px]">
                      {formatTime(requestTimeLeft)}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-[34px] px-2 text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
                    onClick={() => pairingStore.cancelRequest()}
                  >
                    Cancel
                  </Button>

                  <PairProgrammingSidebar
                    open={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    requests={incomingRequests}
                    onAccept={(partner) => {
                      setIsSidebarOpen(false);
                      pairingStore.acceptPartner(partner.id);
                      setConnectedPartner(partner);
                    }}
                  />
                </div>
              ) : (
                <>
                  <Tooltip content={isAnotherChallengeActive ? `You already have an active request for "${activeChallengeTitle}". Please cancel it or wait for 1 minute.` : "Find a partner to solve this together"}>
                    <div className="inline-block">
                      <Button
                        variant="outline"
                        disabled={isAnotherChallengeActive}
                        className={`flex items-center gap-2 px-3 py-1.5 h-[34px] text-xs font-semibold rounded-md transition-all ${
                            isAnotherChallengeActive 
                                ? "bg-muted/50 text-muted-foreground border-border cursor-not-allowed opacity-60" 
                                : "bg-accent/20 hover:bg-accent/40 border-accent/30 text-accent-foreground"
                        }`}
                        onClick={() => setIsPairModalOpen(true)}
                      >
                        {isAnotherChallengeActive ? <AlertCircle className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                        Pair Program
                      </Button>
                    </div>
                  </Tooltip>

                  <PairProgrammingRequestModal
                    open={isPairModalOpen}
                    onClose={() => setIsPairModalOpen(false)}
                    onRequest={handlePairRequest}
                    isRequesting={isRequesting}
                    challengeTitle={challengeTitle || "this challenge"}
                  />
                </>
              )
            ) : (
              <div className="flex items-center gap-3 bg-transparent border border-border px-3 py-1.5 rounded-lg h-[34px] shrink-0">
                <div className="flex -space-x-2">
                  <Tooltip content="Me" place="bottom">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-background bg-green-500 flex items-center justify-center text-[8px] font-bold text-black z-10 shrink-0 cursor-pointer">
                      ME
                    </div>
                  </Tooltip>
                  <Tooltip content={!sessionStarted ? `${connectedPartner?.username || 'Partner'} will join shortly. Please hang tight!` : (connectedPartner?.username || 'Partner')} place="bottom">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-background shrink-0 cursor-pointer">
                      <img src={connectedPartner?.avatarUrl} alt="Partner" className="w-full h-full object-cover" />
                      {!sessionStarted && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                           <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  </Tooltip>
                </div>

                <div className="w-px h-3.5 bg-border mx-1" />

                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border-soft text-xs font-mono font-bold transition-colors ${sessionStarted ? 'bg-accent/30 text-green-500' : 'bg-orange-500/10 text-orange-500 animate-pulse'}`}>
                  <Clock className="w-3 h-3" />
                  {sessionStarted ? formatTime(timeLeft) : "45:00"}
                </div>
                
                <div className="flex items-center gap-1.5 ml-1">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-1.5 rounded-full transition-colors ${
                      isMuted ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-accent/50 text-foreground hover:bg-accent"
                    }`}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-3 text-[11px] font-bold text-destructive hover:text-destructive-foreground hover:bg-destructive rounded-full border border-destructive/30 bg-destructive/10"
                    onClick={handleLeaveSession}
                  >
                    {mode === "broadcast" ? "End Session" : "Leave"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <ThemeButton iconClass="size-4!" />

          <Timer
            className="ml-2"
            challengeId={Number.isNaN(Number(challengeId)) ? null : Number(challengeId)}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                size={"icon"}
                className="size-9"
                variant={"tertiary"}
                aria-label="Theme Icon"
              >
                <Settings />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="mr-10 mt-3">
              <EditerSettingPopover />
            </PopoverContent>
          </Popover>
        </div>
      </header>
    </>
  );
};
