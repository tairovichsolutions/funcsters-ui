"use client";

import React from "react";
import Image from "next/image";
import { X, Code, MessageSquare, Radar, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePairingStore } from "@/mock/pairingStore";

interface PairRequestType {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  occupation: string;
  country: string;
  xp: number;
  languages?: string[];
  programmingLanguage?: string;
  spokenLanguages?: string[];
}

interface PairProgrammingSidebarProps {
  open: boolean;
  onClose: () => void;
  requests: PairRequestType[];
  onAccept: (request: PairRequestType) => void;
}

export const PairProgrammingSidebar = ({
  open,
  onClose,
  requests,
  onAccept,
}: PairProgrammingSidebarProps) => {
  const { isRequesting, requestExpiry } = usePairingStore();
  const [timeLeft, setTimeLeft] = React.useState(0);

  React.useEffect(() => {
    if (!isRequesting || requestExpiry === 0) return;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((requestExpiry - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [isRequesting, requestExpiry]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-transparent transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] z-[110] bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-soft bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Pair Requests
            </h2>
            <span className="bg-orange-500/20 text-orange-500 text-xs font-bold px-2.5 py-1 rounded-full">
              {requests.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:bg-accent hover:text-foreground rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 bg-muted/30 border-b border-border/50 text-sm text-muted-foreground">
          <p>{requests.length} developers want to pair with you on this challenge.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
          {requests.map((request) => (
            <div
              key={request.id}
              className="group flex flex-col gap-3 p-4 rounded-xl bg-card border border-border-soft hover:border-primary/50 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src={request.avatarUrl} alt={request.name} className="w-10 h-10 rounded-full border border-border-soft object-cover" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-tight">{request.name}</h3>
                    <p className="text-[11px] font-medium text-muted-foreground">{request.occupation}</p>
                  </div>
                </div>
                <div className="text-right pl-2">
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-sm">{request.xp.toLocaleString()} XP</span>
                  <p className="text-[11px] font-medium text-foreground mt-1 text-right" dangerouslySetInnerHTML={{ __html: request.country }}></p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium bg-accent/20 px-2.5 py-1.5 rounded-md border border-accent/20 mt-1">
                {(request.programmingLanguage || request.languages?.[0]) && (
                  <>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Code className="w-3.5 h-3.5 text-primary" />
                      {request.programmingLanguage || request.languages?.[0]}
                    </div>
                    <div className="w-px h-3 bg-border shrink-0" />
                  </>
                )}
                <div className="flex items-center gap-1.5 truncate">
                  <MessageSquare className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span className="truncate">
                    {request.spokenLanguages?.join(", ") || request.languages?.slice(1).join(", ") || "English"}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full text-[11px] font-bold leading-none h-8 mt-1 transition-transform active:scale-[0.98]"
                onClick={() => onAccept(request)}
              >
                Accept & Pair
              </Button>
            </div>
          ))}

          {requests.length === 0 && !isRequesting && (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <MessageSquare className="w-8 h-8" />
              </div>
              <p className="text-muted-foreground font-medium">No new pair requests right now.</p>
              <p className="text-xs text-muted-foreground/60 mt-2">Requests will appear here as soon as other developers find your session in the lobby.</p>
            </div>
          )}

          {requests.length === 0 && isRequesting && (
            <div className="text-center py-16 px-6">
              <div className="relative w-24 h-24 mx-auto mb-8">
                {/* Radar Pulse Effect */}
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-primary/40 animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center shadow-inner">
                  <Radar className="w-10 h-10 text-primary animate-[spin_4s_linear_infinite]" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">Broadcasting...</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                Your request is live in the Lobby! Hang tight while we find the perfect partner for your challenge.
              </p>

              <div className="bg-accent/30 border border-accent/40 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock3 className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Expires In</p>
                    <p className="text-sm font-mono font-bold text-foreground tabular-nums">{formatTime(timeLeft)}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              </div>

              <p className="text-[11px] text-muted-foreground mt-8">
                You can browse other pages; we'll alert you if someone wants to join.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
