"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePairingStore } from "@/mock/pairingStore";
import { AnimatePresence, motion } from "framer-motion";

export const PairingNotificationHandler = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isRequesting, mode, activeChallengeSlug, activeChallengeTitle, incomingRequests, hasPermission, targetUser } = usePairingStore();
  const [lastSeenCount, setLastSeenCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [permissionNotified, setPermissionNotified] = useState(false);

  const displayTitle = activeChallengeTitle || "your challenge";

  useEffect(() => {
    if (!isRequesting) {
        setShowNotification(false);
        setLastSeenCount(0);
        setPermissionNotified(false);
        return;
    }

    // CASE 1: Broadcaster - Someone wants to join you
    if (mode === 'broadcast' && incomingRequests.length > lastSeenCount) {
        setShowNotification(true);
        setLastSeenCount(incomingRequests.length);
    }

    // CASE 2: Joinee - You were granted permission
    if (mode === 'join' && hasPermission && !permissionNotified) {
        setShowNotification(true);
        setPermissionNotified(true);
    }
  }, [isRequesting, mode, incomingRequests, lastSeenCount, hasPermission, permissionNotified]);

  const handleManage = () => {
    setShowNotification(false);
    if (mode === 'broadcast') {
        router.push(`/challenges/${activeChallengeSlug}/detail?sidebar=open`);
    } else {
        router.push(`/challenges/${activeChallengeSlug}/detail?session=active`);
    }
  };

  const activeCount = incomingRequests.length;
  const isJoinMode = mode === 'join' && hasPermission;

  // Suppress notifications on the lobby screen as requested
  if (pathname === "/lobby") return null;

  if (!showNotification) return null;
  if (!isJoinMode && activeCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 20, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-1/2 -translate-x-1/2 z-[999999] w-full max-w-md px-4"
      >
        <div className={`bg-card/95 backdrop-blur-md border rounded-2xl shadow-2xl overflow-hidden ring-4 ring-primary/5 ${isJoinMode ? "border-orange-500 shadow-orange-500/20" : "border-primary/30"}`}>
          <div className={`h-1 w-full bg-primary animate-[pulse_2s_infinite] ${isJoinMode ? "bg-orange-500" : "bg-primary"}`} />
          <div className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {isJoinMode ? (
                  <div className="relative">
                     <img 
                       src={targetUser?.avatarUrl} 
                       alt={targetUser?.username} 
                       className="w-12 h-12 rounded-full border-2 border-orange-500 object-cover shadow-sm bg-muted whitespace-nowrap" 
                     />
                  </div>
                ) : (
                  <>
                    {incomingRequests.slice(0, 3).map((req, idx) => (
                      <div key={req.id} className="relative" style={{ zIndex: 10 - idx }}>
                        <img 
                          src={req.avatarUrl} 
                          alt={req.username} 
                          className="w-12 h-12 rounded-full border-2 border-card object-cover shadow-sm bg-muted whitespace-nowrap" 
                        />
                      </div>
                    ))}
                    {activeCount > 3 && (
                      <div className="w-12 h-12 rounded-full border-2 border-card bg-accent flex items-center justify-center text-[10px] font-bold text-foreground z-0 shadow-sm">
                        +{activeCount - 3}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold ${isJoinMode ? "text-orange-500" : "text-foreground"}`}>
                  {isJoinMode ? "Permission Granted!" : "New Join Request!"}
                </h4>
                <p className="text-xs text-muted-foreground truncate font-medium mt-0.5">
                  {isJoinMode ? (
                    <>@<span className="text-foreground font-bold">{targetUser?.username}</span> is waiting for you on <span className="text-foreground font-bold italic">"{displayTitle}"</span></>
                  ) : (
                    <>
                      <span className="text-primary font-bold">
                        {activeCount === 1 ? incomingRequests[0].username : `${activeCount} developers`}
                      </span> {activeCount === 1 ? `wants to pair on` : `want to pair on`} <span className="text-foreground font-bold italic">"{displayTitle}"</span>
                    </>
                  )}
                </p>
              </div>

              <button 
                  onClick={() => setShowNotification(false)}
                  className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 font-bold text-[11px] h-9 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setShowNotification(false)}
              >
                {isJoinMode ? "Hide" : "Ignore"}
              </Button>
              <Button 
                  size="sm" 
                  className={`flex-1 font-bold text-[11px] h-9 shadow-lg flex items-center justify-center gap-2 ${isJoinMode ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20" : "shadow-primary/20"}`}
                  onClick={handleManage}
              >
                {isJoinMode ? (
                  <>
                    <Users className="w-3.5 h-3.5" />
                    Join Session Now
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5" />
                    {activeCount === 1 ? "Manage Request" : `View ${activeCount} Requests`}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
