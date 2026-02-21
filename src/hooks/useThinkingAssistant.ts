"use client";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axiosClient";

const STORAGE_KEY = "funcsters_ta_history";
const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseThinkingAssistantReturn {
  messages: Message[];
  sendMessage: (userText: string) => Promise<void>;
  isLoading: boolean;
  isLimitReached: boolean;
}

export const useThinkingAssistant = (
  slug: string,
  currentCode: string,
  language: string
): UseThinkingAssistantReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Check if limit is already reached based on loaded messages
  useEffect(() => {
    // Current limit is 20 user messages. 
    // Since history has pairs, roughly 40 total messages. 
    // But backend counts "turns" or "requests".
    // We can just rely on the error from backend, OR count locally.
    // Let's count locally as a first defense.
    const userMsgCount = messages.filter(m => m.role === "user").length;
    if (userMsgCount >= 20) {
      setIsLimitReached(true);
    } else {
      setIsLimitReached(false);
    }
  }, [messages]);

  // Load history on mount/slug change
  useEffect(() => {
    if (!slug) return;
    const allStorage = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const problemData = allStorage[slug];

    if (problemData) {
      setMessages(problemData.history);

      // Reset the 2-hour timer just by viewing/opening the tab
      allStorage[slug] = {
        ...problemData,
        lastActive: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allStorage));
    } else {
      setMessages([]);
    }
  }, [slug]);

  const sendMessage = async (userText: string) => {
    // Prevent sending if limit reached
    if (isLimitReached) return;

    setIsLoading(true);

    // Optimistic update? No, because we might not save if failed.
    // But we need to send history.
    const historyToSend = messages;

    try {
      const payload = {
        userMessage: userText,
        currentCode,
        language,
        history: historyToSend,
      };

      const fullUrl = `http://localhost:8091/api/v1/challenges/${slug}/thinking-assistant/chat`;

      const response = await apiClient.post(
        fullUrl,
        payload
      );

      const data = response.data.data || response.data;

      if (!data) {
        throw new Error("Invalid API response format");
      }

      let finalHistory: Message[];

      if (data.primedMessage) {
        // Turn 1: Replace user's short message with primed one
        finalHistory = [
          { role: "user", content: data.primedMessage },
          { role: "assistant", content: data.reply || "" },
        ];
      } else {
        // Subsequent turns: Append
        finalHistory = [
          ...messages,
          { role: "user", content: userText },
          { role: "assistant", content: data.reply || "" },
        ];
      }

      setMessages(finalHistory);

      // Explicitly check for the limit message in the reply to trigger UI exhaustion
      if (data.reply?.includes("🚫") || data.reply?.includes("Limit Reached")) {
        setIsLimitReached(true);
      }

      // Save to localStorage
      const allStorage = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      allStorage[slug] = {
        lastActive: Date.now(),
        history: finalHistory,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allStorage));
    } catch (error: any) {
      console.error("Thinking Assistant Error:", error);

      // Handle fallback HTTP status codes if the backend switches to errors
      if (error?.response?.status === 400 || error?.response?.status === 429) {
        setIsLimitReached(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, isLimitReached };
};

export const performTAGarbageCollection = () => {
  if (typeof window === "undefined") return;
  const allStorage = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const now = Date.now();
  let changed = false;

  Object.keys(allStorage).forEach((slug) => {
    const lastActive = allStorage[slug].lastActive;
    if (now - lastActive > TTL_MS) {
      delete allStorage[slug];
      changed = true;
      console.log(`GC: Cleared cached chat for ${slug}`);
    }
  });

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStorage));
  }
};
