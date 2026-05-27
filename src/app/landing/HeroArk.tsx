"use client";

import React, { FC } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { 
  FileCode, Database, Layout, Cpu, Cloud, Globe, 
  Layers, Terminal, Shield, Smartphone, Workflow, Zap 
} from 'lucide-react';
import Image from "next/image";
import { Assets } from "@/constants/assets";
import SecondaryContainer from "@/components/shared/container/SecondaryContainer";
import PrimaryHeader from "@/components/shared/Headers/PrimaryHeader";

const orbitItems = [
  { id: "react", icon: Layout, type: "tech", angle: 30, color: "bg-cyan-100", textColor: "text-cyan-600", label: "React" },
  { id: "node", icon: Terminal, type: "tech", angle: 60, color: "bg-green-100", textColor: "text-green-600", label: "Node" },
  { id: "db", icon: Database, type: "tech", angle: 90, color: "bg-indigo-100", textColor: "text-indigo-600", label: "SQL" },
  { id: "cloud", icon: Cloud, type: "tech", angle: 120, color: "bg-sky-100", textColor: "text-sky-600", label: "Cloud" },
  { id: "css", icon: FileCode, type: "tech", angle: 150, color: "bg-blue-100", textColor: "text-blue-600", label: "CSS" },
  { id: "security", icon: Shield, type: "tech", angle: 180, color: "bg-red-100", textColor: "text-red-600", label: "Auth" },
  { id: "api", icon: Globe, type: "tech", angle: 210, color: "bg-orange-100", textColor: "text-orange-600", label: "API" },
  { id: "mobile", icon: Smartphone, type: "tech", angle: 240, color: "bg-purple-100", textColor: "text-purple-600", label: "App" },
  { id: "perf", icon: Zap, type: "tech", angle: 270, color: "bg-yellow-100", textColor: "text-yellow-600", label: "Perf" },
  { id: "infra", icon: Cpu, type: "tech", angle: 300, color: "bg-slate-100", textColor: "text-slate-600", label: "HW" },
  { id: "stack", icon: Layers, type: "tech", angle: 330, color: "bg-pink-100", textColor: "text-pink-600", label: "Full" },
  { id: "git", icon: Workflow, type: "tech", angle: 350, color: "bg-orange-50", textColor: "text-orange-500", label: "Git" },
];

