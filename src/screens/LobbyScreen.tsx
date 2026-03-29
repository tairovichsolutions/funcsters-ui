"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DifficultyChip } from "@/components/ui/difficulty-chip";
import { Users, Code, MessageSquare, Bell, Clock, X, Send } from "lucide-react";
import { MOCK_LOBBY_USERS } from "@/mock/lobbyUsers";
import { PairProgrammingSidebar } from "@/containers/PairProgramming/PairProgrammingSidebar";
import { useInfiniteChallenges } from "@/queries/useAllChallenges";
import { TagSelector } from "@/components/TagSelector";
import FilterPills, { Filters } from "@/containers/Challenges/FilterPills";
import { usePairingLobby } from "@/queries/usePairingLobby";
import { usePairingStore, pairingStore } from "@/mock/pairingStore";
import { PairProgrammingRulesModal } from "@/containers/PairProgramming/PairProgrammingRulesModal";
import TagScroller from "@/containers/Challenges/TagScroller";

// Sub-component to handle timer countdown without re-rendering the whole lobby list
const BannerTimer = ({ expiry }: { expiry: number }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (expiry === 0) return;
    const update = () => {
      const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        pairingStore.cancelRequest();
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [expiry]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black font-mono border bg-inherit border-current opacity-80 shrink-0">
       <Clock className="w-2.5 h-2.5" />
       {formatTime(timeLeft)}
    </div>
  );
};

