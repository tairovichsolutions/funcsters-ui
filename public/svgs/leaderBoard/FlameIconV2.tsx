import React from 'react';

const FlameIconV2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <g filter="url(#filter0_i_62036_15271)">
      <path
        d="M10 18.3327C13.4517 18.3327 16.25 15.5344 16.25 12.0827C16.25 11.2493 16.25 9.58268 14.5833 7.49935C14.5833 7.49935 14.5003 9.87735 12.8552 9.53335C10.1942 8.97702 13.6292 3.75182 8.75 1.66602C8.75 5.83268 3.75 7.08268 3.75 12.0827C3.75 15.5344 6.54822 18.3327 10 18.3327Z"
        fill="#FF5216"
      />
    </g>
    <path
      d="M10 18.3327C13.4517 18.3327 16.25 15.5344 16.25 12.0827C16.25 11.2493 16.25 9.58268 14.5833 7.49935C14.5833 7.49935 14.5003 9.87735 12.8552 9.53335C10.1942 8.97702 13.6292 3.75182 8.75 1.66602C8.75 5.83268 3.75 7.08268 3.75 12.0827C3.75 15.5344 6.54822 18.3327 10 18.3327Z"
      stroke="#E1420A"
      strokeLinejoin="round"
    />
    <path
      d="M10.0007 15.8336C11.6115 15.8336 12.9173 14.1547 12.9173 12.0836C10.2507 13.0836 9.30623 10.7809 9.16732 9.16602C7.96253 9.62702 7.08398 11.5207 7.08398 12.4993C7.08398 14.5704 8.38982 15.8336 10.0007 15.8336Z"
      fill="#FEC72F"
      stroke="#FEC72F"
      strokeWidth="2.23"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_i_62036_15271"
        x="3.25"
        y="1.16602"
        width="14.609"
        height="20.9938"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="1.10905" dy="3.32714" />
        <feGaussianBlur stdDeviation="2.77262" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_62036_15271"
        />
      </filter>
    </defs>
  </svg>
);

export default FlameIconV2;