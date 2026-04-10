"use client";

import { Assets } from "@/constants/assets";
import { useEffect, useState } from "react";



export default function ThinkingLoader() {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 2200); // matches animation timing

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center  bg-primary/10 rounded-full p-1">
      <div className="flex items-center gap-4">
        
        {/* Icon Wrapper */}
        <div className="relative w-8 h-8">
          
          {/* Spinner */}
          {/* {!showImage && (
            <div className="spinner "></div>
          )} */}

          {/* SVG Icon */}
       

          {/* Final Image Reveal */}
          {/* {showImage && ( */}
            <div className="absolute inset-0  animate-pulse">
              <img
                src={Assets.Svgs.IntelligenceLogo}
                alt="title"
                className="h-full w-full"
              />
            </div>
          {/* )} */}
        </div>

        {/* Text */}
        {/* <div className="text-gray-500 text-xl">
          Thinking<span className="dots"></span>
        </div> */}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .spinner {
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top: 4px solid #0056b3;
          border-radius: 50%;
          animation: spin 1s linear infinite, morphOut 0.5s forwards 2s;
        }

        .thinking-icon {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(0.5);
          animation: morphIn 0.5s forwards 2.2s;
        }

        .dots::after {
          content: "";
          animation: dots 1.5s steps(4, end) infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes morphOut {
          to {
            opacity: 0;
            transform: scale(0.5) rotate(360deg);
          }
        }

        @keyframes morphIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes dots {
          0%, 20% { content: ""; }
          40% { content: "."; }
          60% { content: ".."; }
          80% { content: "..."; }
        }

        /* 🔥 Image reveal effect */
        @keyframes blurLens {
          0% {
            opacity: 0;
            filter: blur(20px);
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
          }
        }

        .animate-blurLens {
          animation: blurLens 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}