/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { ChevronUp } from 'lucide-react';

export type FaqItem = {
  animationDuration?: number;
  animateCloseDuration?: number;
  id?: string;
  question: string;
  answer: string | React.ReactNode;
  isPreOpen?: boolean;
  icon?: React.ElementType;
};

type PreOpenStrategy = "fromArray" | "first" | "all" | "none";

type FaqProps = {
  items: FaqItem[];
  isRotateIcon?: boolean;
  allowMultiple?: boolean;          // default false
  preOpenStrategy?: PreOpenStrategy; // default "fromArray"
  animate?: boolean;                 // NEW — default true
  transitionMs?: number;             // default 280
  className?: string;
  setActiveIndex?: React.Dispatch<React.SetStateAction<number>>;
};

const cn = (...xs: (string | false | null | undefined)[]) =>
  xs.filter(Boolean).join(" ");

export default function Faq({
  items,
  allowMultiple = false,
  isRotateIcon = true,
  preOpenStrategy = "fromArray",
  animate = true,
  transitionMs = 280,
  className,
  setActiveIndex
}: FaqProps) {
  // initial open from array
  const initialOpen = React.useMemo(() => {
    let idxs: number[] = [];
    switch (preOpenStrategy) {
      case "all":
        idxs = items.map((_, i) => i);
        break;
      case "first":
        idxs = items.length ? [0] : [];
        break;
      case "none":
        idxs = [];
        break;
      case "fromArray":
      default:
        idxs = items
          .map((it, i) => (it.isPreOpen ? i : -1))
          .filter((i) => i !== -1);
        break;
    }
    if (!allowMultiple && idxs.length > 1) idxs = [idxs[0]];
    return new Set(idxs);
  }, [items, preOpenStrategy, allowMultiple]);

  const [openSet, setOpenSet] = React.useState<Set<number>>(initialOpen);
  React.useEffect(() => setOpenSet(initialOpen), [initialOpen]);

  const toggle = (i: number) => {
    // 1. Calculate the new state first using the current openSet
    const next = new Set(openSet);
    const isOpen = next.has(i);

    if (allowMultiple) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isOpen ? next.delete(i) : next.add(i);
    } else {
      next.clear();
      if (!isOpen) next.add(i);
    }

    // 2. Update the internal component state
    setOpenSet(next);

    // 3. Update the parent component with the REAL active index
    if (setActiveIndex) {
      // Convert the Set to an array so we can grab the first open item
      const openArray = Array.from(next);

      // If there is an open item, pass its index. 
      // (If it's closed, you might want to pass -1 or undefined depending on your setup)
      if (openArray.length > 0) {
        setActiveIndex(openArray[0]);
      }
    }
  };

  return (
    <section
      aria-label="Frequently asked questions"
      className={cn(
        "w-full max-w-3xl mx-auto flex flex-col space-y-4       ",
        className
      )}
    >
      {items.map((it, i) => (
        <Row
          key={it.id ?? i}
          isRotateIcon={isRotateIcon}
          idx={i}
          Icon={it.icon}
          question={it.question}
          isOpen={openSet.has(i)}
          onToggle={() => toggle(i)}
          transitionMs={it?.animationDuration ? it.animationDuration : transitionMs}
          animate={animate}
          animateCloseDuration={it.animateCloseDuration ? it.animateCloseDuration : transitionMs}
        >
          {it.answer}
        </Row>
      ))}
    </section>
  );
}

/* ------------------------------ Row ------------------------------- */
function Row({
  Icon,
  isRotateIcon,
  idx,
  question,
  isOpen,
  onToggle,
  children,
  transitionMs,
  animate,
  animateCloseDuration
}: {
  idx: number;
  isRotateIcon?: boolean;
  Icon?: React.ElementType;
  question: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  transitionMs: number;
  animate: boolean;
  animateCloseDuration: number
}) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setMeasured(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const panelId = `faq-panel-${idx}`;
  const btnId = `faq-trigger-${idx}`;

  return (
    <div onClick={() => { onToggle() }} className={` group rounded-[12px] ${isOpen ? "bg-[#e8ebed] border-neutral-05 shadow-xs " : "bg-[#F5F8FB]"}   cursor-pointer border border-neutral-05`}>
      <button
        id={btnId}
        aria-controls={panelId}
        aria-expanded={isOpen}

        className={cn(
          "w-full flex items-center gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 rounded-xl sm:rounded-none"
        )}
      >
        <span className="flex-1  flex items-center gap-1 text-base sm:text-lg font-semibold   text-neutral-04">
          {Icon && <Icon className="w-6 h-6 text-neutral-04 " />}  {question}
        </span>
        {isRotateIcon &&
          <ChevronUp
            strokeWidth={2}
            className={`
  group-hover:stre-[3px] w-6 h-6 mb-[2px] transition-all
    ${animate ? `duration-[${transitionMs}ms]` : 'duration-0'}
    ${isOpen ? 'rotate-0' : 'rotate-180'} `} />
        }


      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        ref={contentRef}
        // style={{
        //   maxHeight: isOpen ? measured : 0,
        //   transition: animate
        //     ? `max-height ${transitionMs}ms cubic-bezier(.2,.8,.2,1)`
        //     : "none",
        // }}
        style={{
          maxHeight: isOpen ? measured : 0,
          transition: animate
            ? `max-height ${!isOpen && animateCloseDuration ? animateCloseDuration : transitionMs
            }ms cubic-bezier(.2,.8,.2,1)`
            : "none",
        }}


        className="px-5 sm:px-6 overflow-hidden"
      >
        <div className="pb-5 text-neutral-04 selection:bg-amber-200 sm:pb-6 text-sm sm:text-[15px] leading-6 ">
          {children}
        </div>
      </div>
    </div>
  );
}

/* -------------------------- Icon -------------------------- */
function PlusMinus({
  open,
  transitionMs,
  animate,
}: {
  open: boolean;
  transitionMs: number;
  animate: boolean;
}) {
  return (
    <div
      className={`p-[2px] rounded-full border transition-colors duration-200
        ${open
          ? "bg-blue-100 border-blue-300 group-hover:bg-blue-200"
          : "border-blue-500 group-hover:bg-blue-500"
        }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 22 22"
        className={cn(
          "shrink-0 ",
          open
            ? "rotate-180 text-blue-600"
            : "rotate-0 text-blue-600 group-hover:text-white",
          animate && "transition-transform"
        )}
        style={animate ? { transitionDuration: `${transitionMs}ms` } : undefined}
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {/* horizontal (always visible) */}
          <path d="M4 11h14" />
          {/* vertical (scales out to become minus) */}
          <path
            d="M11 4v14"
            style={{
              transformOrigin: "11px 11px",
              transform: open ? "scaleY(0)" : "scaleY(1)",
              transition: animate
                ? `transform ${transitionMs}ms ease`
                : "none",
            }}
          />
        </g>
      </svg>
    </div>
  );
}