export default function HeroArc() {
  const orbitDuration = 40; 

  const circleSizeMobile = "w-[600px] h-[600px]"; 
  const circleSizeDesktop = "md:w-[1200px] md:h-[1200px]"; 
  const topOffsetMobile = "top-[60px]";
  const topOffsetDesktop = "md:top-[180px]";
  const containerHeight = "h-[220px] md:h-[400px] -mt-10 md:-mt-40    ";

  return (
  <SecondaryContainer className="py-20 ">

<>




  <div className=' pt-16  bg-white rounded-2xl text-black'>
            <PrimaryHeader             
            

                title={<span className="text-[2.75rem] sm:text-5xl lg:text-[3.375rem] font-semibold  leading-[1.15] tracking-tight">
                    Ready to become a<br />
                    Top 1% Logic Builder?

                </span>}
               
                description={<span>Join 5,000+ developers mastering coding with our AI Thinking<br /> 
                Assistant. Intuition over memorization, always.</span>}
                descriptionColor="text-[#878787]  "
                align="center"
                alignLg="center"
            />
        </div>
   <div className="w-full flex flex-col items-center pt-10  font-sans bg-white  overflow-hidden">
      
      {/* Top UI */}
      <div className="z-20 flex flex-col items-center gap-4 md:gap-6 mb-6 md:mb-8 px-4 w-full">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-5 py-2.5 md:px-6 md:py-3 bg-[#008CFF] hover:bg-blue-50 hover:border-blue-500 border hover:text-neutral-04 text-white text-sm md:text-base font-semibold rounded-lg transition-colors shadow-md shadow-blue-500/20 text-center">
            Get started for Free
          </button>
          <button className="w-full sm:w-auto px-5 py-2.5 md:px-6 md:py-3 bg-white border border-[#008CFF] hover:bg-[#0070F3] hover:text-white   text-neutral-04 text-sm md:text-base font-semibold rounded-lg transition-colors shadow-sm text-center">
            Browse Challenge
          </button>
        </div>
        
   <div className="flex gap-2 mt-1 ">
         <div className="flex items-center gap-1 sm:gap-2 text-[11px] md:text-sm text-gray-600 bg-white px-1 py-1 rounded-xl  border  border-neutral-05 shadow-sm z-20 relative whitespace-nowrap">
          <span className="flex items-center justify-center w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#008CFF] text-white flex-shrink-0">
            <Check size={10} strokeWidth={4} />
          </span>
          <span className="font-medium">Free Forever Plan</span>
          
        </div>
        <div className="flex items-center gap-1 sm:gap-2 text-[11px] md:text-sm text-gray-600 bg-white px-1 py-1 rounded-xl  border  border-neutral-05 shadow-sm z-20 relative whitespace-nowrap">
          <span className="flex items-center justify-center w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500 text-white flex-shrink-0">
            <Check size={10} strokeWidth={4} />
          </span>

          <span className="font-medium">No Credit Card</span>
        </div>
   </div>
      </div>

      {/* Orbital Arc Section */}
      <div className={`relative w-full ${containerHeight} overflow-hidden `}>
        
        {/* Massive Circle Container */}
        <div className={`absolute  left-1/2 -translate-x-1/2 ${circleSizeMobile} ${circleSizeDesktop} ${topOffsetMobile} ${topOffsetDesktop}`}>
          
          {/* --- SET TO EXACTLY 70% --- */}
      <div className="absolute rounded-full pointer-events-none z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] md:w-[85%] md:h-[85%]">
  <Image
    src={Assets.Images.landingPage.EllipseHasantest}
    alt="Inner glow effect"
    width={1200}
    height={1200}
    className="object-contain rounded-full"
    priority
  />
</div>
          

          {/* Outer Border Track */}
          <div className="absolute w-full h-full rounded-full border-4 border-[#F5F8FB] z-10 pointer-events-none" />

          {/* Rotating Items Container */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: orbitDuration, repeat: Infinity, ease: "linear" }}
            className="w-full h-full rounded-full flex items-center justify-center relative z-20"
          >
            {orbitItems.map((item, index) => {
              const angle = (360 / orbitItems.length) * index;
              
              return (
                <OrbitItem key={item.id} angle={angle} duration={orbitDuration}>
                  <HexagonIcon icon={item.icon} color={item.color} textColor={item.textColor} label={item.label} />
                </OrbitItem>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>

</>
  
 
    </SecondaryContainer>
  );
}

// --- Helper Components ---

function OrbitItem({ angle, duration, children }: { angle: number, duration: number, children: React.ReactNode }) {
  const rad = (angle - 90) * (Math.PI / 180);
  const radius = 50; 
  
  // const left = 50 + radius * Math.cos(rad);
  // const top = 50 + radius * Math.sin(rad);
  //for not hidretion error 
const left = (50 + radius * Math.cos(rad)).toFixed(4);
  const top = (50 + radius * Math.sin(rad)).toFixed(4);
  return (
    <div className="absolute w-0 h-0" style={{ left: `${left}%`, top: `${top}%` }}>
      <div className="absolute -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

function HexagonIcon({ icon: Icon, color, textColor, label }: { icon: FC<any>, color?: string, textColor?: string, label?: string }) {
  return (
    <div className="relative cursor-pointer hover:scale-110 transition-transform duration-300 drop-shadow-[0_4px_8px_rgba(56,189,248,0.1)]">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-white flex items-center justify-center shadow-sm" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
        <div className={`w-[36px] h-[36px] md:w-[48px] md:h-[48px] flex items-center justify-center ${color}`} style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
          <div className="flex flex-col items-center justify-center gap-0.5">
            <Icon className={`w-4 h-4 md:w-5 md:h-5 ${textColor}`} strokeWidth={2.5} />
            <span className={`text-[8px] md:text-[9px] font-bold ${textColor}`}>{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}







//TODO:Delet after landing page confirm

// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { Check } from "lucide-react";
// import { 
//   FileCode, 
//   Database, 
//   Layout, 
//   Cpu, 
//   Cloud, 
//   Globe, 
//   Layers, 
//   Terminal, 
//   Shield, 
//   Smartphone, 
//   Workflow, 
//   Zap 
// } from 'lucide-react';

// const orbitItems = [

//   // --- Twelve Lucide Icons ---
//   { id: "react", icon: Layout, angle: 30, color: "bg-cyan-100", textColor: "text-cyan-600", label: "React" },
//   { id: "node", icon: Terminal, angle: 60, color: "bg-green-100", textColor: "text-green-600", label: "Node" },
//   { id: "db", icon: Database, angle: 90, color: "bg-indigo-100", textColor: "text-indigo-600", label: "SQL" },
//   { id: "cloud", icon: Cloud, angle: 120, color: "bg-sky-100", textColor: "text-sky-600", label: "Cloud" },
//   { id: "css", icon: FileCode, angle: 150, color: "bg-blue-100", textColor: "text-blue-600", label: "CSS" },
//   { id: "security", icon: Shield, angle: 180, color: "bg-red-100", textColor: "text-red-600", label: "Auth" },
//   { id: "api", icon: Globe, angle: 210, color: "bg-orange-100", textColor: "text-orange-600", label: "API" },
//   { id: "mobile", icon: Smartphone, angle: 240, color: "bg-purple-100", textColor: "text-purple-600", label: "App" },
//   { id: "perf", icon: Zap, angle: 270, color: "bg-yellow-100", textColor: "text-yellow-600", label: "Perf" },
//   { id: "infra", icon: Cpu, angle: 300, color: "bg-slate-100", textColor: "text-slate-600", label: "HW" },
//   { id: "stack", icon: Layers, angle: 330, color: "bg-pink-100", textColor: "text-pink-600", label: "Full" },
//   { id: "git", icon: Workflow, angle: 350, color: "bg-orange-50", textColor: "text-orange-500", label: "Git" },
// ];

// export default function HeroArc() {
  
//   // --- SPEED CONTROL ---
//   // Lower number = faster spin. Higher number = slower spin.
//   const orbitDuration = 40;   
    
//   const circleSizeMobile = "w-[600px] h-[600px]"; 
//   const circleSizeDesktop = "md:w-[1200px] md:h-[1200px]"; 
//   const topOffsetMobile = "top-[60px]";
//   const topOffsetDesktop = "md:top-[180px]";
//   const containerHeight = "h-[220px] md:h-[400px]";

//   return (
//     <div className="w-full flex flex-col items-center pt-10 md:pt-24 font-sans bg-white overflow-hidden">
      
//       {/* Top UI */}
//       <div className="z-20 flex flex-col items-center gap-4 md:gap-6 mb-6 md:mb-8 px-4 w-full">
//         <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
//           <button className="w-full sm:w-auto px-5 py-2.5 md:px-6 md:py-3 bg-[#0070F3] hover:bg-blue-600 text-white text-sm md:text-base font-semibold rounded-lg transition-colors shadow-md shadow-blue-500/20 text-center">
//             Get started for Free
//           </button>
//           <button className="w-full sm:w-auto px-5 py-2.5 md:px-6 md:py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm md:text-base font-semibold rounded-lg transition-colors shadow-sm text-center">
//             Browse Challenge
//           </button>
//         </div>
        
//         <div className="flex items-center gap-1 sm:gap-2 text-[11px] md:text-sm text-gray-600 bg-white px-3 sm:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 shadow-sm z-20 relative whitespace-nowrap">
//           <span className="flex items-center justify-center w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500 text-white flex-shrink-0">
//             <Check size={10} strokeWidth={4} />
//           </span>
//           <span className="font-medium">Free Forever Plan</span>
//           <span className="text-gray-300 mx-1">•</span>
//           <span className="font-medium">No Credit Card</span>
//         </div>
//       </div>

//       {/* Orbital Arc Section */}
//       <div className={`relative w-full ${containerHeight} overflow-hidden mt-[-10px] md:mt-[-40px]`}>
//         <div className={`absolute left-1/2 -translate-x-1/2 ${circleSizeMobile} ${circleSizeDesktop} ${topOffsetMobile} ${topOffsetDesktop}`}>
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: orbitDuration, repeat: Infinity, ease: "linear" }}
//             className="w-full h-full rounded-full border-[1.5px] border-gray-100 flex items-center justify-center relative shadow-[inset_0_0_80px_rgba(0,112,243,0.03)]"
//           >
//             <div className="absolute w-[85%] h-[85%] border  rounded-full bg-gradient-to-b from-sky-200/40 via-sky-100/10 to-transparent" />

//             {/* --- DYNAMIC SPACING LOGIC --- */}
//             {orbitItems.map((item, index) => {
//               // Automatically space items equally across the 360-degree circle
//               const angle = (360 / orbitItems.length) * index;
              
//               return (
//                 <OrbitItem key={item.id} angle={angle} duration={orbitDuration}>
//                   {item.type === "profile" ? (
//                     <ProfileBubble imgSrc={item.imgSrc} badgeText={item.badgeText} />
//                   ) : (
//                     <HexagonIcon color={item.color} textColor={item.textColor} label={item.label} />
//                   )}
//                 </OrbitItem>
//               );
//             })}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- Helper Components ---

// function OrbitItem({ angle, duration, children }: { angle: number, duration: number, children: React.ReactNode }) {
//   const rad = (angle - 90) * (Math.PI / 180);
//   const radius = 50; 
  
//   const left = 50 + radius * Math.cos(rad);
//   const top = 50 + radius * Math.sin(rad);

//   return (
//     <div className="absolute w-0 h-0" style={{ left: `${left}%`, top: `${top}%` }}>
//       <div className="absolute -translate-x-1/2 -translate-y-1/2">
//         <motion.div
//           animate={{ rotate: -360 }}
//           transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
//         >
//           {children}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// function ProfileBubble({ imgSrc, badgeText }: { imgSrc?: string, badgeText?: string }) {
//   return (
//     <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-300 md:mt-[-20px] mt-[-12px]">
//       <div className="bg-white p-1 md:p-2 rounded-full shadow-xl shadow-blue-900/10 z-10 relative border border-gray-100">
//         <img src={imgSrc} alt="Profile" className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover" />
//         {badgeText && (
//           <div className="absolute bottom-0 right-0 md:bottom-1 md:right-1 w-4 h-4 md:w-6 md:h-6 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white">
//             <span className="text-[7px] md:text-[10px] text-white font-bold">{badgeText}</span>
//           </div>
//         )}
//       </div>
//       <div className="absolute -bottom-1 md:-bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 md:w-5 md:h-5 bg-white rotate-45 z-0 shadow-xl shadow-blue-900/10 border-b border-r border-gray-100"></div>
//     </div>
//   );
// }

// function HexagonIcon({ color, textColor, label }: { color?: string, textColor?: string, label?: string }) {
//   return (
//     <div className="relative cursor-pointer hover:scale-110 transition-transform duration-300 drop-shadow-md">
//       <div className="w-9 h-9 md:w-14 md:h-14 bg-white flex items-center justify-center shadow-sm" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
//         <div className={`w-[26px] h-[26px] md:w-[44px] md:h-[44px] flex items-center justify-center ${color}`} style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
//           <span className={`text-[9px] md:text-sm font-bold ${textColor}`}>{label}</span>
//         </div>
//       </div>
//     </div>
//   );
// }