import React from 'react';

interface FlameIconV3Props extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

const FlameIconV3: React.FC<FlameIconV3Props> = ({ 
  className, 
  width = 10, 
  height = 11, 
  color = "#F75900",
  ...props 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 10 11" 
      fill="none"
      className={className}
      {...props}
    >
      <g filter="url(#filter0_i_62051_10384)">
        <path 
          d="M4.52461 10.3143C6.84983 10.3143 8.73478 8.42933 8.73478 6.10411C8.73478 4.54577 7.88811 2.47602 6.62969 1.28031L5.57715 2.68249L3.73521 0.31427C1.89326 1.62995 0.314453 4.04874 0.314453 6.10411C0.314453 8.42933 2.19941 10.3143 4.52461 10.3143Z" 
          fill={color}
        />
      </g>
      <path 
        d="M4.52461 10.3143C6.84983 10.3143 8.73478 8.42933 8.73478 6.10411C8.73478 4.54577 7.88811 2.47602 6.62969 1.28031L5.57715 2.68249L3.73521 0.31427C1.89326 1.62995 0.314453 4.04874 0.314453 6.10411C0.314453 8.42933 2.19941 10.3143 4.52461 10.3143Z" 
        stroke={color} 
        strokeWidth="0.628448" 
        strokeLinejoin="round"
      />
      <path 
        d="M4.52451 8.73482C5.6871 8.73482 6.62959 7.67454 6.62959 6.3666C6.62959 5.95032 6.53413 5.55914 6.36646 5.21923L5.31392 6.10347L3.73511 3.99786C3.20884 4.52413 2.41943 5.37274 2.41943 6.3666C2.41943 7.67454 3.36191 8.73482 4.52451 8.73482Z" 
        fill="white" 
        stroke="white" 
        strokeWidth="0.628448" 
        strokeLinejoin="round"
      />
      <defs>
        <filter id="filter0_i_62051_10384" x="0" y="0" width="9.04883" height="11.6104" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.98195"/>
          <feGaussianBlur stdDeviation="1.59567"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_62051_10384"/>
        </filter>
      </defs>
    </svg>
  );
};

export default FlameIconV3;