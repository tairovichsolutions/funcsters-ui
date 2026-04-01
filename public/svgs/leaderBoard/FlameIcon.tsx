const FlameIcon = (props: React.SVGProps<SVGSVGElement>)  => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="26" height="26" rx="13" fill="#FEEAD4" />
    <path
      opacity="0.2"
      d="M13.1158 20.7494C16.5577 20.6892 19.299 17.8466 19.2388 14.4003C19.2242 13.5682 19.1951 11.9042 17.4969 9.85318C17.4969 9.85318 17.4556 12.2289 15.8092 11.9141C13.1462 11.4051 16.4801 6.12816 11.5784 4.13071C11.6512 8.29084 6.68735 9.62606 6.77464 14.6182C6.83491 18.0645 9.67395 20.8096 13.1158 20.7494Z"
      fill="#F0780E"
      stroke="#F0780E"
      strokeLinejoin="round"
    />
    <g filter="url(#filter0_i_62005_8213)">
      <path
        d="M13.0419 20.6591C15.8179 20.6591 18.0683 18.4088 18.0683 15.6328C18.0683 14.9627 18.0683 13.6223 16.7279 11.9469C16.7279 11.9469 16.6612 13.8593 15.3381 13.5826C13.1982 13.1352 15.9606 8.93309 12.0367 7.25568C12.0367 10.6065 8.01562 11.6118 8.01562 15.6328C8.01562 18.4088 10.266 20.6591 13.0419 20.6591Z"
        fill="#FF5216"
      />
    </g>
    <path
      d="M13.0419 20.6591C15.8179 20.6591 18.0683 18.4088 18.0683 15.6328C18.0683 14.9627 18.0683 13.6223 16.7279 11.9469C16.7279 11.9469 16.6612 13.8593 15.3381 13.5826C13.1982 13.1352 15.9606 8.93309 12.0367 7.25568C12.0367 10.6065 8.01562 11.6118 8.01562 15.6328C8.01562 18.4088 10.266 20.6591 13.0419 20.6591Z"
      stroke="#E1420A"
      strokeLinejoin="round"
    />
    <path
      d="M13.0429 18.6494C14.3383 18.6494 15.3885 17.2992 15.3885 15.6336C13.2439 16.4378 12.4844 14.586 12.3727 13.2872C11.4038 13.658 10.6973 15.1809 10.6973 15.9679C10.6973 17.6335 11.7474 18.6494 13.0429 18.6494Z"
      fill="#FEC72F"
      stroke="#FEC72F"
      strokeWidth="2.23"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_i_62005_8213"
        x="7.51562"
        y="6.75568"
        width="12.1618"
        height="17.7306"
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
          result="effect1_innerShadow_62005_8213"
        />
      </filter>
    </defs>
  </svg>
);

export default FlameIcon;