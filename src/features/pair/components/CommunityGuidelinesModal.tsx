"use client";

import {
  Shield,

  UserCheck,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import { useAcceptGuidelines } from "../hooks/usePairQueries";

/**
 * Spec story 2.4: "the joiner MUST be prompted with and agree to the Community
 * Guidelines before the session starts and the codebase loads."
 *
 * Shown on /pair/session/[id] when session.status === "AWAITING_GUIDELINES"
 * for the joiner. Agreeing calls POST /sessions/{id}/accept-guidelines which
 * transitions the session to ACTIVE and both peers get SESSION_STARTED via STOMP.
 */
interface CommunityGuidelinesModalProps {
  open: boolean;
  sessionId: number | null;
  onAgreed?: () => void;
  onDecline?: () => void;
}

export function CommunityGuidelinesModal({
  open,
  sessionId,
  onAgreed,
  onDecline,
}: CommunityGuidelinesModalProps) {
  const [agreed, setAgreed] = useState(false);
  const acceptMutation = useAcceptGuidelines();

  if (!open || sessionId == null) return null;

  const handleAgree = async () => {
    if (!agreed) return;
    await acceptMutation.mutateAsync(sessionId);
    onAgreed?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 p-4">
      <div className="relative w-full max-h-[95vh] max-w-139 overflow-y-auto rounded-[12px] bg-white dark:bg-[#232629] px-5 py-6 shadow-xl">

        {/* Gradient Top Bar */}
        <div
          className="absolute left-0 right-0 top-0 h-[10px]"
          style={{ background: 'linear-gradient(90deg, #FF6B00 0%, #008CFE 50%, #00C758 100%)' }}
        />

        {/* Header Section */}
        <div className="mt-1 flex items-center gap-4">
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-blue-100 bg-[#F0F7FF]">

            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_62266_20491)">
                <path d="M22.0577 6.17957C22.0453 5.53161 22.0336 4.91948 22.0336 4.32729C22.0336 4.1045 21.9451 3.89082 21.7875 3.73328C21.63 3.57574 21.4163 3.48723 21.1935 3.48723C17.6008 3.48723 14.8655 2.45474 12.5855 0.237875C12.4287 0.085343 12.2186 0 11.9998 0C11.7811 0 11.571 0.085343 11.4142 0.237875C9.13437 2.45474 6.39947 3.48723 2.80703 3.48723C2.58423 3.48723 2.37056 3.57574 2.21302 3.73328C2.05547 3.89082 1.96697 4.1045 1.96697 4.32729C1.96697 4.91959 1.95532 5.53194 1.94289 6.18002C1.82774 12.2101 1.67003 20.4686 11.7247 23.9537C11.9029 24.0155 12.0967 24.0155 12.2749 23.9537C22.3303 20.4685 22.1728 12.2098 22.0577 6.17957ZM11.9999 22.2685C3.3767 19.136 3.50708 12.2738 3.62278 6.21206C3.62973 5.84825 3.63645 5.49565 3.64115 5.15C7.00588 5.00797 9.69654 3.98836 11.9999 1.98184C14.3034 3.98836 16.9945 5.00808 20.3595 5.15C20.3642 5.49554 20.3709 5.84792 20.3779 6.2115C20.4935 12.2735 20.6237 19.1359 11.9999 22.2685Z" fill="#038CFF" />
                <path d="M13.3239 7.27273L13.1023 13.2727H11.1591L10.9375 7.27273H13.3239ZM12.1307 16.1364C11.8011 16.1364 11.5185 16.0213 11.2827 15.7912C11.0497 15.5582 10.9347 15.2756 10.9375 14.9432C10.9347 14.6193 11.0497 14.3423 11.2827 14.1122C11.5185 13.8821 11.8011 13.767 12.1307 13.767C12.4432 13.767 12.7188 13.8821 12.9574 14.1122C13.1989 14.3423 13.321 14.6193 13.3239 14.9432C13.321 15.1648 13.2628 15.3665 13.1491 15.5483C13.0384 15.7273 12.8935 15.8707 12.7145 15.9787C12.5355 16.0838 12.3409 16.1364 12.1307 16.1364Z" fill="#038CFF" />
              </g>
              <defs>
                <clipPath id="clip0_62266_20491">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-01 dark:text-white">Community Guidelines</h2>
            <p className="mt-0.5 text-sm text-neutral-05 dark:text-[#afafaf] ">
              Please agree to our rules before joining the session
            </p>
          </div>
        </div>

        {/* Guidelines Cards */}
        <div className="mt-6 space-y-3">
          {/* Guideline 1 */}
          <div className="flex items-start gap-4 rounded-xl border border-[#E4E4E4] bg-[#FAFAFA] dark:bg-[#1C1F22] dark:border-0 p-4">
            <UserCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
            <div>
              <h3 className="font-semibold text-neutral-01 dark:text-white">Be Respectful & Collaboration</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-05 dark:text-[#afafaf] ">
                Treat your partner with patience. Everyone learns at a different pace. Zero tolerance for harassment, offensive language, or hostility.
              </p>
            </div>
          </div>

          {/* Guideline 2 */}
          <div className="flex items-start gap-4 rounded-xl border border-[#E4E4E4] bg-[#FAFAFA] dark:bg-[#1C1F22] dark:border-0 p-4">
            <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-orange-500" />
            <div>
              <h3 className="font-semibold text-neutral-01 dark:text-white">Protect Personal Information</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-05 dark:text-[#afafaf] ">
                Never share sensitive passwords, API keys, real addresses, or personal identifiable information inside the chat or audio channels.
              </p>
            </div>
          </div>

          {/* Guideline 3 */}
          <div className="flex items-start gap-4 rounded-xl border border-[#E4E4E4] bg-[#FAFAFA] dark:bg-[#1C1F22] dark:border-0 p-4">
    <svg className="w-fit" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
    stroke="#008CFF"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
            <div>
              <h3 className="font-semibold text-neutral-01 dark:text-white">Stay On Topic</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-05 dark:text-[#afafaf] ">
                Focus on solving the coding challenge and discussing technical concepts. Keep the environment professional and constructive.
              </p>
            </div>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-[#E4E4E4] bg-[#FAFAFA] dark:bg-[#1C1F22] dark:border-0 p-4 transition-colors hover:bg-slate-50">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-[18px] w-[18px] rounded border-slate-300 accent-blue-500"
          />
          <span className="text-[14px] font-semibold text-neutral-01 dark:text-white">
            I have read and agree to follow the Community Guidelines.
          </span>
        </label>

        {/* Error State */}
        {acceptMutation?.isError && (
          <div className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">
            Could not start the session. The invitation may have expired. Please return to the lobby.
          </div>
        )}

        {/* Divider */}
        <hr className="my-6 border-slate-100 dark:border-[#282B2E]" />

        {/* Centered Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          {onDecline && (
            <button
              onClick={onDecline}
              className="rounded-xl border border-[#90C8FF] dark:bg-transparent dark:border-[#008CFF99] bg-white px-6 py-2.5 text-[15px] font-semibold text-[#008CFE] transition-colors "
            >
              Cancel & Leave
            </button>
          )}
          <button
            onClick={handleAgree}
            disabled={!agreed || acceptMutation?.isPending}
            className={`rounded-xl bg-[#008CFF] px-6 py-2.5 text-[15px] font-semibold text-white transition-colors  ${!agreed && "opacity-50"} disabled:opacity-50`}
          >
            {acceptMutation?.isPending ? "Starting…" : "I Agree, Join Session"}
          </button>
        </div>

      </div>
    </div>
  );
}

function Guideline({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
      <span>{children}</span>
    </li>
  );
}
