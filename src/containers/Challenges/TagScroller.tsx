import { TagChip } from "@/components";
import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function TagScroller({ tags }: { tags: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const left = el.scrollLeft;
    const rightEdge = left + el.clientWidth;

    const epsilon = 2;

    setCanScrollLeft(left > epsilon);
    setCanScrollRight(rightEdge < el.scrollWidth - epsilon);
  }, []);

  useLayoutEffect(() => {
    checkScroll();
    rafRef.current = requestAnimationFrame(checkScroll);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tags, checkScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => checkScroll());
    ro.observe(el);

    window.addEventListener("resize", checkScroll);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = Math.max(150, Math.floor(el.clientWidth * 0.8));

    el.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });

    requestAnimationFrame(checkScroll);
    setTimeout(checkScroll, 250);
    setTimeout(checkScroll, 500);
  };

  return (
    <div
      className="relative flex items-center"
      onClick={(e) => e.stopPropagation()}
    >
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={(e) => {
            e.stopPropagation();
            scroll("left");
          }}
          className="absolute left-0 z-10 h-full px-2 rounded-r-md cursor-pointer
                     bg-linear-to-r to-white/70 dark:to-[#192631]/60 from-white dark:from-[#192631]"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 pe-2 flex-nowrap overflow-x-auto hide-scrollbar scroll-smooth"
      >
        {tags.map((tag) => (
          <TagChip key={tag}  variant="blue"  className=" text-nowrap rounded-full! text-[10px]! px-2! py-1! text-[#005092]">
            {tag}
          </TagChip>
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={(e) => {
            e.stopPropagation();
            scroll("right");
          }}
          className="absolute right-0 z-10 h-full px-2 rounded-l-md cursor-pointer
                     bg-linear-to-l to-white/70 dark:to-[#192631]/60 from-white dark:from-[#192631]"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
