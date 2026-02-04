"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib";
import { Tooltip } from "./tooltip";

export function TitleWithTooltipIfTruncated({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setTruncated(el.scrollWidth > el.clientWidth + 1);
    };

    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);

    return () => ro.disconnect();
  }, [title]);

  return (
    <Tooltip
      enabled={truncated} 
      content={title}
      place="top"
      className="bg-primary! shadow-2xl text-sm!"
      childrenClass="block w-full min-w-0"
    >
      <h1
        ref={ref}
        className={cn(
          "block w-full min-w-0 truncate text-[23px] font-extrabold 2xl:text-[26px]",
          className,
        )}
      >
        {title}
      </h1>
    </Tooltip>
  );
}
