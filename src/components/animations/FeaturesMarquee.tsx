import React from 'react';
import Marquee from "react-fast-marquee";

const baseFeatures = [
  "Master Modern Stack",
  "Fast-Track Success",
  "Lifetime Access",
];

const MULTIPLIER = 50;
const features = Array(MULTIPLIER).fill(baseFeatures).flat();
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g clipPath="url(#clip0_61232_194)">
      <path
        d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00004C14.6668 4.31814 11.6821 1.33337 8.00016 1.33337C4.31826 1.33337 1.3335 4.31814 1.3335 8.00004C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z"
        fill="#008CFF"
        stroke="#008CFF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 7.99996L7.33333 9.33329L10 6.66663"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_61232_194">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

interface MarqueeProps {
  speed?: number;
}

export default function FeaturesMarquee({ speed = 40 }: MarqueeProps) {
  return (
    <div className="w-full   bg-[#F8FAFC]  overflow-hidden">
      <Marquee
        speed={speed}
        pauseOnHover={true}
        gradient={true}
        gradientColor="#F8FAFC"
        gradientWidth={100}

      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="ps-1 pe-2 border-[#E9E9E9] bg-white mx-1 flex shrink-0 items-center gap-1 rounded-full border   shadow-sm"
          >
            <CheckCircleIcon />
            <span className="whitespace-nowrap text-base text-[#070707] font-light">
              {feature}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}