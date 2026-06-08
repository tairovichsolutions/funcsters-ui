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
import { ArrowUp, ChevronRight, Loader2 } from "lucide-react";
import { cn, getAvatarUrl } from "@/lib/utils";
import { DisplayAvatar } from "@/components/ui";
import RevealImage from "./RevealImage";

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
    ? getAvatarUrl(user.avatarUrl)
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
    //TODO:jahid login thinking
    // if (!isAuthenticated) {
    //   openModal("loginRequiredModal");
    //   return;
    // }
    if (!text.trim() || isLoading) return;
    await sendMessage(text);
  };

  const handleSuggestedClick = (question: string) => {
    handleSend(question);
  };

  const isChatActive = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-background dark:bg-[#1C1F22] relative overflow-hidden">
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
                <p className="text-xs text-muted-foreground">Please come back after 1 hour to continue.</p>
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
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar ">
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
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm break-words",
                    isUser
                      ? "bg-primary  text-primary-foreground rounded-tr-none"
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

          {/* {isLoading && (
            // <div className="flex w-full gap-3 justify-start animate-pulse">
            //   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 p-1">
            //     <img
            //       src={Assets.Svgs.IntelligenceLogo}
            //       className="w-full h-full object-contain"
            //       alt="AI"
            //     />
            //   </div>
            //   <div className="bg-muted/30 px-4 py-3 rounded-2xl rounded-tl-none border border-border/30">
            //     <span className="text-xs text-muted-foreground flex items-center gap-2">
            //       <Loader2 className="w-3 h-3 animate-spin text-primary" />
            //       Thinking...
            //     </span>
            //   </div>
            // </div>
            <div className="flex w-full gap-3 justify-start items-center ">
             <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">

              
                <img
                  src={Assets.Svgs.IntelligenceLogo}
                  className="absolute inset-0 w-full h-full object-contain p-1"
                  alt="AI Sharp Base"
                />

              
                <img
                  src={Assets.Svgs.IntelligenceLogo}
                  className="absolute inset-0 w-full h-full object-contain p-1 blur-[2px] opacity-80"
                  style={{
                    animation: 'blurLens 2s ease-in-out infinite alternate'
                  }}
                  alt="AI Blurred Lens"
                />

             
                <style>{`
    @keyframes blurLens {

      0% { clip-path: circle(35% at 0% 50%); }
      100% { clip-path: circle(35% at 100% 50%); }
    }
  `}</style>

              </div> 
                   <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse flex items-center justify-center shrink-0 border border-primary/20 p-1">
                 <img
                   src={Assets.Svgs.IntelligenceLogo}
                   className="w-full h-full object-contain"
                   alt="AI"
                 />
               </div>
              <div className=" rounded-2xl">
                <div className="relative text-base borer overflow-hidden text-neutral-05 ">

                  <div className="flex gap-12 items-center justify-center">
                    Thinking...
                    <span>
                      <img
                        src={isDark ? Assets.Svgs.arrowLeftSvgDark : Assets.Svgs.ArrowLeftSvg}
                        alt="Arrow icon"
                        className="size-4 group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </div>

                  <span className="shimmer  s1"></span>
                  <span className="shimmer  s2"></span>
                  <span className="shimmer  s3"></span>
                  <span className="shimmer  s4"></span>
                </div>
              </div>
            </div>

          )} */}
          {isLoading && (
            <div className="flex w-full gap-3 justify-start items-center ">
              {/* <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">

              
                <img
                  src={Assets.Svgs.IntelligenceLogo}
                  className="absolute inset-0 w-full h-full object-contain p-1"
                  alt="AI Sharp Base"
                />

              
                <img
                  src={Assets.Svgs.IntelligenceLogo}
                  className="absolute inset-0 w-full h-full object-contain p-1 blur-[2px] opacity-80"
                  style={{
                    animation: 'blurLens 2s ease-in-out infinite alternate'
                  }}
                  alt="AI Blurred Lens"
                />

             
                <style>{`
    @keyframes blurLens {

      0% { clip-path: circle(35% at 0% 50%); }
      100% { clip-path: circle(35% at 100% 50%); }
    }
  `}</style>

              </div> */}
                   <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse flex items-center justify-center shrink-0 border border-primary/20 p-1">
                 <img
                   src={Assets.Svgs.IntelligenceLogo}
                   className="w-full h-full object-contain"
                   alt="AI"
                 />
               </div>
              <div className=" rounded-2xl animate-pulse">
                <div className="relative text-base borer overflow-hidden text-neutral-05 ">
                    <div className="text-gray-500 text-base ">
          Thinking<span className="dots"></span>
        </div>      <style jsx>{`
        .spinner {
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top: 4px solid #0056b3;
          border-radius: 50%;
          animation: spin 1s linear infinite, morphOut 0.5s forwards 2s;
        }

        .thinking-icon {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(0.5);
          animation: morphIn 0.5s forwards 2.2s;
        }

        .dots::after {
          content: "";
          animation: dots 1.5s steps(4, end) infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes morphOut {
          to {
            opacity: 0;
            transform: scale(0.5) rotate(360deg);
          }
        }

        @keyframes morphIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes dots {
          0%, 20% { content: ""; }
          40% { content: "."; }
          60% { content: ".."; }
          80% { content: "..."; }
        }

        /* 🔥 Image reveal effect */
        @keyframes blurLens {
          0% {
            opacity: 0;
            filter: blur(20px);
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
          }
        }

        .animate-blurLens {
          animation: blurLens 0.6s ease forwards;
        }
      `}</style>
{/* 
                  <div className="flex gap-12 items-center justify-center">
                    Thinking...
                    <span>
                      <img
                        src={isDark ? Assets.Svgs.arrowLeftSvgDark : Assets.Svgs.ArrowLeftSvg}
                        alt="Arrow icon"
                        className="size-4 group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </div>

                  <span className="shimmer  s1"></span>
                  <span className="shimmer  s2"></span>
                  <span className="shimmer  s3"></span>
                  <span className="shimmer  s4"></span> */}
                </div>
              </div>
            </div>

          )}
          {!isLoading && (
            <div className="hidden w-full gap-3 justify-start items-center ">
              {/* <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">

              
                <img
                  src={Assets.Svgs.IntelligenceLogo}
                  className="absolute inset-0 w-full h-full object-contain p-1"
                  alt="AI Sharp Base"
                />

              
                <img
                  src={Assets.Svgs.IntelligenceLogo}
                  className="absolute inset-0 w-full h-full object-contain p-1 blur-[2px] opacity-80"
                  style={{
                    animation: 'blurLens 2s ease-in-out infinite alternate'
                  }}
                  alt="AI Blurred Lens"
                />

             
                <style>{`
    @keyframes blurLens {

      0% { clip-path: circle(35% at 0% 50%); }
      100% { clip-path: circle(35% at 100% 50%); }
    }
  `}</style>

              </div> */}
                   <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse flex items-center justify-center shrink-0 border border-primary/20 p-1">
                 <img
                   src={Assets.Svgs.IntelligenceLogo}
                   className="w-full h-full object-contain"
                   alt="AI"
                 />
               </div>
              <div className=" rounded-2xl animate-pulse">
                <div className="relative text-base borer overflow-hidden text-neutral-05 ">
                    <div className="text-gray-500 text-base ">
          Thinking<span className="dots"></span>
        </div>      <style jsx>{`
        .spinner {
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top: 4px solid #0056b3;
          border-radius: 50%;
          animation: spin 1s linear infinite, morphOut 0.5s forwards 2s;
        }

        .thinking-icon {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(0.5);
          animation: morphIn 0.5s forwards 2.2s;
        }

        .dots::after {
          content: "";
          animation: dots 1.5s steps(4, end) infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes morphOut {
          to {
            opacity: 0;
            transform: scale(0.5) rotate(360deg);
          }
        }

        @keyframes morphIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes dots {
          0%, 20% { content: ""; }
          40% { content: "."; }
          60% { content: ".."; }
          80% { content: "..."; }
        }

        /* 🔥 Image reveal effect */
        @keyframes blurLens {
          0% {
            opacity: 0;
            filter: blur(20px);
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
          }
        }

        .animate-blurLens {
          animation: blurLens 0.6s ease forwards;
        }
      `}</style>
{/* 
                  <div className="flex gap-12 items-center justify-center">
                    Thinking...
                    <span>
                      <img
                        src={isDark ? Assets.Svgs.arrowLeftSvgDark : Assets.Svgs.ArrowLeftSvg}
                        alt="Arrow icon"
                        className="size-4 group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </div>

                  <span className="shimmer  s1"></span>
                  <span className="shimmer  s2"></span>
                  <span className="shimmer  s3"></span>
                  <span className="shimmer  s4"></span> */}
                </div>
              </div>
            </div>

          )}
          
         {/* Replace this: */}
{/* <img src={img} alt={title} /> */}

{/* With this: */}


<div className=" gap-3 hidden relative items-center animate-pulse">
  <RevealImage    />
  <div className="text-gray-500 text-base ">
          Thinking<span className="dots"></span>
        </div>      <style jsx>{`
        .spinner {
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top: 4px solid #0056b3;
          border-radius: 50%;
          animation: spin 1s linear infinite, morphOut 0.5s forwards 2s;
        }

        .thinking-icon {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(0.5);
          animation: morphIn 0.5s forwards 2.2s;
        }

        .dots::after {
          content: "";
          animation: dots 1.5s steps(4, end) infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes morphOut {
          to {
            opacity: 0;
            transform: scale(0.5) rotate(360deg);
          }
        }

        @keyframes morphIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes dots {
          0%, 20% { content: ""; }
          40% { content: "."; }
          60% { content: ".."; }
          80% { content: "..."; }
        }

        /* 🔥 Image reveal effect */
        @keyframes blurLens {
          0% {
            opacity: 0;
            filter: blur(20px);
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
          }
        }

        .animate-blurLens {
          animation: blurLens 0.6s ease forwards;
        }
      `}</style>
</div>
 <div className=" w-full gap-3 hidden justify-start items-center ">
            
             <RevealImage    />
              <div className=" rounded-2xl">
                <div className="relative text-base borer overflow-hidden text-neutral-05 ">

                  <div className="flex gap-12 items-center justify-center">
                    Thinking...
                    <span>
                      <img
                        src={isDark ? Assets.Svgs.arrowLeftSvgDark : Assets.Svgs.ArrowLeftSvg}
                        alt="Arrow icon"
                        className="size-4 group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </div>

                  <span className="shimmer  s1"></span>
                  <span className="shimmer  s2"></span>
                  <span className="shimmer  s3"></span>
                  <span className="shimmer  s4"></span>
                </div>
              </div>
            </div>

          {/* <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
  

  <img
    src={Assets.Svgs.IntelligenceLogo}
    className="absolute inset-0 w-full h-full object-contain p-1 blur-[3px] opacity-40"
    alt="AI Blurred"
  />


  <img
    src={Assets.Svgs.IntelligenceLogo}
    className="absolute inset-0 w-full h-full object-contain p-1"
    style={{
      animation: 'pureReveal 2s ease-in-out infinite alternate'
    }}
    alt="AI Sharp Reveal"
  />


  <style>{`
    @keyframes pureReveal {

      0% { clip-path: circle(35% at 0% 50%); }
      100% { clip-path: circle(35% at 100% 50%); }
    }
  `}</style>

</div> */}
          {/* <div className="flex w-full gap-3 justify-start items-center ">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 p-1">
              <img
                src={Assets.Svgs.IntelligenceLogo}
                className="w-full h-full object-contain"
                alt="AI"
              />
            </div>
            <div className=" px-4  rounded-2xl">
          <div className="relative text-base borer overflow-hidden text-neutral-05 ">
          
              <div className="flex gap-12 items-center justify-center">
                Thinking...
                <span>
                  <img
                    src={isDark ? Assets.Svgs.arrowLeftSvgDark : Assets.Svgs.ArrowLeftSvg}
                    alt="Arrow icon"
                    className="size-4 group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </div>

              <span className="shimmer bg-blue-500 s1"></span>
              <span className="shimmer bg-blue-500 s2"></span>
              <span className="shimmer bg-blue-500 s3"></span>
              <span className="shimmer bg-blue-500 s4"></span>
            </div>
            </div>
          </div>


          

          <div className="flex items-center justify-center h-40">
            <div className="relative text-base  text-neutral-05 overflow-hidden">
                 <div className="flex gap-12 items-center justify-center">
                Thinking...
                <span>
                  <img
                    src={isDark ? Assets.Svgs.arrowLeftSvgDark : Assets.Svgs.ArrowLeftSvg}
                    alt="Arrow icon"
                    className="size-4 group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </div>

              <span className="shimmer bg-blue-500 s1"></span>
              <span className="shimmer bg-blue-500 s2"></span>
              <span className="shimmer bg-blue-500 s3"></span>
              <span className="shimmer bg-blue-500 s4"></span>
            </div>
          </div>



          
          <div className="flex items-center justify-center h-40">
            <div className="relative text-base  text-neutral-05 ">
          
              <div className="flex gap-12 items-center justify-center">
                Thinking...
                <span>
                  <img
                    src={isDark ? Assets.Svgs.arrowLeftSvgDark : Assets.Svgs.ArrowLeftSvg}
                    alt="Arrow icon"
                    className="size-4 group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </div>

              <span className="float-shimmer bg-blue-500 s1"></span>
              <span className="float-shimmer bg-blue-500 s2"></span>
              <span className="float-shimmer bg-blue-500 s3"></span>
              <span className="float-shimmer bg-blue-500 s4"></span>
            </div>
          </div> */}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area - Only show when Chat IS Active (since intro has its own input) */}
      {isChatActive && (
        <div className="p-4 bg-background dark:bg-[#1C1F22] border-t border-border mt-auto">
          {isLimitReached ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
              <div className="text-2xl">💤</div>
              <p className="text-sm font-medium text-foreground">Thinking Assistant is sleeping</p>
              <p className="text-xs text-muted-foreground">Please come back after 1 hour to continue.</p>
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
