/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useThinkingAssistant, Message } from "@/hooks/useThinkingAssistant";
import { useLanguageImplementations } from "@/context/languageImplementationsContext";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import { useChallengeById } from "@/queries/useChallengeById";
import { Skeleton } from "@/components/ui/skeleton";
import { Assets } from "@/constants/assets";
import { FocusText } from "@/components/ui/focus-text";
import { ProblemIntuition, CodeSkeleton } from "@/containers/ThinkingAssistant";
import { MDMarkdown } from "@/components/MDMarkdown";
import { useTheme } from "next-themes";
import GPTLikeInput from "./inputdara";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DisplayAvatar } from "@/components/ui";

const stripContext = (content: string) => {
  const marker = "--- USER MESSAGE ---";
  if (content.includes(marker)) {
    return content.split(marker)[1].trim();
  }
  return content;
};

const SUGGESTED_QUESTIONS = [
  "Help me understand the logic behind this problem",
  "What should I consider before coding?",
  "Can you guide my reasoning step-by-step?",
  "How should I approach this without brute force?",
];

export const ThinkingAssistantScreen = () => {
  const { id } = useParams();
  const slug = String(id);
  const { currentCode, selectedLanguage } = useLanguageImplementations();
  const { messages, sendMessage, isLoading, isLimitReached } = useThinkingAssistant(
    slug,
    currentCode,
    selectedLanguage
  );

  const { data: userData } = useGetUserProfile();
  const isAuthenticated = userData?.data?.authenticated || false;
  const { openModal } = useAuthModal();

  const { data: challengeData, isLoading: isChallengeLoading } = useChallengeById(slug);
  const challenge = challengeData?.data ?? challengeData;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const user = userData?.data?.user;
  const userAvatarUrl = user?.avatarUrl
    ? user?.avatarUrl.startsWith("https")
      ? user.avatarUrl
      : `https://www.funcsters.io/static${user.avatarUrl}`
    : Assets.Images.Avatar;
  const userFirstLetter = user?.username?.charAt(0)?.toUpperCase() || "U";

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!isAuthenticated) {
      openModal("loginRequiredModal");
      return;
    }
    if (!text.trim() || isLoading) return;
    await sendMessage(text);
  };

  const handleSuggestedClick = (question: string) => {
    handleSend(question);
  };

  const isChatActive = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Header / Intro Section - Only show when chat is NOT active */}
      {!isChatActive && (
        <div className="flex-1 overflow-y-auto px-4 py-14 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center w-full">
            <img
              src={Assets.Svgs.IntelligenceLogo}
              alt="Intelligence Logo"
              className="size-24"
            />

            <h3 className="font-semibold text-[22px] max-w-[400px] leading-7">
              AI that strengthens how you think Not what you copy
            </h3>

            <div className="text-sm font-medium text-foreground/80">
              You&apos;re working on{" "}
              {challenge?.title ? (
                <span className="font-bold text-primary">&ldquo;{challenge.title}&rdquo;</span>
              ) : isChallengeLoading ? (
                <Skeleton className="h-4 w-32 inline-block mx-1 align-middle rounded-sm bg-muted-foreground/20" />
              ) : (
                <span className="font-bold text-primary">&ldquo;this problem&rdquo;</span>
              )}{" "}
              Let&apos;s think it through
            </div>
          </div>

          <div className="mt-10 w-full max-w-2xl">
            {isLimitReached ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-2 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
                <div className="text-2xl">💤</div>
                <p className="text-sm font-medium text-foreground">Thinking Assistant is sleeping</p>
                <p className="text-xs text-muted-foreground">Please come back after 2 hours to continue.</p>
              </div>
            ) : (
              <GPTLikeInput onSend={handleSend} />
            )}
          </div>

          <div className="w-full max-w-2xl flex gap-3 mt-8 flex-col">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestedClick(q)}
                className="border border-[#D9D9D9] dark:border-[#29333D] border-dashed w-fit
                         rounded-full px-4 py-2.5 text-sm
                         text-[#808080] flex items-center gap-3
                         cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition group"
              >
                <span>{q}</span>
                <img
                  src={isDark ? Assets.Svgs.arrowLeftSvgDark : Assets.Svgs.ArrowLeftSvg}
                  alt="Arrow icon"
                  className="size-3 group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy Components as placeholders if needed, but user seems to suggest chat replaces them */}
      {/* <ProblemIntuition /> */}
      {/* <CodeSkeleton /> */}
      {/* Chat Messages Area - Only show when chat IS active */}
      {isChatActive && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={cn(
                  "flex w-full gap-3",
                  isUser ? "justify-end" : "justify-start"
                )}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 p-1">
                    <img
                      src={Assets.Svgs.IntelligenceLogo}
                      className="w-full h-full object-contain"
                      alt="AI"
                    />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm break-all",
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted/50 text-foreground border border-border/50 rounded-tl-none"
                  )}
                >
                  {isUser ? (
                    <p>{stripContext(msg.content)}</p>
                  ) : (
                    <MDMarkdown source={msg.content} />
                  )}
                </div>

                {isUser && (
                  <DisplayAvatar
                    src={userAvatarUrl}
                    FallbackName={userFirstLetter}
                    className="w-8 h-8 shrink-0 border border-border"
                  />
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex w-full gap-3 justify-start animate-pulse">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 p-1">
                <img
                  src={Assets.Svgs.IntelligenceLogo}
                  className="w-full h-full object-contain"
                  alt="AI"
                />
              </div>
              <div className="bg-muted/30 px-4 py-3 rounded-2xl rounded-tl-none border border-border/30">
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  Thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area - Only show when Chat IS Active (since intro has its own input) */}
      {isChatActive && (
        <div className="p-4 bg-background border-t border-border mt-auto">
          {isLimitReached ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
              <div className="text-2xl">💤</div>
              <p className="text-sm font-medium text-foreground">Thinking Assistant is sleeping</p>
              <p className="text-xs text-muted-foreground">Please come back after 2 hours to continue.</p>
            </div>
          ) : (
            <>
              <GPTLikeInput onSend={handleSend} />
              <p className="text-[10px] text-muted-foreground text-center mt-3 opacity-60">
                FuncstersAI can be imperfect at times. Use your judgment while learning.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
