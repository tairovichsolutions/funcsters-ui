import { Swiper, SwiperSlide } from "swiper/react";
import { firstRow } from "@/mock/reviews";
import { ReviewCard } from "./ReviewCard";
import { useRef, useState } from "react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

interface Props {
  showNavigation?: boolean;
}

export const ReviewSwiper = ({ showNavigation = false }: Props) => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        grabCursor
        centeredSlides={true}
        slidesPerView={"auto"}
        loop
        direction="horizontal"
        spaceBetween={20}
        breakpoints={{
          630: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        autoplay={{
          delay: 2000,
        }}
      >
        {firstRow.map((review) => (
          <SwiperSlide key={review.username}>
            {({ isActive }) => (
              <ReviewCard
                {...review}
                isActive={isActive}
                className="h-88 3xl:h-110! "
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {showNavigation && (
        <div className="flex items-center justify-center gap-3 mt-14">
          {firstRow.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer
                ${
                  activeIndex === index
                    ? "w-6 bg-[#008CFF]"
                    : "w-2 bg-[#212121]"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
