/* eslint-disable @next/next/no-img-element */

import { ReactNode } from "react";
import { Assets } from "@/constants/assets";
import { cn } from "@/lib";

interface Props {
  imgSrc?: string;
  children: ReactNode;
  className?: string;
}

export const ArrowButton = ({
  children,
  className,
  imgSrc = Assets.Svgs.ArrowLeft,
}: Props) => {
  return (
    <button
      className={cn(
        "bg-primary border border-white text-white mt-6 text-base h-11 px-6 rounded-md flex items-center gap-4 leading-none group overflow-hidden cursor-pointer",
        className
      )}
    >
      <span className="mt-0.5">{children}</span>
      <span className="relative w-6 h-6">
        <img
          alt="arrow_left"
          src={imgSrc}
          className="size-6 m-0! p-0! absolute transition-all duration-300 group-hover:translate-x-8 group-hover:opacity-0"
        />
        <img
          alt="arrow_left"
          src={imgSrc}
          className="size-6 m-0! p-0! absolute -translate-x-8 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </span>
    </button>
  );
};
