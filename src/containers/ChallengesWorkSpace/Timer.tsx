/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Iconify } from "@/components";
import React, { useEffect, useState } from "react";

type TimerProps = {
  initialSeconds?: number;
  className?: string;
  challengeId: number | null;
};

const TIMER_LOCAL_STORAGE_KEY = "funcsters-timers";

type TimerEntry = {
  challengeId: number;
  seconds: number;
  isRunning: boolean;
};

const readTimers = (): TimerEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TIMER_LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TimerEntry[]) : [];
  } catch {
    return [];
  }
};

const getSavedTimer = (challengeId: number | null): TimerEntry | null => {
  if (!challengeId) return null;
  const timers = readTimers();
  const found = timers.find((t) => t.challengeId === challengeId);
  return found ?? null;
};

const saveTimer = (
  challengeId: number | null,
  seconds: number,
  isRunning: boolean
) => {
  if (!challengeId || typeof window === "undefined") return;

  const timers = readTimers();
  const idx = timers.findIndex((t) => t.challengeId === challengeId);

  if (seconds === 0 && !isRunning) {
    if (idx !== -1) {
      timers.splice(idx, 1);
      window.localStorage.setItem(
        TIMER_LOCAL_STORAGE_KEY,
        JSON.stringify(timers)
      );
    }
    return;
  }

  const entry: TimerEntry = {
    challengeId,
    seconds,
    isRunning,
  };

  if (idx === -1) {
    timers.push(entry);
  } else {
    timers[idx] = entry;
  }

  window.localStorage.setItem(TIMER_LOCAL_STORAGE_KEY, JSON.stringify(timers));
};

const useCountUpTimer = (initialSeconds = 0, challengeId: number | null) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!challengeId || typeof window === "undefined") {
      setSeconds(initialSeconds);
      setIsRunning(false);
      return;
    }

    const saved = getSavedTimer(challengeId);

    if (saved) {
      setSeconds(saved.seconds ?? 0);
      setIsRunning(false);
    } else {
      setSeconds(initialSeconds);
      setIsRunning(false);
    }
  }, [challengeId, initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (!challengeId) return;
    if (seconds === 0 && !isRunning) return;
    saveTimer(challengeId, seconds, isRunning);
  }, [seconds, isRunning, challengeId]);

  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  const reset = () => {
    setSeconds(0);
    setIsRunning(false);
    saveTimer(challengeId, 0, false);
  };

  return { seconds, isRunning, toggleRunning, reset };
};

const formatTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [
    h.toString().padStart(2, "0"),
    m.toString().padStart(2, "0"),
    s.toString().padStart(2, "0"),
  ];
};

const IconButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className={`flex h-[29px] w-[29px] rounded-md text-[#005092] hover:bg-[#d7e9ff] dark:hover:bg-[#d7e9ff]/10  items-center justify-center cursor-pointer transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Timer = ({
  initialSeconds = 0,
  className,
  challengeId,
}: TimerProps) => {
  const [expanded, setExpanded] = useState(false);
  const { seconds, isRunning, toggleRunning, reset } = useCountUpTimer(
    initialSeconds,
    challengeId
  );

  const [h, m, s] = formatTime(seconds);

  return (
    <div
      className={`inline-flex items-center rounded-md bg-[#0050921A] dark:bg-[#FFFFFF1A] text-[#005092] dark:text-white! p-1 transition-all duration-300 ${className}`}
    >
      <IconButton
        onClick={() => setExpanded((v) => !v)}
        className="
          border border-primary dark:border-white!
          bg-[#008CFF14] dark:bg-[#FFFFFF14]
          text-primary dark:text-white!
        "
      >
        <Iconify
          strokeWidth={10}
          iconName="lets-icons:clock"
          className="text-xl"
        />
      </IconButton>

      <div
        className={`flex items-center gap-1 overflow-hidden transition-all duration-300 ease-out
          ${
            expanded
              ? "max-w-[210px] opacity-100 ml-1 mr-1 translate-x-0"
              : "max-w-0 opacity-0 ml-0 -translate-x-1 pointer-events-none"
          }`}
      >
        <IconButton onClick={toggleRunning}>
          {isRunning ? (
            <Iconify
              iconName="ic:round-pause"
              className="size-5 text-[#005092] dark:text-white! "
            />
          ) : (
            <Iconify
              iconName="stash:play-solid"
              className="size-5 text-[#005092] dark:text-white!"
            />
          )}
        </IconButton>

        <div className="flex items-center justify-center gap-1 text-sm leading-none font-bold tracking-[0.12em] tabular-nums min-w-[90px]">
          <span>{h}</span>
          <span className="opacity-60">|</span>
          <span>{m}</span>
          <span className="opacity-60">|</span>
          <span>{s}</span>
        </div>

        {!isRunning && (
          <IconButton onClick={reset}>
            <Iconify
              iconName="humbleicons:restart"
              className="size-5 text-[#005092] dark:text-white! "
            />
          </IconButton>
        )}
      </div>
    </div>
  );
};
