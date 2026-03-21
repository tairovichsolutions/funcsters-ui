"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Assets } from "@/constants/assets";
import SecondaryContainer from '@/components/shared/container/SecondaryContainer';
import PrimaryHeader from '@/components/shared/Headers/PrimaryHeader';

import Faq from '@/components/shared/accordian/Faq';
import { Handshake, LaptopMinimalCheck, Sprout, SquareCode } from 'lucide-react';



const FAQ_DATA = [
    {
        icon: SquareCode,
        question: "Practical Coding Made Simple!",
        answer: "Take on real coding challenges, sharpen your logic, and build the skills to level up — one solution at a time.",
        image: Assets.Images.landingPage.Handcodingcuate1
    },
    {
        icon: Handshake,
        question: "Motivation Through Progress & Community!",
        answer: "Stay inspired by connecting with a global network of developers. Share solutions, get feedback, and celebrate every milestone together.",
        // image: Assets.Images.landingPage.Progressoverviewcuate1
        image: Assets.Images.landingPage.faqBanner
    },
    {
        icon: Sprout,
        question: "Personalized Learning That Grows With You!",
        answer: "Our adaptive curriculum adjusts to your pace, ensuring you master the basics before tackling complex architectural patterns and advanced logic.",
        // image: Assets.Images.landingPage.personalgrowthcuate1
         image: Assets.Images.landingPage.Handcodingcuate1
    },
    {
        icon: LaptopMinimalCheck,
        question: "Real-World Preparation for Career Success!",
        answer: "Go beyond syntax. Learn how to build production-ready applications, manage state efficiently, and ace technical interviews with confidence.",
        // image: Assets.Images.landingPage.Careerprogresscuate1
        image: Assets.Images.landingPage.faqBanner
    }
];


const LearnFasterSection = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const categories = Object.keys(FAQ_DATA);
    const [activeCategory, setActiveCategory] = useState("General");
    console.log({ activeCategory });
    return (
        <SecondaryContainer>

            <>

                <div className='flex lg:flex-row flex-col justify-between'>
                    <div className='pt-10'>
                    <PrimaryHeader
                        eyebrow="Core Features"
                        eyebrowColor="text-orange-500 font-medium"

                        title={<span className="text-[2.75rem] sm:text-5xl lg:text-[3.375rem] font-semibold  leading-[1.15] tracking-tight">
                            Learn Faster. Code <br className='hidden lg:block' />
                            <pre></pre>Smarter.
                        </span>}
                        align="center"
                        alignLg="left"
                    />
                </div>
                <div className="flex flex-col items-center lg:items-start justify-evenly pt-10 ] ">
                    {/* Subtext with specific gray and line height */}
                    <p className="text-neutral-05 text-lg leading-[1.4] max-w-[600px] mb-12 tracking-tight">
                        Take on real coding challenges, sharpen your logic, and build
                        the skills to level up — one solution at a time.
                    </p>

                    {/* The "Pixel Perfect" Blue Button */}
                    <button className="bg-[#0084ff] hover:bg-blue-600 transition-colors text-white text-base font-semibold px-8 py-3.5 rounded-lg shadow-sm">
                        Start upgrading your coding skill
                    </button>
                </div>
                </div>
                <div className="relative w-full  bg-[#f8f9fb] ">

                    <div className="flex flex-col min-h-128  lg:flex-row items-center gap-2 lg:gap-8">





                        <div className="basis-1/2    flex flex-col items-end text-left">

                            <div key={activeCategory} className="py-5 md:py-8 flyIn">
                                <Faq
                                    isRotateIcon={false}
                                    items={FAQ_DATA}
                                    key={activeCategory}
                                    animate={true}
                                    preOpenStrategy="first"
                                    transitionMs={300}
                                    setActiveIndex={setActiveIndex}
                                />
                            </div>
                        </div>
                        <div className="basis-1/2  relative flex justify-center lg:justify-end mt-10 lg:mt-0">
                            <div className="relative flex justify-end items-center  w-full max-w-lg lg:max-w-xl ">
                                <Image
                                    src={FAQ_DATA[activeIndex].image}
                                    alt="Developer coding illustration"
                                    width={800}
                                    height={800}
                                    className="object-contain    w-full "
                                    priority
                                />
                            </div>
                        </div>


                    </div>
                </div>

            </>


        </SecondaryContainer >);

};

export default LearnFasterSection;