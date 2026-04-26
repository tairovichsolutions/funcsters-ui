import { ArrowUp } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  onSend?: (text: string) => void;
  maxHeight?: number;
};

const MAX_CHARS = 1000;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function GPTLikeInput({ onSend, maxHeight = 180 }: Props) {
  const { id } = useParams();
  const slug = String(id);
  const DRAFT_KEY = `funcsters_ta_draft_${slug}`;

  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [taHeight, setTaHeight] = useState(42);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) setValue(saved);
  }, [DRAFT_KEY]);

  const send = () => {
    const text = value.trim();
    if (!text || text.length > MAX_CHARS) return;
    onSend?.(text);
    setValue("");
    localStorage.removeItem(DRAFT_KEY);
  };

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;

    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";

    setTaHeight(next);
  }, [value, maxHeight]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValue(val);
    localStorage.setItem(DRAFT_KEY, val);
  };

  const radius = useMemo(() => {
    const minH = 42;
    const maxH = 50;
    const t = clamp((taHeight - minH) / (maxH - minH), 0, 1);
    const start = 28;
    const end = 16;
    return start + (end - start) * t;
  }, [taHeight]);

  const charCount = value.length;
  const isLimitExceeded = charCount > MAX_CHARS;
  const disabled = !value.trim() || isLimitExceeded;

  const isTall = taHeight > 50;

  return (
    <div className="flex flex-col w-full gap-2">
      <div
        className="relative w-full border dark:bg-[#0C1C31] dark:border-[#55606F] border-[#B3B3B3] bg-white pl-4 pr-12 py-2.5 focus-within:border-black/30"
        style={{
          borderRadius: `${radius}px`,
          transition: "border-radius 320ms cubic-bezier(.2,.8,.2,1), border-color 200ms ease",
        }}
      >
        <textarea
          ref={taRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          placeholder="Ask anything..."
          rows={1}
          className="block text-sm w-full min-w-0 bg-transparent dark:text-white hide-scrollbar outline-none border-none resize-none leading-6 py-1 text-gray-900 placeholder:text-gray-400"
        />

        <button
          type="button"
          onClick={send}
          disabled={disabled}
          aria-label="Send message"
          className={cn(
            "absolute right-3 rounded-full flex justify-center items-center size-8 shrink-0",
            " bg-black dark:bg-white dark:text-black text-white disabled:opacity-40 disabled:cursor-not-allowed",
            "transition-transform active:scale-95",
            isTall ? "bottom-3" : "top-1/2 -translate-y-1/2"
          )}
        >
          <ArrowUp size={19} />
        </button>
      </div>

      {isLimitExceeded && (
        <div
          className={cn(
            "text-[10px] px-4 animate-in fade-in slide-in-from-top-1 duration-300",
            "text-red-500 font-bold"
          )}
        >
          {charCount} / {MAX_CHARS} characters (Limit exceeded)
        </div>
      )}
    </div>
  );
}
