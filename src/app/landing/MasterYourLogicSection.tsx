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
        
          {/* --- LEFT FLOATING ICON --- */}
          {/* Changed to: left-0 -translate-x-1/2 */}
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

          {/* --- CENTRAL IMAGE --- */}
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



// import React from 'react';
// import { 
//   Search, 
//   Grid, 
//   List, 
//   CheckCircle2, 
//   Clock, 
//   Zap, 
//   Network, 
//   BrainCircuit,
//   ChevronDown
// } from 'lucide-react';

// export default function MasterYourLogicSection() {
//   const challenges = [
//     {
//       id: 1,
//       title: 'Two Sum',
//       summary: 'Given an array of integers nums and an integer ta...',
//       difficulty: 'Easy',
//       tags: ['Arrays', 'Hash Table'],
//       status: 'Complete',
//     },
//     {
//       id: 2,
//       title: 'Path Sum',
//       summary: 'Given an array of integers nums and an integer ta...',
//       difficulty: 'Hard',
//       tags: ['Arrays', 'Hash Table'],
//       status: 'In Progress',
//     },
//     {
//       id: 3,
//       title: 'Longest Palindrom',
//       summary: 'Given an array of integers nums and an integer ta...',
//       difficulty: 'Medium',
//       tags: ['Arrays', 'Hash Table'],
//       status: 'In Progress',
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
      
//       {/* Main Wrapper - set to relative to contain absolute floating icons */}
//       <div className="relative w-full max-w-5xl">
        
//         {/* --- FLOATING ICONS --- */}
        
//         {/* Left Floating Icon (+450XP) */}
//         <div className="absolute -left-16 top-24 bg-white border border-blue-200 rounded-md shadow-sm p-3 flex flex-col items-center justify-center z-10 w-16">
//           <Zap className="w-5 h-5 text-gray-700 mb-1" />
//           <span className="text-[10px] font-bold text-gray-700">+450XP</span>
//         </div>

//         {/* Right Floating Icon Top (Recursion Tree) */}
//         <div className="absolute -right-16 -top-4 bg-white border border-blue-200 rounded-md shadow-sm p-3 flex flex-col items-center justify-center z-10 w-20">
//           <Network className="w-5 h-5 text-gray-600 mb-1" />
//           <span className="text-[9px] font-medium text-gray-600 text-center leading-tight">Recursion Tree</span>
//         </div>

//         {/* Right Floating Icon Middle (Brain Circuit) */}
//         <div className="absolute -right-14 top-1/2 -translate-y-1/2 bg-white border border-blue-200 rounded-md shadow-sm p-3 flex items-center justify-center z-10">
//           <BrainCircuit className="w-6 h-6 text-gray-600" />
//         </div>

//         {/* --- MAIN CARD --- */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
          
//           {/* Top Bar / Filters */}
//           <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
//             {/* Search */}
//             <div className="relative w-full max-w-sm">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input 
//                 type="text" 
//                 placeholder="Search challenges..." 
//                 className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//               />
//             </div>

//             {/* Dropdowns & Toggles */}
//             <div className="flex items-center gap-3">
//               <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
//                 All Difficulty <ChevronDown className="w-4 h-4 text-gray-400" />
//               </button>
//               <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
//                 Tags <ChevronDown className="w-4 h-4 text-gray-400" />
//               </button>
//               <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
//                 Status <ChevronDown className="w-4 h-4 text-gray-400" />
//               </button>
              
//               <div className="flex items-center ml-2 bg-gray-50 rounded-md border border-gray-200 p-0.5">
//                 <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded">
//                   <Grid className="w-4 h-4" />
//                 </button>
//                 <button className="p-1.5 bg-blue-500 text-white rounded shadow-sm">
//                   <List className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Table Area */}
//           <div className="p-6">
//             <div className="w-full text-left border-collapse">
//               {/* Table Header */}
//               <div className="grid grid-cols-12 gap-4 pb-4 text-xs font-semibold text-gray-400 border-b border-gray-50 mb-2 px-4">
//                 <div className="col-span-2">Title</div>
//                 <div className="col-span-4">Summary</div>
//                 <div className="col-span-2">Difficulty</div>
//                 <div className="col-span-2">Tags</div>
//                 <div className="col-span-2">Status</div>
//               </div>

//               {/* Table Body */}
//               <div className="space-y-2">
//                 {challenges.map((challenge) => (
//                   <div key={challenge.id} className="grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
//                     <div className="col-span-2 text-sm font-medium text-gray-800">
//                       {challenge.title}
//                     </div>
//                     <div className="col-span-4 text-xs text-gray-400 truncate pr-4">
//                       {challenge.summary}
//                     </div>
//                     <div className="col-span-2">
//                       <span className={`px-3 py-1 text-[11px] font-medium rounded-full ${
//                         challenge.difficulty === 'Easy' ? 'bg-green-100/50 text-green-600 border border-green-100' :
//                         challenge.difficulty === 'Medium' ? 'bg-amber-100/50 text-amber-600 border border-amber-100' :
//                         'bg-red-100/50 text-red-500 border border-red-100'
//                       }`}>
//                         {challenge.difficulty}
//                       </span>
//                     </div>
//                     <div className="col-span-2 flex gap-2">
//                       {challenge.tags.map(tag => (
//                         <span key={tag} className="px-2 py-1 text-[10px] font-medium text-blue-600 bg-blue-50 rounded">
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                     <div className="col-span-2 flex items-center text-xs font-medium">
//                       {challenge.status === 'Complete' ? (
//                         <div className="flex items-center text-green-600 gap-1.5">
//                           <CheckCircle2 className="w-4 h-4" />
//                           <span>Complete</span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center text-amber-500 gap-1.5">
//                           <Clock className="w-4 h-4" />
//                           <span>In Progress</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }