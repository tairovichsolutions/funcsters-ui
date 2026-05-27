/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Iconify, Modal } from "@/components";
import { Assets } from "@/constants/assets";
import Image from "next/image";

// 1. ShareIcon updated to match the outline, dark transparent style
const ShareIcon = ({ name, onClick }: { name: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="border border-[#005092] text-[#008CFF] bg-transparent hover:bg-[#00509233] size-10 rounded-full flex justify-center items-center transition-colors"
  >
    <Iconify iconName={name} />
  </button>
);

export const SolutionSubmittedModal = ({
  open,
  onClose,
  xpCount,
}: any) => {

  // 2. Setup the URL and Text to share
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `I just earned ${xpCount} XP by solving a challenge! 🚀`;

  // 3. The combined handleShare function
  const handleFacebookShare = () => {
    const url = encodeURIComponent("https://funcsters-ui.vercel.app/challenges/palindrome-string/detail");
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

    // Open in a new tab
    window.open(shareUrl, "_blank");
  };

  const shareIcons = [
    "iconoir:facebook",
    "iconoir:twitter",
    "basil:linkedin-outline",
    "solar:link-broken",
  ];

  return (
    <Modal
      ClossBtnIconClass="size-4!"
      ClossBtnClass="bg-white border border-[#F0F0F0] dark:border-0 hover:bg-white dark:hover:bg-[#2A2B31] dark:bg-[#2A2B31] mr-2 text-[#008CFF] top-4 right-4! size-8 flex items-center justify-center rounded-full transition-colors"
      open={open}
      onClose={onClose}
      contentClass={'px-0 py-0'}
      className="max-w-[430px]"
      
    >
      {/* Main Dark Theme Container */}
      <div className="relative dark:bg-[#181A1D]    rounded-2xl w-full  mx-auto overflow-hidden p-2 ">
        
        {/* Subtle Green Top Glow Behind Graphic */}
    
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* Main Celebration Asset */}
          <div className="flex w-full  justify-center items-center mb-6">
            <img
              src={'https://i.ibb.co.com/fzs7TFBz/Frame-2147226405.png'}
              alt="Solution Submitted"
              className="w-full dark:block hidden h-auto object-fill"
            />
            <img
              src={'https://i.ibb.co.com/4nfKPCGw/Frame-2147226405-1.png'}
              alt="Solution Submitted"
              className="w-full h-auto dark:hidden object-fill"
            />
          </div>

          <h4 className="text-[28px] leading-none font-bold text-neutral-01 dark:text-white text-center mb-4">
            Solution Submitted!
          </h4>

          <p className="text-[15px] text-[#A0A4A8] dark:text-[#afafaf] text-center px-2 leading-relaxed">
            <span className="text-[#008CFF] font-semibold">Congratulations!</span>{" "}
            You’ve successfully solved this challenge and earned your reward.
          </p>

          {/* Divider Line with Text */}
          <div className="flex items-center gap-4 w-full mt-8 mb-6 px-2">
            <div className="h-[1px] bg-[#35383F] dark:bg-[#afafaf] flex-1"></div>
            <span className="text-[#A0A4A8] dark:text-[#afafaf]  text-xs font-medium whitespace-nowrap">
              Share your achievement on
            </span>
            <div className="h-[1px] bg-[#35383F] dark:bg-[#afafaf] flex-1"></div>
          </div>

          <div className="flex items-center justify-center gap-5 mb-8">
            {/* 4. Pass the handleShare function to the icons */}
            {shareIcons.map((icon) => (
              <ShareIcon 
                key={icon} 
                name={icon} 
                onClick={() => handleFacebookShare()} 
              />
            ))}
          </div>

          {xpCount > 0 && (
            <div className="relative bg-gradient-to-r from-[#4A2E15] to-[#392410] border border-[#5A381A] p-4 rounded-2xl flex items-center gap-4 w-full max-w-[280px] shadow-lg mb-10 mt-5">
              <Image
                src={Assets.Svgs.XpCoin}
                alt="XP"
                height={48}
                width={48}
                className="drop-shadow-md"
              />
              <div className="flex flex-col justify-center">
                <p className="text-[#C4A68C] text-[13px] font-medium mb-0.5">
                  Challenge Reward
                </p>
                <h2 className="text-[#FF9E2B] text-[26px] leading-none tracking-tight font-bold">
                  {xpCount} XP
                </h2>
              </div>

          
            </div>
          )}

          <Button
            className="w-[85%] h-12 mb-5 rounded-xl text-[15px] font-medium bg-[#008CFF] hover:bg-[#0077D9] text-white transition-all"
            onClick={onClose}
          >
            Continue To Next Challenge
          </Button>
        </div>
      </div>
    </Modal>
  );
};
// TODO: delete after sumite modal social icon post feature approve

// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Button, FocusText, Iconify, Modal } from "@/components";
// import { Assets } from "@/constants/assets";
// import { ArrowUpRight } from "lucide-react";
// import Image from "next/image";

// const ShareIcon = ({ name }: { name: string }) => (
//   <div className="border p-2 cursor-pointer border-[#005092] text-[#005092] dark:text-white bg-[#0050921A] size-9 rounded-full flex justify-center items-center dark:border-[#FFFFFF]">
//     <Iconify iconName={name} />
//   </div>
// );

// export const SolutionSubmittedModal = ({
//   open,
//   onClose,
//   xpCount,
// }: any) => {
//   console.log("xpCount", xpCount);

//   const shareIcons = [
//     "iconoir:facebook",
//     "iconoir:twitter",
//     "basil:linkedin-outline",
//     "solar:link-broken",
//   ];

//   return (
//     <Modal
//       ClossBtnIconClass="size-6!"
//       ClossBtnClass=" text-xl top-6 right-6! text-primary "
//       open={open}
//       onClose={onClose}
//     >
//       <div className="  space-y-5 ">
//         <div className=" bg-[#E5F3FF] dark:bg-primary/15 rounded-lg flex flex-col items-center gap-6 p-4">
//           <div className=" size-[110px] bg-[#008CFF]/20 rounded-full  flex justify-center items-center">
//             <img
//               src={Assets.Svgs.CelebrationImg}
//               alt="Solution Submitted"
//               className="size-16"
//             />
//           </div>

//           <h4 className="text-[33px] leading-none font-bold">
//             Solution Submitted!
//           </h4>

//           <p className="text-sm text-center px-5">
//             <FocusText className=" font-bold!">Congratulations!</FocusText>{" "}
//             You’ve successfully solved this challenge and earned your reward.
//           </p>

//           <div className=" flex  justify-center items-center  w-full gap-10">
//             <div className="flex flex-col gap-2.5">
//               <h6 className="text-sm font-medium text-nowrap text-[#005092] dark:text-white">
//                 Share your achievement on
//               </h6>

//               <div className="flex items-center gap-3">
//                 {shareIcons.map((icon) => (
//                   <ShareIcon key={icon} name={icon} />
//                 ))}
//               </div>
//             </div>

//             {xpCount > 0 && (
//               <div className="bg-[#FFFAF4] dark:bg-[#FFFAF4]/15 p-3 rounded-3xl flex items-center gap-3 w-full justify-center">
//                 <Image
//                   src={Assets.Svgs.XpCoin}
//                   alt="XP"
//                   height={44}
//                   width={44}
//                 />
//                 <div>
//                   <p className="text-[#FF9E2B] text-xs font-semibold">
//                     Challenge Reward
//                   </p>
//                   <h2 className="text-[#FF9E2B] text-[28px] tracking-tighter font-bold">
//                     {xpCount} XP
//                   </h2>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <Button
//           endIcon={<ArrowUpRight />}
//           className="w-full h-12 rounded-xl text-sm"
//           onClick={onClose}
//         >
//           Continue to next Challenge
//         </Button>
//       </div>
//     </Modal>
//   );
// };
