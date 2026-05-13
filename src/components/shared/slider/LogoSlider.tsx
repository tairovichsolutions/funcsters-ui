"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";

import { Assets } from "@/constants/assets";

const logos = Assets.Images.sponsoredIcons || [];

export default function LogoSlider() {
  return (
    <div className="w-full bg-gray-100 py-10 overflow-hidden">
      <p className="text-center text-gray-600 text-sm md:text-base mb-6">
        Join developers from top tech companies who practice on Functers.
      </p>

      <Swiper
        modules={[Autoplay, FreeMode]}
        loop={true}
        freeMode={true}
        speed={1000} // increase for smoother flow
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        slidesPerView="auto"
        spaceBetween={40}
        allowTouchMove={false} // important for marquee feel
        className="!py-4"
      >
        {/* 🔁 Duplicate logos for seamless loop */}
        {[...logos, ...logos].map((logo, i) => (
          <SwiperSlide key={i} className="!w-auto">
            <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition">
              <Image
                src={logo}
                alt="logo"
                width={120}
                height={60}
                className="object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}