export const LobbyScreen = () => {
  const router = useRouter();
  const { data: challengesData } = useInfiniteChallenges({});
  const realChallenges = challengesData?.pages[0]?.challenges || [];
  const { data: lobbyRequests } = usePairingLobby();
  
  const { isRequesting: activeRequest, activeChallengeSlug, activeChallengeTitle, incomingRequests, requestExpiry, mode, targetUser, hasPermission } = usePairingStore();
  
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  // 4 Detailed Filters (Multi-select)
  const [filters, setFilters] = useState<Filters>({
    country: [],
    difficulty: [],
    language: [],
    spoken: []
  } as unknown as Filters);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Map API requests to the UI model structure
  const mappedLobbyUsers = useMemo(() => {
    if (!lobbyRequests) return [];
    return lobbyRequests.map((req) => ({
      sessionId: String(req.id), // Real DB Session ID
      id: String(req.hostId || req.id), // Used for unique keys
      username: req.hostUsername || "Anonymous",
      avatarUrl: req.hostAvatarUrl || "https://ui-avatars.com/api/?name=" + (req.hostUsername || "Dev"),
      occupation: req.hostOccupation || "Developer",
      country: { name: req.hostCountry || "Earth", flag: req.hostCountryFlag || "🌎" },
      xp: req.hostXp || 0,
      goal: req.description || `Needs help with ${(req.focusAreas || []).join(", ").toLowerCase() || 'code review'}`,
      focusAreas: req.focusAreas || [],
      preferredLanguages: req.preferredLanguages || [],
      spokenLanguages: req.spokenLanguages || [],
      challenge: {
        id: req.challengeId || null,
        slug: req.challengeSlug || "unknown",
        title: req.challengeTitle || "Unknown Challenge",
        difficulty: req.challengeDifficulty || "EASY",
        tags: req.challengeTags || [],
      },
      status: req.status,
    }));
  }, [lobbyRequests]);

  // Performance FIX: Memoize filtering separately from the parent's tick-based state
  const filteredUsers = useMemo(() => {
    return mappedLobbyUsers.filter((user) => {
      if (filters.difficulty && filters.difficulty.length > 0 && !filters.difficulty.includes(user.challenge.difficulty)) return false;
      if (filters.country && filters.country.length > 0 && !filters.country.includes(user.country.name)) return false;
      if (filters.language && filters.language.length > 0 && !user.preferredLanguages.some(l => filters.language!.includes(l))) return false;
      if (filters.spoken && filters.spoken.length > 0 && !user.spokenLanguages.some(sl => filters.spoken!.includes(sl))) return false;
      return true;
    });
  }, [mappedLobbyUsers, filters]);

  const handlePair = (user: any) => {
    const challengeSlug = (user.challenge as any).slug;
    if (activeRequest) return;

    // Call store with real backend Request ID (mapped as sessionId)
    pairingStore.requestToJoin(user.sessionId, String(user.challenge.id), challengeSlug, user.challenge.title, user);
  };

  const handleJoinRequested = () => {
    // Redirect to the workspace and let it handle the rules modal
    // We don't need to show it here anymore to avoid redundancy
    router.push(`/challenges/${activeChallengeSlug}/detail?session=active`);
  };

  const handleCancelRequest = () => {
    pairingStore.cancelRequest();
  };

  const handleAcceptRequest = () => {
    setIsSidebarOpen(false);
    pairingStore.cancelRequest();
    router.push(`/challenges/${activeChallengeSlug}/detail?session=active`);
  };

  return (
    <div className="w-full flex-1 flex flex-col pt-6 pb-12 gap-8 animate-fade-in custom-scrollbar">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Pair Programming Lobby
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm font-medium">
            Connect with other developers, share knowledge, and solve challenges together in real-time.
          </p>
        </div>
      </div>

      <PairProgrammingSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        requests={incomingRequests}
        onAccept={handleAcceptRequest}
      />


      {/* Differentiated Banners based on Mode */}
      {activeRequest && mode === 'broadcast' && (
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm shadow-sm backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                incomingRequests.length > 0 ? "bg-orange-500/10 border-orange-500" : "bg-primary/20 border-primary"
            }`}>
               {incomingRequests.length > 0 ? (
                 <Bell className="w-5 h-5 text-orange-500 animate-bounce" />
               ) : (
                 <Clock className="w-5 h-5 text-primary animate-spin-[3s_linear_infinite]" />
               )}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground">Active Broadcast: <span className="text-primary underline underline-offset-4">{activeChallengeTitle}</span></p>
                    <BannerTimer expiry={requestExpiry} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {incomingRequests.length === 0 
                      ? "Your request is currently in the Lobby. Someone will join you soon!" 
                      : `🎉 Good news! ${incomingRequests.length} ${incomingRequests.length === 1 ? "developer wants" : "developers want"} to solve this with you.`}
                </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
                variant={incomingRequests.length > 0 ? "default" : "outline"}
                size="sm" 
                className={`flex-1 sm:flex-none h-10 font-bold text-[11px] px-6 rounded-full transition-all ${
                    incomingRequests.length > 0 
                        ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 border-none" 
                        : "border-primary/30 hover:bg-primary/10"
                }`}
                onClick={() => router.push(`/challenges/${activeChallengeSlug}/detail?sidebar=open`)}
            >
                {incomingRequests.length > 0 
                    ? `View ${incomingRequests.length} Requests` 
                    : "View Request Status"}
            </Button>
            <Button 
                variant="destructive" 
                size="sm" 
                className="flex-1 sm:flex-none h-10 font-bold text-[11px] bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20 rounded-full" 
                onClick={handleCancelRequest}
            >
                <X className="w-3.5 h-3.5 mr-1" />
                Stop Broadcast
            </Button>
          </div>
        </div>
      )}

      {/* JOINEE BANNER: When you want to help someone else */}
      {activeRequest && mode === 'join' && (
        <div className={`p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-500 border-2 ${
            hasPermission 
                ? "bg-orange-500/10 border-orange-500 shadow-orange-500/20 animate-pulse-slow font-bold" 
                : "bg-green-500/5 border-green-500/20"
        }`}>
          <div className={`absolute top-0 left-0 w-1.5 h-full ${hasPermission ? "bg-orange-500" : "bg-green-500"}`} />
          
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full border-2 p-0.5 shrink-0 relative transition-colors ${
                hasPermission ? "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "border-green-500"
            }`}>
               <img src={targetUser?.avatarUrl} className="w-full h-full rounded-full object-cover" />
               <div className={`absolute -bottom-1 -right-1 rounded-full p-1.5 border-2 border-background shadow-sm ${
                   hasPermission ? "bg-orange-500 animate-bounce" : "bg-green-500"
               }`}>
                  {hasPermission ? <Bell className="w-3 h-3 text-white" /> : <Send className="w-2.5 h-2.5 text-white" />}
               </div>
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <p className={`text-sm uppercase tracking-wide font-black ${hasPermission ? "text-orange-600" : "text-foreground font-bold"}`}>
                      {hasPermission ? "Permission Granted!" : "Request Sent:"}
                    </p>
                    <BannerTimer expiry={requestExpiry} />
                </div>
                <p className="font-bold text-base text-foreground mt-0.5">
                   {hasPermission 
                       ? `@${targetUser?.username} is waiting for you!` 
                       : `Requested to Help @${targetUser?.username}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Challenge: <span className="font-bold text-foreground underline underline-offset-2">&quot;{activeChallengeTitle}&quot;</span>
                </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 sm:flex-none h-10 font-bold text-[11px] rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive" 
                onClick={handleCancelRequest}
            >
                Cancel Request
            </Button>
            
            {hasPermission ? (
                <Button 
                    variant="default"
                    size="sm" 
                    className="flex-1 sm:flex-none h-11 font-bold text-xs px-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/40 border-none animate-in zoom-in-90 scale-105"
                    onClick={handleJoinRequested}
                >
                    <Users className="w-4 h-4 mr-2" />
                    Join Session Now
                </Button>
            ) : (
                <div className="flex-1 sm:flex-none flex items-center gap-2 bg-green-500/10 px-4 py-2.5 rounded-full border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-green-600">Waiting for Response...</span>
                </div>
            )}
          </div>
        </div>
      )}

      {/* Filters Container */}
      <div className="flex flex-col gap-3 w-full bg-card border border-border-soft rounded-xl p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full">
          <TagSelector
            className="md:w-44 bg-background"
            label="Country"
            tags={[
              { id: "United States", label: "United States" },
              { id: "Brazil", label: "Brazil" },
              { id: "Japan", label: "Japan" },
              { id: "Italy", label: "Italy" },
              { id: "United Kingdom", label: "United Kingdom" },
              { id: "Spain", label: "Spain" },
              { id: "India", label: "India" },
              { id: "Australia", label: "Australia" },
              { id: "Germany", label: "Germany" },
              { id: "Canada", label: "Canada" },
            ]}
            value={filters.country}
            onChange={(val) => setFilters(prev => ({ ...prev, country: val }))}
          />
          <TagSelector
            className="md:w-44 bg-background"
            label="Difficulty"
            tags={[
              { id: "EASY", label: "Easy" },
              { id: "MEDIUM", label: "Medium" },
              { id: "HARD", label: "Hard" },
              { id: "EXPERT", label: "Expert" },
            ]}
            value={filters.difficulty}
            onChange={(val) => setFilters(prev => ({ ...prev, difficulty: val }))}
          />
          <TagSelector
            className="md:w-44 bg-background"
            label="Dev Language"
            tags={[
              { id: "JavaScript", label: "JavaScript" },
              { id: "TypeScript", label: "TypeScript" },
              { id: "Python", label: "Python" },
              { id: "Java", label: "Java" },
              { id: "C++", label: "C++" },
              { id: "Go", label: "Go" },
              { id: "Ruby", label: "Ruby" },
              { id: "Rust", label: "Rust" },
            ]}
            value={filters.language}
            onChange={(val) => setFilters(prev => ({ ...prev, language: val }))}
          />
          <TagSelector
            className="md:w-44 bg-background"
            label="Spoken Lang"
            tags={[
              { id: "English", label: "English" },
              { id: "Spanish", label: "Spanish" },
              { id: "French", label: "French" },
              { id: "German", label: "German" },
              { id: "Japanese", label: "Japanese" },
              { id: "Hindi", label: "Hindi" },
              { id: "Portuguese", label: "Portuguese" },
              { id: "Italian", label: "Italian" },
            ]}
            value={filters.spoken}
            onChange={(val) => setFilters(prev => ({ ...prev, spoken: val }))}
          />
        </div>

        <FilterPills
           filters={filters}
           onClearAll={() => setFilters({ country: [], difficulty: [], language: [], spoken: [] } as unknown as Filters)}
           onRemove={(key, value) => {
             if (value) {
               setFilters(prev => ({ 
                 ...prev, 
                 [key]: (prev[key as keyof Filters] as string[] | undefined)?.filter((v: string) => v !== value) || [] 
               }));
             } else {
               setFilters(prev => ({ ...prev, [key]: [] }));
             }
           }}
           labels={{
             difficulty: { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard", EXPERT: "Expert" }
           }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUsers.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No users found matching your filters.
          </div>
        )}
        {filteredUsers.map((user) => {
          const isPending = activeRequest && mode === 'join' && targetUser?.id === user.id;

          return (
            <div key={user.id} className="flex flex-col justify-between bg-card border border-border-soft rounded-xl overflow-hidden shadow-sm hover:border-primary/40 transition-colors group relative">
              <div className="p-4 flex flex-col gap-3 text-left">
                {/* Header row: Avatar + details + XP */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full border border-border-soft object-cover shrink-0" />
                    <div className="block overflow-hidden">
                      <h3 className="font-semibold text-foreground text-sm truncate leading-tight">{user.username}</h3>
                      <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">{user.occupation}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <div className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-sm">{user.xp.toLocaleString()} XP</div>
                    <div className="text-[11px] font-medium text-muted-foreground mt-1" title={user.country.name}>{user.country.flag}</div>
                  </div>
                </div>

                {/* Challenge context */}
                <div className="flex flex-col bg-accent/20 border border-accent/20 rounded-md py-1.5 px-2.5 mt-1 gap-1.5">
                   <div className="flex items-center justify-between gap-2">
                     <Link href={`/challenges/${(user.challenge as any).slug}/detail`} className="text-[11px] font-semibold hover:text-primary transition-colors underline-offset-2 hover:underline line-clamp-1 flex-1">
                       {user.challenge.title}
                     </Link>
                     <DifficultyChip level={user.challenge.difficulty as "EASY" | "MEDIUM" | "HARD"} className="scale-[0.80] origin-right shrink-0" />
                   </div>
                   <div className="h-4 overflow-hidden">
                      <TagScroller tags={user.challenge.tags} />
                   </div>
                </div>

                <div className="mt-1 relative opacity-80">
                  <div className="absolute top-0.5 left-0 w-0.5 h-[calc(100%-4px)] bg-primary/5 rounded-full" />
                  <p className="text-[10px] leading-tight font-medium text-foreground italic pl-2.5 line-clamp-2">
                    &quot;{user.goal || `Looking for help with ${user.focusAreas.join(", ").toLowerCase() || "code review"}.`}&quot;
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                    <Code className="w-3 h-3 text-primary shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {user.preferredLanguages.map((l: string) => (
                        <span key={l} className="bg-primary/5 text-primary px-1 rounded-sm">{l}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                    <MessageSquare className="w-3 h-3 text-green-500 shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {user.spokenLanguages.map((sl: string) => (
                        <span key={sl} className="bg-green-500/5 text-green-600 px-1 rounded-sm">{sl}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/20 border-t border-border/50">
                <Button 
                  size="sm"
                  className={`w-full text-[11px] font-bold h-10 transition-transform active:scale-[0.98] ${
                    isPending && hasPermission ? "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30" : ""
                  }`}
                  variant={isPending ? (hasPermission ? "default" : "secondary") : "default"}
                  disabled={!!activeRequest && !isPending}
                  onClick={() => {
                    if (isPending && hasPermission) handleJoinRequested();
                    else handlePair(user);
                  }}
                >
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  {isPending ? (hasPermission ? "Join Session Now" : "Request Sent...") : `Pair with ${user.username}`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
