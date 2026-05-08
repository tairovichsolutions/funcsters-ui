
import { StatCard } from '@/components/animations/AnimatedCounter';
import SecondaryContainer from '@/components/shared/container/SecondaryContainer';
import PrimaryHeader from '@/components/shared/Headers/PrimaryHeader';
import { Assets } from '@/constants/assets';
import { Brain, NotebookPen, Sparkle } from 'lucide-react';
import type { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
interface LogicFeature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ThinkingAssistantPage: NextPage = () => {
const logicFeatures: LogicFeature[] = [
  {
    id: 1,
    icon: <Brain className="w-8 h-8 text-neutral-800" strokeWidth={1.5} />,
    title: 'Problem Intuition',
    description: 'We use real-world analogies (like a board game) to simplify complex concepts before you code.',
  },
  {
    id: 2,
    icon: <NotebookPen className="w-8 h-8 text-neutral-800" strokeWidth={1.5} />,
    title: 'Structural Skeleton',
    description: 'Get the architectural plan (pseudocode) so you can focus on implementation skills yourself.',
  },
  {
    id: 3,
    icon: <Sparkle className="w-8 h-8 text-neutral-800" strokeWidth={1.5} />,
    title: 'Guided Implementation',
    description: 'Step-by-step logic hints that trigger only when you need them. No more copy-pasting!',
  },
];
 const statsData = [
    { target: 10, suffix: 'K+', label: 'LOGICS SOLVED' },
    { target: 99, suffix: '%', label: 'CODE INTUITION' },
    { target: 24, suffix: '/7', label: 'ACTIVE ASSISTANT' },
  ];

  return (
    <SecondaryContainer className='py-5'>
        <div className='py-10   text-black'>

          
                  <PrimaryHeader
                      eyebrow="The Game Changer"                   
                      title={<span className="text-[2.75rem] sm:text-5xl lg:text-[3.375rem] font-semibold  leading-[1.15] tracking-tight">
                          Stuck? Meet Your<br />
                          Thinking Assistant.      
                      </span>}                  
                      description={<span>Unlike other platforms, we don&apos;t just give you the answer.<br /> We guide your brain to find it.</span>}
                      descriptionColor="text-[#878787] "
                      align="center"
                      alignLg="center"
                  />
              </div>

      <div className=" bg-[#F4F6F8]  text-neutral-900  antialiased">
    
        <main className="  grid grid-cols-1 lg:grid-cols-2 items-stretch  lg:gap-16">
          {/* Left Side: Product Interface */}
          <div className="relative mb-12 lg:mb-0">
            {/* The Background Watermark */}
            <div className="absolute -left-24 z-0 w-58 h-58 -top-25   opacity-8 -bottom-16 -right-16  ">
              <Image 
                src={Assets.Images.landingPage.reactShadowIcon2} // Replace with your watermark image path
                alt="Background Watermark"
                width={232}
                height={232}
                className="pointer-events-none object-contain animate-spin animation-duration-[5s]"
              />
            </div>

            {/* Main Interface Component */}
            <div className="bg-whit rounded-2xl   relative z-10 w-full max-w-[650px] mx-auto lg:mx-0 border border-neutral-100/50">
              
              {/* Product Logo / Top Corner Status */}
              <div className="absolute    -top-4 -left-4 md:-top-8 md:-left-9 bg-white  rounded-full p-2 shadow-xl   items-center justify-center">
                <Image 
                  src={Assets.Images.landingPage.ReactIcon} // Replace with your specific React-like icon
                  alt="Assistant Logo"
                  width={60}
                  height={60}
                  className="object-scale-down"
                />
              </div>          
       

              {/* CENTER CONTENT: Replaced entirely with the provided Image block */}
              <div className="w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]  ">
                <Image 
                  src={Assets.Images.landingPage.ThinkingAsisstanceBanner}
                  alt="AI Assistant Interaction Area"
                  width={550} 
                  height={450}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

            </div>

           <div className="bg-[#F4F6F8] pt-12   flex items-center justify-evenly font-sans antialiased">
             <div className="w-full max-w-4xl mx-auto flex flex-wrap  justify-center gap-6">
               {statsData.map((stat, index) => (
                 <StatCard
                   key={index}
                   index={index}
                   target={stat.target}
                   suffix={stat.suffix}
                   label={stat.label}
                 />
               ))}
             </div>
           </div>
          </div>

          {/* Right Side: Features and CTA */}
          <div className="flex flex-col  justify-between  md:gap-12 ">
            {/* Logic Features List */}
        <div className='flex flex-col gap-10'>
    {logicFeatures.map(feature => (
        <div key={feature.id} className="flex gap-6 items-start group cursor-pointer">
          {/* Added hover:bg-[#D6DBE0] and transition classes here */}
          <div className="flex-shrink-0 bg-[#E8EBED] hover:bg-[#D6DBE0] transition-colors duration-300 ease-in-out border-neutral-200 border rounded-2xl w-16 h-16 flex items-center justify-center p-3">
            {feature.icon}
          </div>
          
          <div>
            <h4 className="text-xl font-bold text-neutral-800 mb-2">{feature.title}</h4>
            <p className="text-neutral-500 text-base md:text-[17px] leading-relaxed pr-4">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
        </div>

            {/* XP and CTA */}
            <div className="flex flex-col  h-full items-center lg:items-start my-5  md:my-0  gap-6 ">
              <div className="bg-white rounded-xl flex items-center gap-4 pl-4 pr-8 py-3.5 shadow-lg border border-neutral-100 w-full max-w-60">
                <div className="bg-[#FFC107] text-black w-10 h-10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                </div>
                <span className="text-lg font-bold text-neutral-900 tracking-wide">+50 LOGIC XP</span>
              </div>
              
              <button className="bg-[#0084ff] hover:bg-blue-600 transition-colors text-white text-base font-semibold px-2 md:px-8 py-3.5 rounded-lg shadow-sm w-max ">
                Experience the Thinking Assistant – for Free
              </button>
            </div>
          </div>
        </main>

        {/* Footer Statistics */}
     
      </div>
    </SecondaryContainer>
  );
};

export default ThinkingAssistantPage;












// import React from 'react';
// import type { NextPage } from 'next';
// import Head from 'next/head';
// import Image from 'next/image';

// interface LogicFeature {
//   id: number;
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }

// const ThinkingAssistantPage: NextPage = () => {
//   const logicFeatures: LogicFeature[] = [
//     {
//       id: 1,
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-800">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v3m0 0h.008m-.008 0H12m6.008 0H18m-.008 0H18m0 0H18.008m-12.016 0H6m-.008 0H6.008M6.008 3H6m0 0H6.008M6.008 3h0m11.984 0h0m0 0H18m-.008 0h.008M18.008 3H18.008zM15 9.75v-3a3 3 0 116 0v3m-6 0a3.375 3.375 0 011.836-3.007M21 9.75V12a3 3 0 01-3 3H6.008A3.001 3.001 0 013 12.016V9.75c0-1.657 1.343-3 3-3a3.375 3.375 0 011.836 3.007m0 0A3.375 3.375 0 0115 9.75zm-6 3V12m0 0a3 3 0 116 0v.75m-6 0H6.008M15 12.75H18" />
//         </svg>
//       ),
//       title: 'Problem Intuition',
//       description: 'We use real-world analogies (like a board game) to simplify complex concepts before you code.',
//     },
//     {
//       id: 2,
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-800">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
//         </svg>
//       ),
//       title: 'Structural Skeleton',
//       description: 'Get the architectural plan (pseudocode) so you can focus on implementation skills yourself.',
//     },
//     {
//       id: 3,
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-800">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h.188c.304 0 .584.146.758.391a2.25 2.25 0 110-2.782A.896.896 0 004.125 9H3.75c-.207 0-.414.1-.53.277L2 12m0 0l-1.47 1.47M2 12h1m6.008 6a3.001 3.001 0 01-3 3H6.008A3.001 3.001 0 013 18.008V12m0 0h12.008M15.008 12.016V18a3 3 0 01-3 3H6.008A3.001 3.001 0 013 18.008V12m0 0h12.008m1.5 6.008V18m0 0h1.5m-1.5 0h.008m-.008 0H18m0 0v-6a3 3 0 00-3-3m0 0H6.008A3.001 3.001 0 003 12.016v.75m12 0h3M6.008 3h0m11.984 0h0m0 0H18m-.008 0h.008M18.008 3H18.008z" />
//         </svg>
//       ),
//       title: 'Guided Implementation',
//       description: 'Step-by-step logic hints that trigger only when you need them. No more copy-pasting!',
//     },
//   ];

//   const suggestedPrompts: string[] = [
//     'Help me understand the logic behind this problem',
//     'What should I consider before coding?',
//     'Can you guide my reasoning step-by-step?',
//     'How should I approach this without brute force?',
//   ];

//   return (
//     <>
//       <Head>
//         <title>Thinking Assistant | We guide your brain to find it. | pixel perfect</title>
//       </Head>

//       <div className="min-h-screen bg-[#F0F2F6] font-sans text-neutral-900 p-8 md:p-12 lg:p-16 antialiased">
//         <header className="mb-16 text-center max-w-xl mx-auto">
//           <p className="text-neutral-500 text-base md:text-lg mb-2">Unlike other platforms, we don't just give you the answer.</p>
//           <p className="text-neutral-800 text-lg md:text-xl font-medium">We guide your brain to find it.</p>
//         </header>

//         <main className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-start">
//           {/* Left Side: Product Interface with React Background */}
//           <div className="relative mb-12 lg:mb-0">
//             {/* The React-style background watermark */}
//             <div className="absolute -left-12 -top-12 -bottom-12 -right-12 z-0 opacity-[0.05] flex items-center justify-center">
//               <Image 
//                 src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" 
//                 alt="React Icon Watermark"
//                 width={700}
//                 height={700}
//                 className="pointer-events-none"
//               />
//             </div>

//             {/* Main Interface Component */}
//             <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-neutral-200/50 relative z-10 w-full max-w-[650px] mx-auto lg:mx-0">
//               {/* Product Logo / Status */}
//               <div className="absolute -top-10 -left-10 bg-white border-2 border-[#1B95E0] rounded-full p-6 shadow-xl w-24 h-24 flex items-center justify-center">
//                 <Image 
//                   src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" 
//                   alt="Assistant Logo"
//                   width={60}
//                   height={60}
//                 />
//               </div>

//               {/* Top Navigation Bar inside the product interface */}
//               <div className="flex items-center justify-between mb-10 pb-4 border-b border-neutral-100">
//                 <div className="flex gap-4">
//                   <span className="text-sm font-medium text-[#1B95E0]">Problem Detail</span>
//                   <span className="text-sm text-neutral-600">Community Solutions</span>
//                 </div>
//                 <button className="bg-[#1B95E0] text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm hover:bg-sky-600 transition">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.364 6.364l-.707-.707M6.364 17.636l.707-.707M17.636 6.364l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
//                   </svg>
//                   Thinking Assistant
//                 </button>
//               </div>

//               {/* Center Content of the Interface */}
//               <div className="text-center mb-10 flex flex-col items-center gap-6">
//                 <Image 
//                   src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" 
//                   alt="Assistant Icon"
//                   width={50}
//                   height={50}
//                 />
//                 <div>
//                   <h3 className="text-xl md:text-2xl font-bold text-neutral-800 leading-tight">AI that strengthens how you think</h3>
//                   <p className="text-xl md:text-2xl font-semibold text-neutral-800">Not what you copy</p>
//                 </div>
//                 <p className="text-neutral-600 text-sm">You're working on "Two Sum". Let's think it through</p>
//               </div>

//               {/* Chat Input */}
//               <div className="relative mb-8">
//                 <input 
//                   type="text" 
//                   placeholder="Ask Anything" 
//                   className="w-full border border-neutral-200 rounded-full py-4 px-6 text-sm bg-neutral-50 shadow-inner focus:ring-2 focus:ring-[#1B95E0] focus:border-transparent outline-none transition"
//                 />
//                 <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-neutral-900 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-neutral-800 transition">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
//                   </svg>
//                 </button>
//               </div>

//               {/* Suggested Prompts List */}
//               <div className="space-y-3">
//                 {suggestedPrompts.map((prompt, index) => (
//                   <button key={index} className="flex w-full items-center gap-4 text-left group">
//                     <div className="flex-1 text-sm border border-neutral-200 rounded-full px-5 py-3 text-neutral-600 bg-neutral-50 group-hover:bg-neutral-100 transition">
//                       {prompt}
//                     </div>
//                     <div className="w-10 h-10 flex items-center justify-center">
//                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
//                         </svg>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Side: Features and CTA */}
//           <div className="flex flex-col gap-10 md:gap-12 lg:pt-10">
//             {/* Logic Features List */}
//             {logicFeatures.map(feature => (
//               <div key={feature.id} className="flex gap-6 items-start">
//                 <div className="flex-shrink-0 bg-neutral-100 rounded-2xl w-16 h-16 flex items-center justify-center p-3.5 border border-neutral-200">
//                   {feature.icon}
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-bold text-neutral-800 mb-2">{feature.title}</h4>
//                   <p className="text-neutral-600 text-base md:text-lg leading-relaxed">{feature.description}</p>
//                 </div>
//               </div>
//             ))}

//             {/* XP and CTA */}
//             <div className="flex flex-col md:flex-row md:items-center gap-6 mt-6">
//               <div className="bg-white rounded-full flex items-center gap-4 pl-4 pr-10 py-4 shadow-xl shadow-neutral-200/50 w-full max-w-sm md:max-w-xs md:mr-4">
//                 <div className="bg-[#FFC900] text-black w-12 h-12 rounded-full flex items-center justify-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
//                       <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
//                     </svg>
//                 </div>
//                 <span className="text-lg font-extrabold text-neutral-900">+50 LOGIC XP</span>
//               </div>
              
//               <button className="flex-grow bg-[#1B95E0] text-white text-lg font-semibold py-5 px-10 rounded-full shadow-lg hover:bg-sky-600 transition flex items-center justify-center gap-2">
//                 Experience the Thinking Assistant – for Free
//               </button>
//             </div>
//           </div>
//         </main>

//         {/* Footer Statistics */}
//         <footer className="mt-24 lg:mt-32 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-white rounded-2xl p-8 lg:p-12 shadow-inner border border-neutral-100">
//           <div className="space-y-1">
//             <p className="text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight">10K+</p>
//             <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">LOGICS SOLVED</p>
//           </div>
//           <div className="space-y-1 border-t md:border-t-0 md:border-x border-neutral-100 pt-8 md:pt-0">
//             <p className="text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight">99%</p>
//             <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">CODE INTUITION</p>
//           </div>
//           <div className="space-y-1 border-t md:border-t-0 border-neutral-100 pt-8 md:pt-0">
//             <p className="text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight">24/7</p>
//             <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">ACTIVE ASSISTANT</p>
//           </div>
//         </footer>
//       </div>
//     </>
//   );
// };

// export default ThinkingAssistantPage;