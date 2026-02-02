import { ArrowUp } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onSend?: (text: string) => void;
  maxHeight?: number;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function GPTLikeInput({ onSend, maxHeight = 180 }: Props) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [taHeight, setTaHeight] = useState(42);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue("");
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

  const radius = useMemo(() => {
    const minH = 42;
    const maxH = 50;
    const t = clamp((taHeight - minH) / (maxH - minH), 0, 1);
    const start = 28;
    const end = 16;
    return start + (end - start) * t;
  }, [taHeight]);

  const disabled = !value.trim();

  const isTall = taHeight > 50;

  return (
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
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
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
        className={[
          "absolute right-3 rounded-full flex justify-center items-center size-8 shrink-0",
          " bg-black dark:bg-white dark:text-black text-white disabled:opacity-40 disabled:cursor-not-allowed",
          "transition-transform active:scale-95",
          isTall ? "bottom-3" : "top-1/2 -translate-y-1/2",
        ].join(" ")}
      >
        <ArrowUp size={19} />
      </button>
    </div>
  );
}
