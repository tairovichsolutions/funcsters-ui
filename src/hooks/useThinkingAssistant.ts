"use client";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axiosClient";
import toast from "react-hot-toast";

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
    // We only set limit reached to true if we are NOT currently waiting for a response.
    // This allows the 20th response to be seen before the blocker appears.
    const userMsgCount = messages.filter(m => m.role === "user").length;
    if (userMsgCount >= 20 && !isLoading) {
      setIsLimitReached(true);
    } else if (userMsgCount < 20) {
      setIsLimitReached(false);
    }
  }, [messages, isLoading]);

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

    // Capture history before optimistic update
    const historyBefore = messages;

    // 1. Optimistically display user message
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    try {
      const payload = {
        userMessage: userText,
        currentCode,
        language,
        history: historyBefore,
      };

      const fullUrl = `/api/thinking-assistant/${slug}/chat`;

      const response = await apiClient.post(fullUrl, payload);

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
        // Subsequent turns: Append to fixed history
        finalHistory = [
          ...historyBefore,
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

      // Rollback optimistic update on error
      setMessages(historyBefore);

      // Handle fallback HTTP status codes if the backend switches to errors
      if (error?.response?.status === 400 || error?.response?.status === 429) {
        setIsLimitReached(true);
      }

      toast.error(error?.response?.data?.message || "Failed to send message. Please try again.");
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

    }
  });

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStorage));
  }
};
