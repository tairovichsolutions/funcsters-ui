/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Assets } from "@/constants/assets";
import { cn } from "@/lib";
import Image from "next/image";
import "swiper/css";
import PrimaryHeader from "../Headers/PrimaryHeader";

type SliderProps = {
    autoplay?: boolean
    loop?: boolean
    speed?: number
}

const skills = [
    {
        name: "Java",
        description: "Build robust enterprise apps and Android software.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "JavaScript",
        description: "The language that powers the entire web.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "Python",
        description: "The power of AI, Data Science, and Automation.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: true,
        challengeCount: "120+"
    },
    {
        name: "TypeScript",
        description: "Scalable and type-safe web development.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "PHP",
        description: "The power of AI, Data Science, and Automation.", // Note: The UI image uses the same description as Python for PHP
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "C++",
        description: "Fast, efficient programming for systems.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "Go",
        description: "Efficient concurrency and cloud-native development.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "Swift",
        description: "Powerful and intuitive programming for iOS.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "Java",
        description: "Build robust enterprise apps and Android software.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "JavaScript",
        description: "The language that powers the entire web.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "Python",
        description: "The power of AI, Data Science, and Automation.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: true,
        challengeCount: "120+"
    },
    {
        name: "TypeScript",
        description: "Scalable and type-safe web development.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "PHP",
        description: "The power of AI, Data Science, and Automation.", // Note: The UI image uses the same description as Python for PHP
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "C++",
        description: "Fast, efficient programming for systems.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "Go",
        description: "Efficient concurrency and cloud-native development.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    },
    {
        name: "Swift",
        description: "Powerful and intuitive programming for iOS.",
        icon: Assets.Images.landingPage.python1,
        shadowIcon: Assets.Images.landingPage.reactShadowIcon,
        isFeatured: false,
        challengeCount: 120
    }
];

import { useState } from 'react';


export default function SkillSlider({
    autoplay = true,
    loop = false, 
    speed = 800,
}: any) {
    const swiperRef = useRef<any>(null);
    
    // State to track if we are at the beginning or end
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const updateToggleStates = (swiper: any) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (
        <>
            <div className='pt-20'>
                <PrimaryHeader
                    eyebrowColor="text-orange-500 font-medium"
                    title={<span className="text-[2.75rem] sm:text-5xl lg:text-[3.375rem] font-semibold leading-[1.15] tracking-tight">
                        Explore and get fluent in<br className='hidden lg:block' />
                        <pre></pre>programing languages!
                    </span>}
                    description={<span> Take on real coding challenges, sharpen your logic, and build.<br /> the skills to level up — one solution at a time.</span>}
                    descriptionColor="text-[#878787] "
                    align="center"
                    alignLg="center"
                />
            </div>

            <div className="relative py-20 bg-[#f5f8fb]">
                {/* top indicator */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 text-blue-500 text-3xl">
                    <svg width="35" height="30" viewBox="0 0 38 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M36.813 2.57639L20.0126 31.7945C19.3515 32.9443 17.6927 32.9443 17.0316 31.7945L0.231149 2.57639C-0.427928 1.43018 0.399453 2.23864e-05 1.72165 2.22708e-05L35.3225 1.93333e-05C36.6447 1.92177e-05 37.4721 1.43017 36.813 2.57639Z" fill="#008CFF" />
                    </svg>
                </div>

                <Swiper
                    modules={[Autoplay]}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        updateToggleStates(swiper);
                    }}
                    onSlideChange={updateToggleStates}
                    slidesPerView={1.5}
                    centeredSlides={true}
                    spaceBetween={10}
                    loop={loop}
                    speed={speed}
                    autoplay={autoplay ? { delay: 2500, disableOnInteraction: false } : false}
                    breakpoints={{
                        640: { slidesPerView: 2.5, spaceBetween: 15 },
                        768: { slidesPerView: 3.5, spaceBetween: 20 },
                        1024: { slidesPerView: 4.5, spaceBetween: 25 },
                        1280: { slidesPerView: 5.9, spaceBetween: 30 },
                    }}
                    className="max-w-7xl mx-auto"
                >
                    {skills.map((item, index) => (
                        <SwiperSlide key={index} className="flex! items-center! justify-center! h-[350px]">
                            {({ isActive }) => (
                                <div className={`items-center rounded-xl h-[320px] w-[350px] transition-all duration-300 flex flex-col justify-center`}>
                                    <div className={cn(`flex flex-col items-center min-w-full! w-full rounded-xl ${isActive
                                        ? "bg-[#008CFF] -z-30 relative justify-center p-4 rounded-2xl! h-[16.875rem] w-[15rem] text-white overflow-hidden "
                                        : "bg-white p-2 h-[12.5rem] justify-between text-neutral-05 scale-90 "
                                        }`)}>
                                        <div className="flex justify-between items-start w-full">
                                            <div className={cn(" p-2 rounded-xl overflow-hidden", isActive ? "bg-white/10" : "bg-")}>
                                                <Image width={100} height={100} src={item.icon} alt={item.name} className="w-10 z-10! h-10 relative object-contain" />
                                                {isActive && (
                                                    <Image width={120} height={120} src={item.icon} alt="" className="absolute -top-6 -left-3 w-24 h-24 opacity-20 blur-[1px] pointer-events-none" />
                                                )}
                                            </div>
                                            <ArrowUpRight className={cn("w-5 h-5", isActive ? "text-white" : "text-black")} />
                                        </div>
                                        <div className="mt-auto mb-4">
                                            <h3 className={cn("font-bold text-2xl tracking-tight", isActive ? "text-white " : "text-neutral-04")}>{item.name}</h3>
                                            <p className={cn("text-sm leading-relaxed", isActive ? "text-blue-50 mt-3" : "text-slate-500")}>{item.description}</p>
                                        </div>
                                        {isActive && item.challengeCount && (
                                            <div className="transition-all duration-300 w-full opacity-100 translate-y-0">
                                                <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-medium border border-white/10">
                                                    {item.challengeCount} Challenges available
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Combined Navigation Buttons */}
                <div className="flex items-center justify-center gap-3 mt-5 md:mt-10 pr-4">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        disabled={isBeginning}
                        className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-md border border-neutral-05/50 bg-white text-gray-400 transition-all",
                            isBeginning ? "opacity-30 cursor-not-allowed grayscale" : "hover:bg-gray-50 active:scale-95"
                        )}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        disabled={isEnd}
                        className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-md bg-[#0080ff] text-white transition-all shadow-sm",
                            isEnd ? "opacity-30 cursor-not-allowed grayscale" : "hover:bg-[#006ee6] active:scale-95"
                        )}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );
}



























// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import { useRef } from "react"
// import { Swiper, SwiperSlide } from "swiper/react"
// import { Autoplay } from "swiper/modules"

// import "swiper/css"
// import { cn } from "@/lib"

// type SliderProps = {
//   autoplay?: boolean
//   loop?: boolean
//   speed?: number
// }

// const skills = [
//   { name: "Java", desc: "Build robust enterprise apps." },
//   { name: "JavaScript", desc: "The language of the web." },
//   { name: "Python", desc: "AI, Data Science, Automation." },
//   { name: "TypeScript", desc: "Type-safe development." },
//   { name: "PHP", desc: "Server side scripting." },
//   { name: "C++", desc: "High performance programming." },
//   { name: "1", desc: "High performance programming." },
//   { name: "2", desc: "High performance programming." },
//   { name: "3", desc: "High performance programming." },
//   { name: "4", desc: "High performance programming." },
//   { name: "5", desc: "High performance programming." },
//   { name: "6", desc: "High performance programming." },
//   { name: "7", desc: "High performance programming." },
//   { name: "8", desc: "High performance programming." }
// ]

// export default function SkillSlider({
//   autoplay = true,
//   loop = true,
//   speed = 600,
// }: SliderProps) {
//   const swiperRef = useRef<any>(null)

//   return (
//     <div className="relative py-20 bg-gray-100">

//       {/* top indicator */}
//       <div className="absolute top-8 left-1/2 -translate-x-1/2 text-blue-500 text-3xl">
//         ▼
//       </div>

//       {/* slider */}
//       <Swiper
//         modules={[Autoplay]}
//         onSwiper={(swiper) => (swiperRef.current = swiper)}
//         slidesPerView={5.9}
//         centeredSlides={true}
//         spaceBetween={0}
//         loop={loop}
//         speed={speed}
//         autoplay={
//           autoplay
//             ? {
//               delay: 2500,
//               disableOnInteraction: false,
//             }
//             : false
//         }
//         breakpoints={{
//           // When window width is >= 320px
//           320: {
//             slidesPerView: 1.5,
//             spaceBetween: 10,
//             centeredSlides: true,
//           },
//           // When window width is >= 640px
//           640: {
//             slidesPerView: 2.5,
//             spaceBetween: 15,
//             centeredSlides: true,
//           },
//           // When window width is >= 768px
//           768: {
//             slidesPerView: 3.5,
//             spaceBetween: 20,
//             centeredSlides: true,
//           },
//           // When window width is >= 1024px
//           1024: {
//             slidesPerView: 4.5,
//             spaceBetween: 25,
//             centeredSlides: true,
//           },
//           // When window width is >= 1280px
//           1280: {
//             slidesPerView: 5.9,
//             spaceBetween: 30,
//             centeredSlides: true,
//           },
//         }}
//         className=" flex! items-center! justify-center! max-w-7xl items-stretch mx-auto"
//       >
//         {skills.map((item, index) => (
//           <SwiperSlide key={index} className="!flex !items-center !justify-center h-[350px]">
//             {({ isActive }) => (
//               <div
//                 className={` items-center borer border-danger rounded-xl h-[300px] w-[250px] transition-all duration-300 flex flex-col justify-center
//                 `}
//               >
//                 <div className={cn(` flex flex-col justify-center items-center min-w-full! w-full rounded-xl ${isActive
//                   ? "bg-blue-500 rounded-2xl! h-[270px] w text-white overflow-hidden shadow-xl"
//                   : "bg-white h-[200px] text-gray-700 scale-90 opacity-70"
//                   }`)}>
//                   <h3 className="font-semibold text-lg">{item.name}</h3>
//                   <p className="text-sm mt-1 text-center">{item.desc}</p>
//                 </div>
//               </div>
//             )}
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* custom navigation */}
//       <div className="flex justify-center gap-4 mt-10">
//         <button
//           onClick={() => swiperRef.current?.slidePrev()}
//           className="px-6 py-2 bg-gray-800 text-white rounded-lg"
//         >
//           Prev
//         </button>

//         <button
//           onClick={() => swiperRef.current?.slideNext()}
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg"
//         >
//           Next
//         </button>
//       </div>

//     </div>
//   )
// }









































// "use client"

// import { Swiper, SwiperSlide } from "swiper/react"
// import { Navigation } from "swiper/modules"

// import "swiper/css"
// import "swiper/css/navigation"

// const skills = [
//   {
//     name: "Java",
//     desc: "Build robust enterprise apps and Android software.",
//     icon: "/icons/java.svg",
//   },
//   {
//     name: "JavaScript",
//     desc: "The language that powers the entire web.",
//     icon: "/icons/js.svg",
//   },
//   {
//     name: "Python",
//     desc: "The power of AI, Data Science, and Automation.",
//     icon: "/icons/python.svg",
//   },
//   {
//     name: "TypeScript",
//     desc: "Scalable and type-safe web development.",
//     icon: "/icons/typescript.svg",
//   },
//   {
//     name: "PHP",
//     desc: "The power of AI, Data Science, and Automation.",
//     icon: "/icons/php.svg",
//   },
//   {
//     name: "C++",
//     desc: "Fast, efficient programming for systems.",
//     icon: "/icons/cpp.svg",
//   },
// ]

// export default function SkillSlider() {
//   return (
//     <div className="w-full py-20 bg-gray-100 relative">

//       {/* arrow indicator */}
//       <div className="absolute top-8 left-1/2 -translate-x-1/2 text-blue-500 text-3xl">
//         ▼
//       </div>

//       <Swiper
//         slidesPerView={6.5}
//         centeredSlides
//         spaceBetween={20}
//         loop
//         navigation
//         modules={[Navigation]}
//         className="max-w-6xl mx-auto"
//       >
//         {skills.map((item, index) => (
//           <SwiperSlide key={index}>
//             {({ isActive }) => (
//               <div
//                 className={`rounded-xl transition-all duration-300 p-6 h-[200px] flex flex-col justify-center
//                 ${
//                   isActive
//                     ? "bg-blue-500 text-white scale-110 shadow-xl"
//                     : "bg-white text-gray-700 scale-90 opacity-70"
//                 }`}
//               >
//                 <img src={item.icon} className="w-10 mb-3" />

//                 <h3 className="font-semibold text-lg">{item.name}</h3>

//                 <p className="text-sm mt-1">{item.desc}</p>

//                 {isActive && (
//                   <span className="mt-3 text-xs bg-white/20 px-3 py-1 rounded-full w-fit">
//                     120+ Challenges available
//                   </span>
//                 )}
//               </div>
//             )}
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   )
// }