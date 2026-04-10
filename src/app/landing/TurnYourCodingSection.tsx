import { Flame, Star, LineChart } from 'lucide-react';

import React from 'react';
import type { NextPage } from 'next';

import Image from 'next/image';
import { Assets } from '@/constants/assets';
import SecondaryContainer from '@/components/shared/container/SecondaryContainer';

import PrimaryHeader from '@/components/shared/Headers/PrimaryHeader';

interface LogicFeature {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
}

const TurnYourCodingSection: NextPage = () => {

    // Make sure your LogicFeature type aligns with this structure
    const logicFeatures: LogicFeature[] = [
        {
            id: 1,
            icon: <Flame className="w-8 h-8 text-neutral-800" strokeWidth={1.5} />,
            title: 'Keep the Streak Alive',
            description: 'Build a daily coding habit that sticks. Visualize your progress with our interactive activity calendar and never break the chain.',
        },
        {
            id: 2,
            icon: <Star className="w-8 h-8 text-neutral-800" strokeWidth={1.5} />,
            title: 'Earn XP & Level Up',
            description: 'Every problem solved earns you XP. Track your growth and see where you stand among the global community of top developers.',
        },
        {
            id: 3,
            icon: <LineChart className="w-8 h-8 text-neutral-800" strokeWidth={1.5} />,
            title: 'Visual Progress',
            description: "See your stats at a glance. Know exactly how many Easy, Medium, and Hard problems you've conquered in one visual dashboard.",
        },
    ];

    return (
        <SecondaryContainer className='py-5'>
            <div className='py-4 md:py-10   text-black'>
                <PrimaryHeader
                    eyebrow="The Game Changer"
                    eyebrowColor="text-orange-500 font-medium"

                    title={<span className="text-[2.75rem] sm:text-5xl lg:text-[3.375rem] font-semibold leading-[1.15] tracking-tight">
                        Turn your Coding Grind<br />
                        into a Game.

                    </span>}
                    titleColor="text-white"
                    description={<span>Take on real coding challenges, sharpen your logic, and build<br />the skills to  level up — one solution at a time.</span>}
                    descriptionColor="text-[#878787] "
                    align="center"
                    alignLg="center"
                />
            </div>

            <div className=" bg-[#F4F6F8]  text-neutral-900  antialiased">

                <main className="  grid grid-cols-1 lg:grid-cols-2 items-stretch  ">
                    {/* Left Side: Product Interface */}
                    <div className=" mb-12 lg:mb-0">
                        




                            <div className=" w-full relative h-116   md:col-span-2 rounded-[2.5rem] overflow-hidden ">
                                <Image
                                    src={Assets.Images.landingPage.banner5}
                                    alt="Activities Calendar Image"
                                    fill
                                    className="object-contain   "
                                    sizes="100vw"
                                />
                            </div>




                    </div>

                    {/* Right Side: Features and CTA */}
                    <div className="flex flex-col          ">
                        {/* Logic Features List */}
                        <div className='flex flex-col justify-between gap-8 md:gap-10 lg:gap-0  h-full '>
                            {logicFeatures.map(feature => (
                                <div key={feature.id} className="flex gap-6 items-start">
                                    <div className="flex-shrink-0 bg-[#E8EBED] border-neutral-05 border rounded-2xl w-16 h-16 flex items-center justify-center p-3 ">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-neutral-800 mb-2">{feature.title}</h4>
                                        <p className="text-neutral-500 text-base md:text-[17px] leading-relaxed pr-4">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </main>

                <div className='flex justify-center items-center mt-6 lg:mt-12'>
                    <button className="bg-[#0084ff] mx-auto hover:bg-blue-600 transition-colors text-white text-base font-semibold px-2 md:px-8 py-3.5 rounded-lg shadow-sm w-max ">
                        Experience the Thinking Assistant – for Free
                    </button>
                </div>

            </div>
        </SecondaryContainer>
    );
};

export default TurnYourCodingSection;