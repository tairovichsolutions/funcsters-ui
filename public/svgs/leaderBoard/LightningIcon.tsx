import React from 'react';

const LightningIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="26" height="26" rx="13" fill="#DCF0FD" />
    <g clipPath="url(#clip0_62005_8245)">
      <path
        d="M13.0938 5.25586C13.209 5.28031 13.2919 5.38201 13.292 5.5V11.25H17.042C17.0835 11.2499 17.1247 11.2605 17.1611 11.2803C17.1975 11.3001 17.2285 11.3285 17.251 11.3633L17.252 11.3652C17.2974 11.4348 17.3044 11.5232 17.2695 11.6025L13.2705 20.6016C13.2294 20.6935 13.139 20.75 13.042 20.75C13.0278 20.75 13.0101 20.7482 12.9893 20.7441H12.9902C12.8749 20.7197 12.792 20.6181 12.792 20.5V14.75H9.04199C8.9579 14.75 8.87901 14.7067 8.83301 14.6357H8.83203C8.78603 14.5652 8.77961 14.475 8.81348 14.3994V14.3984L12.8135 5.39941C12.8622 5.29036 12.9761 5.23089 13.0938 5.25586Z"
        fill="url(#paint0_linear_62005_8245)"
        stroke="#1792E4"
        strokeWidth="0.5"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_62005_8245"
        x1="13.0419"
        y1="5"
        x2="13.0419"
        y2="21"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#58C3FB" />
        <stop offset="1" stopColor="#179ADB" />
      </linearGradient>
      <clipPath id="clip0_62005_8245">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(5.04199 5)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default LightningIcon;