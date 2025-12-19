/* eslint-disable @next/next/no-img-element */
import { Marquee } from "@/components/ui/marquee";
import { firstRow, secondRow, SomeTopAvatar, thirdRow } from "@/mock/reviews";
import { Plus } from "lucide-react";
import { ReviewCard } from "../WhyDeveloperChoose/ReviewCard";

export function MarqueeArea() {
  return (
    <div className="relative flex md:h-[600px] w-full  md:flex-row flex-col items-center justify-center overflow-hidden">
      <Marquee
        pauseOnHover
        reverse
        vertical
        className="[--duration:45s]! md:flex hidden"
      >
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee
        pauseOnHover
        vertical
        className="[--duration:45s]! md:flex hidden"
      >
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      <Marquee
        pauseOnHover
        reverse
        vertical
        className="[--duration:45s]! md:flex hidden"
      >
        {thirdRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee
        pauseOnHover
        reverse
        horizontal
        className="[--duration:45s]! md:hidden flex"
      >
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee
        pauseOnHover
        horizontal
        className="[--duration:45s]! md:hidden flex"
      >
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      <Marquee
        pauseOnHover
        reverse
        horizontal
        className="[--duration:45s]! md:hidden flex"
      >
        {thirdRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      <div className=" absolute flex items-center gap-3  bottom-20  bg-[#001628] border border-[#004D8C] px-2 py-2 rounded-full">
        <div className=" md:flex hidden -space-x-1 z-20 justify-center items-center">
          {SomeTopAvatar.map((src, idx) => (
            <img
              key={idx}
              className="rounded-full border border-white overflow-hidden size-[23px] 3xl:size-[37.024px]"
              alt=""
              src={src}
            />
          ))}
        </div>
        <p className="text-base 3xl:text-[22.215px] leading-none! text-[#B6B3BA]">
          +3 million users enjoy Funcstres
        </p>
        |
        <button className=" flex items-center leading-none! text-base 3xl:text-[22.215px] gap-2  text-[#FFFFFF]">
          view all{" "}
          <span className=" bg-[#004D8C] rounded-full p-0.5 3xl:p-2 text-white mb-0.5">
            <Plus size={10} />
          </span>
        </button>
      </div>
      <div className="bg-linear-to-b from-[#0c0c0c] to-transparent pointer-events-none absolute left-0  right-0 top-0 h-8  "></div>
      <div className="bg-linear-to-t from-[#0c0c0c] to-transparent pointer-events-none absolute left-0  right-0  bottom-0 h-24  "></div>
    </div>
  );
}
