"use client";

import React, { useState } from "react";
import { X, ShieldAlert, CheckCircle2, AlertTriangle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PairProgrammingRulesModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const PairProgrammingRulesModal = ({
  open,
  onAccept,
  onDecline,
}: PairProgrammingRulesModalProps) => {
  const [agreed, setAgreed] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Content */}
      <div className="relative bg-card border border-border-soft w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-primary to-green-500" />
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Community Guidelines
              </h2>
              <p className="text-sm text-muted-foreground font-medium mt-0.5">
                Please agree to our rules before joining the session.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex gap-3 items-start bg-accent/20 p-3.5 rounded-xl border border-border-soft">
              <UserCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Be Respectful & Collaborative</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Treat your partner with patience. Everyone learns at a different pace. 
                  Zero tolerance for harassment, offensive language, or hostility.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-accent/20 p-3.5 rounded-xl border border-border-soft">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Protect Personal Information</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Never share sensitive passwords, API keys, real addresses, or personal identifiable 
                  information inside the chat or audio channels.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-accent/20 p-3.5 rounded-xl border border-border-soft">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Stay On Topic</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Focus on solving the coding challenge and discussing technical concepts. 
                  Keep the environment professional and constructive.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <label className="flex items-center gap-3 p-3 border border-border-soft rounded-xl cursor-pointer hover:bg-accent/10 transition-colors group">
            <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
              <input 
                type="checkbox" 
                className="peer appearance-none w-5 h-5 border-2 border-muted-foreground rounded-sm checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <CheckCircle2 className="absolute text-background w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 pointer-events-none stroke-[3]" />
            </div>
            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              I have read and agree to follow the Community Guidelines.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-muted/20 border-t border-border/50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button 
            variant="ghost" 
            className="w-full sm:w-auto font-semibold hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={onDecline}
          >
            Cancel & Leave
          </Button>
          <Button 
            className="w-full sm:w-auto font-bold px-8 transition-transform active:scale-95"
            disabled={!agreed}
            onClick={onAccept}
          >
            I Agree, Join Session
          </Button>
        </div>
      </div>
    </div>
  );
};
