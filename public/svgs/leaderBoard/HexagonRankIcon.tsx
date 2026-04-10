import React from 'react';

// Define the props to include standard SVG attributes PLUS our custom 'value'
interface HexagonRankIconProps extends React.SVGProps<SVGSVGElement> {
  value: string | number;
}

const HexagonRankIcon = ({ value, ...props }: HexagonRankIconProps) => (
  <svg
    width="98"
    height="76"
    viewBox="0 0 98 76"
    style={{ overflow: "visible" }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_dddd_62081_615)">
      <g clipPath="url(#clip0_62081_615)">
        <path d="M46.1333 5.35695C47.7919 4.39933 49.8355 4.39933 51.4941 5.35695L73.989 18.3443C75.6476 19.302 76.6694 21.0717 76.6694 22.987V48.9618C76.6694 50.8771 75.6476 52.6468 73.989 53.6044L51.4941 66.5918C49.8355 67.5495 47.7919 67.5495 46.1333 66.5918L23.6384 53.6044C21.9798 52.6468 20.958 50.8771 20.958 48.9618V22.987C20.958 21.0717 21.9798 19.302 23.6384 18.3443L46.1333 5.35695Z" fill="#008CFF" />

        <path fillRule="evenodd" clipRule="evenodd" d="M73.066 19.1565L51.2068 6.53614C49.7072 5.67032 47.8596 5.67032 46.3599 6.53614L24.5008 19.1565C23.0011 20.0223 22.0773 21.6225 22.0773 23.3541V48.5949C22.0773 50.3265 23.0011 51.9267 24.5008 52.7925L46.3599 65.4129C47.8596 66.2787 49.7072 66.2787 51.2068 65.4129L73.066 52.7925C74.5656 51.9267 75.4895 50.3265 75.4895 48.5949V23.3541C75.4895 21.6225 74.5656 20.0223 73.066 19.1565ZM52.2455 4.73718C50.1031 3.50029 47.4636 3.50029 45.3213 4.73718L23.4621 17.3575C21.3197 18.5945 20 20.8803 20 23.3541V48.5949C20 51.0687 21.3197 53.3545 23.4621 54.5914L45.3213 67.2118C47.4636 68.4487 50.1031 68.4487 52.2455 67.2118L74.1046 54.5914C76.247 53.3545 77.5667 51.0687 77.5667 48.5949V23.3541C77.5667 20.8803 76.247 18.5945 74.1046 17.3575L52.2455 4.73718Z" fill="white" />

        {/* Dynamic Text Output */}
        <text
          x="48.5"
          y="34"
          fill="white"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
          suppressHydrationWarning
        >
          <tspan x="48.5" dy="0" fontSize="12" fontWeight="bold">#{value}</tspan>
        </text>
      </g>
    </g>
    <defs>
      <filter id="filter0_dddd_62081_615" x="-3.35059" y="-1.4782e-05" width="104.33" height="137.663" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="2.85714" />
        <feGaussianBlur stdDeviation="3.33333" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.203922 0 0 0 0 0.317647 0 0 0 0 0.509804 0 0 0 0.1 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_62081_615" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="12.381" />
        <feGaussianBlur stdDeviation="6.19048" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.203922 0 0 0 0 0.317647 0 0 0 0 0.509804 0 0 0 0.09 0" />
        <feBlend mode="normal" in2="effect1_dropShadow_62081_615" result="effect2_dropShadow_62081_615" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="27.619" />
        <feGaussianBlur stdDeviation="8.09524" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.203922 0 0 0 0 0.317647 0 0 0 0 0.509804 0 0 0 0.05 0" />
        <feBlend mode="normal" in2="effect2_dropShadow_62081_615" result="effect3_dropShadow_62081_615" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="49.5238" />
        <feGaussianBlur stdDeviation="10" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.203922 0 0 0 0 0.317647 0 0 0 0 0.509804 0 0 0 0.01 0" />
        <feBlend mode="normal" in2="effect3_dropShadow_62081_615" result="effect4_dropShadow_62081_615" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_62081_615" result="shape" />
      </filter>
      <clipPath id="clip0_62081_615">
        <rect width="64.33" height="64.33" fill="white" transform="translate(16.6494 3.80951)" />
      </clipPath>
    </defs>
  </svg>
);

export default HexagonRankIcon;