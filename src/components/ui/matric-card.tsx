/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib";
import React, { ReactNode } from "react";
interface props {
  imgSrc: string;
  className: string;
  children: ReactNode;
}
export const MatricCard = React.memo(
  ({ className, children, imgSrc }: props) => {
    return (
      <div
        className={cn(
          "relative h-[225px] 3xl:h-60 overflow-hidden rounded-md p-2 bg-challenge-progress-card",
          className,
        )}
      >
        {children}

        <div className="absolute bottom-0 left-0 ">
          <img src={imgSrc} alt="Challenge_Progress_Image" />
        </div>
      </div>
    );
  },
);
