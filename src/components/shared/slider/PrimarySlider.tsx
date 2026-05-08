/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";
import Image from "next/image";
import { useMemo } from "react";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";


export interface TutorItem {
  src: string;
  alt?: string;
  bg?: string;
  profileLink?: string;
  buttonText?: string;
  tooltip?: string;
}

export interface TutorsCarouselProps {
  tutors: TutorItem[];
  className?: string;

  variant?: "overlay" | "bottom" | "icon" | "none";
  showTooltip?: boolean;
  buttonText?: string;
  tooltipText?: string;

  autoplay?: boolean;
  autoplayDelay?: number;  // 0 => marquee (when not using CSS rail)
  pauseOnHover?: boolean;
  speed?: number;          // ms (used as duration for marquee rail; Swiper speed for non-marquee)

  zoomOnHover?: boolean;

  breakpoints?: SwiperOptions["breakpoints"];

  /** Force marquee mode (uses CSS rail instead of Swiper autoplay) */
  isMarquee?: boolean;

  /** Play exactly once in marquee mode (no loop) */
  playOnce?: boolean;
}

export default function PrimarySlider({
  tutors,
  className,

  variant = "icon",
  showTooltip = true,
  buttonText = "View Profile",
  tooltipText = "View Profile",

  autoplay = true,
  autoplayDelay = 2000,
  pauseOnHover = false,
  speed = 600,

  isMarquee = false,
  zoomOnHover = true,

  breakpoints,

  playOnce = false,
}: TutorsCarouselProps) {
  const items = useMemo(
    () => tutors.map((t) => (typeof t === "string" ? { src: t } : t)),
    [tutors]
  );

  // If marquee, render CSS rail (pauses on hover, supports playOnce)
  if (isMarquee) {
    // Duration: if user left default 600, give smooth crawl
    const durationMs = speed === 600 ? 8000 : speed;
    const iterationCount = playOnce ? 1 : "infinite";

    // Duplicate content once for seamless loop
    const railItems = [...items, ...items];

    return (
      <div
        className={`keenlys-marquee-group ${className ?? ""}`}
        aria-label="Our Tutors marquee"
        // pause handled purely by CSS :hover
        style={
          {
        
            "--marquee-duration": `${durationMs}ms`,
            "--marquee-iteration": iterationCount as any,
          } as React.CSSProperties
        }
      >
        <div className="keenlys-marquee-track">
          {railItems.map((item, i) => {
            const text = item.buttonText ?? buttonText;
            const tip = item.tooltip ?? tooltipText;
            const imgHoverClass = zoomOnHover ? "group-hover:scale-105" : "";
            return (
              <div
                key={`${item.src}-${i}`}
                className="keenlys-marquee-item border-0! group shrink-0"
                style={{ background: item.bg ?? "#fff" }}
              >
                <div
                  // href={item.profileLink ?? "/"}
                  aria-label={`Open ${item.alt ?? "Tutor"} profile`}
                  className="block h-full w-max cursor-pointer "
                >
                  <Image
                    src={item.src}
                    alt={item.alt ?? "Tutor"}
                    width={800}
                    height={800}
                    className={`h-32 w-32 object-contain transition-transform duration-300 ease-out ${imgHoverClass}`}
                  />

                  {variant === "overlay" && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="relative z-10">
                        <span className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-md">
                          {text}
                        </span>
                      </div>
                    </div>
                  )}

                  {variant === "bottom" && (
                    <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="inline-block text-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-md">
                        {text}
                      </span>
                    </div>
                  )}

                  {variant === "icon" && (
                    <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <div className="relative flex justify-center">
                        <span className="peer pointer-events-auto relative inline-flex rounded-full bg-white p-2 text-black shadow-md hover:bg-gray-100">
                         faa user
                        </span>

                        {showTooltip && (
                          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded-md bg-black px-2 py-1 text-xs text-white whitespace-nowrap transition-transform duration-200 peer-hover:scale-100">
                            {tip}
                            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-black" />
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- Non-marquee: keep your Swiper logic ----------
  const defaultBreakpoints: SwiperOptions["breakpoints"] = {
    0: { slidesPerView: 2.5 },
    640: { slidesPerView: 4 },
    768: { slidesPerView: 7 },
    1024: { slidesPerView: 7 },
  };
  const appliedBreakpoints = breakpoints ?? defaultBreakpoints;

  const autoplayConfig = autoplay
    ? {
        delay: autoplayDelay,
        disableOnInteraction: false,
        pauseOnMouseEnter: pauseOnHover,
      }
    : false;

  return (
    <div className={className}>
      <Swiper
        modules={[Autoplay, A11y]}
        loop
       
 
       
        allowTouchMove
        grabCursor
        speed={speed}
        autoplay={autoplayConfig}
        spaceBetween={16}
        breakpoints={appliedBreakpoints}
        aria-label="Our Tutors carousel"
      >
        {items.map((item, i) => {
          const text = item.buttonText ?? buttonText;
          const tip = item.tooltip ?? tooltipText;
          const imgHoverClass = zoomOnHover ? "group-hover:scale-105" : "";

          return (
            <SwiperSlide key={`${item.src}-${i}`}>
              <div
                className="group relative h-40 w-full overflow-hidden rounded-2xl border border-black/5 shadow-sm transition-all duration-300 hover:shadow-md"
                style={{ background: item.bg ?? "#f4f4f5" }}
              >
                <Link href={item.profileLink ?? "/"} aria-label={`Open ${item.alt ?? "Tutor"} profile`}>
                  <Image
                    src={item.src}
                    alt={item.alt ?? "Tutor"}
                    width={400}
                    height={400}
                    className={`h-full w-full object-cover transition-transform duration-300 ease-out ${imgHoverClass}`}
                  />

                  {variant === "none" && (
                    <div className=" hidden pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="relative z-10">
                        <span className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-md">
                          {text}
                        </span>
                      </div>
                    </div>
                  )}
                  {variant === "overlay" && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="relative z-10">
                        <span className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-md">
                          {text}
                        </span>
                      </div>
                    </div>
                  )}

                  {variant === "bottom" && (
                    <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="inline-block text-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-md">
                        {text}
                      </span>
                    </div>
                  )}

                  {variant === "icon" && (
                    <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <div className="relative flex justify-center">
                        <span className="peer pointer-events-auto relative inline-flex rounded-full bg-white p-2 text-black shadow-md hover:bg-gray-100">
                          faaah
                        </span>

                        {showTooltip && (
                          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded-md bg-black px-2 py-1 text-xs text-white whitespace-nowrap transition-transform duration-200 peer-hover:scale-100">
                            {tip}
                            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-black" />
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {/* variant "none": no hover UI */}
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>   
      <style jsx>{`
  @keyframes keenlys-marquee {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); } /* move by half because we duplicated items */
  }

  .keenlys-marquee-group {
    overflow: hidden;
    position: relative;
  }

  .keenlys-marquee-track {
    display: flex;
    width: max-content;        /* allow natural width */
    will-change: transform;
    animation-name: keenlys-marquee;
    animation-timing-function: linear;
    animation-duration: var(--marquee-duration, 12000ms);
    animation-iteration-count: var(--marquee-iteration, infinite);
  }

  /* Pause on hover (no JS needed) */
  .keenlys-marquee-group:hover .keenlys-marquee-track {
    animation-play-state: paused;
  }

  /* Item sizing (approx slidesPerView feel) */
  .keenlys-marquee-item {
    position: relative;
    height: 10rem;             /* h-40 */
    width: 9rem;               /* ~w-36 */
    margin-right: 16px;        /* spaceBetween 16 */
    border-radius: 1rem;       /* rounded-2xl */
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    overflow: hidden;
  }

  @media (min-width: 640px) {
    .keenlys-marquee-item { width: 10rem; }  /* sm:w-40 */
  }
  @media (min-width: 768px) {
    .keenlys-marquee-item { width: 11rem; }  /* md:w-44 */
  }
  @media (min-width: 1024px){
    .keenlys-marquee-item { width: 12rem; }  /* lg:w-48 */
  }
`}</style>

    </div>
  );
}
