import React from 'react';
import Image from 'next/image'; 
import { Zap, Network, BrainCircuit } from 'lucide-react';
import { Assets } from '@/constants/assets';
import SecondaryContainer from '@/components/shared/container/SecondaryContainer';
import PrimaryHeader from '@/components/shared/Headers/PrimaryHeader';
const featuresData = [
  {
    id: 'hand-picked',
    title: 'Hand-Picked Problems',
    description: 'Focused on crucial interview patterns, not random code snippets or outdated puzzles.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
  },
  {
    id: 'progress-tracking',
    title: 'Smart Progress Tracking',
    description: 'Every submission is tracked, earning XP and building streaks to keep you motivated.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>
      </svg>
    ),
  },
  {
    id: 'assistant-access',
    title: 'Direct Assistant Access',
    description: 'Get logic hints and intuition for every problem without spoiling the final answer.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    ),
  },
];
export default function MasterYourLogicSection() {
  return (
    <SecondaryContainer>
      <>
              <div className='flex lg:flex-row flex-col my-15  justify-between'>
                          <div className='pt-10'>
                          <PrimaryHeader
                              eyebrow="Core Features"
                              eyebrowColor="text-orange-500 font-medium"
      
                              title={<span className="text-[2.75rem] sm:text-5xl lg:text-[3.375rem] font-semibold  leading-[1.15] tracking-tight">
                                  Master Your Logic with  <br className='hidden lg:block' />
                                  <pre></pre>500+ Curated Challenges.
                              </span>}
                              align="center"
                              alignLg="left"
                          />
                      </div>
                      <div className="flex flex-col lg:max-w-sm items-center lg:items-start justify-evenly pt-10 ] ">
                          {/* Subtext with specific gray and line height */}
                          <p className="text-neutral-05 text-lg leading-[1.4] max-w-[600px] mb-12 tracking-tight">
                              Take on real coding challenges, sharpen your logic, and build the skills to  level up — one solution at a time.
                          </p>
      
                          {/* The "Pixel Perfect" Blue Button */}
                          <button className="bg-[#0084ff] hover:bg-blue-600 transition-colors text-white text-base font-semibold px-8 py-3.5 rounded-lg shadow-sm">
                             Explore ALL 500+ challenge
                          </button>
                      </div>
                      </div>
                          <div className=" bg-slate-50 max-w-full flex items-center justify-center ">
      
      
        <div className="relative w-full ">
        
   
          <div className="absolute left-10   2xl:left-0 top-24 -translate-x-1/2 float-icon-1 bg-white border border-blue-500 hidden lg:flex rounded-md shadow-sm p-3  flex-col items-center justify-center z-10 w-16 float-icon-1">
            <Zap className="w-5 h-5 text-gray-700 mb-1" />
            <span className="text-[10px] font-bold text-gray-700">+450XP</span>
          </div>


          <div className="absolute right-14 2xl:right-0  -top-4 translate-x-1/2  bg-white border border-blue-500 hidden lg:flex rounded-md shadow-sm  p-2  flex-col items-start justify-center z-10 w-25 float-icon-2">
            <Network className="w-5 h-5 text-gray-600 mb-1" />
            <span className="text-[9px] font-medium text-gray-600 text-center leading-tight">Recursion Tree</span>
          </div>

          <div className="absolute right-10   2xl:right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-white border border-blue-500 hidden lg:flex rounded-md shadow-sm p-3  items-center justify-center z-10 float-icon-3">
            <BrainCircuit className="w-6 h-6 text-gray-600" />
          </div>

          <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative z-0">
            <Image 
              src={Assets.Images.landingPage.banner4}
              alt="Dashboard Table" 
              width={2000} 
              height={600} 
              className="w-full h-auto object-contain block"
              priority 
            />
          </div>

        </div>
      </div>

      <section className=" bg-[#f5f8fb] flex items-center justify-center py-6 md:py-12 ">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full ">
        {featuresData.map((feature) => (
          <div 
            key={feature.id} 
            className="bg-white rounded-xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-6 border border-gray-100 flex flex-col gap-3 transition-transform hover:-translate-y-1 hover:shadow-md"
          >
       
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded bg-gray-100 text-gray-600 shrink-0">
                {feature.icon}
              </div>
              <h3 className="font-medium text-neutral-04 text-lg leading-tight">
                {feature.title}
              </h3>
            </div>
            
    
            <p className="text-[13px] text-neutral-05 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
      </>
  
    </SecondaryContainer>
  );
}

