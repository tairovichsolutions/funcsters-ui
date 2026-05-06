import React from 'react';
import Image from 'next/image';
import { Assets } from "@/constants/assets";
import SecondaryContainer from '@/components/shared/container/SecondaryContainer';
import PrimaryHeader from '@/components/shared/Headers/PrimaryHeader';
import FeaturesMarquee from '@/components/animations/FeaturesMarquee';


const HeroSection = () => {
  return (
    <SecondaryContainer>
      <div className="relative w-full bg-[#f8f9fb] overflow-hidden ">
        <div className="py-2">
          <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-12 md:gap-8">

            {/* Left Column: Content */}
            <div className="flex-1 w-full space-y-5 flex flex-col items-center lg:items-start text-left">

              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-1.5 py-1.5 rounded-full bg-gray-200/60 text-sm">
                <span className="px-2 font-light py-1 text-sm   text-white bg-[#0084ff]   rounded-full">
                  New
                </span>
                <span className="pr-3 text-gray-600  text-sm">
                  Launching new products soon
                </span>
              </div>

       

              <PrimaryHeader
                eyebrowColor="text-orange-500 font-medium"
                title={<span className="text-[2.75rem]  sm:text-5xl lg:text-6xl font-bold  leading-[1.15] tracking-tight">
                  Learn Smarter.<br />
                  Code Better. Grow<br />
                  Faster.
                </span>}
        
                description={<>Take on real coding challenges, sharpen your logic, and build the <br/> skills to level up — one solution at a time.</>}                descriptionColor="text-[#878787] "
                align="center"
                alignLg="left"
              />


              <div className="relative flex w-full max-w-lg overflow-hidden pt-2">
              
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f8f9fb] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f8f9fb] to-transparent z-10 pointer-events-none"></div>


                <div className="flex   cursor-default">
         
                 <FeaturesMarquee speed={35} />
                </div>
              </div>

     
              <div className="pt-4">
                <button className="bg-[#0084ff] hover:bg-blue-600 transition-colors text-white text-base font-semibold px-8 py-3.5 rounded-lg shadow-sm">
                  Get Started
                </button>
              </div>
            </div>


            <div className="flex-1 w-full relative flex justify-center lg:justify-end mt-10 lg:mt-0">
              <div className="relative w-full max-w-lg lg:max-w-xl aspect-square">
                <Image
                  src={Assets.Images.landingPage.hero}
                  alt="Developer coding illustration"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </SecondaryContainer>);
};

export default HeroSection;