import React, { ReactNode } from "react";

type AnimatedBorderButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    active?: boolean;
  };

const AnimatedBorderButton: React.FC<AnimatedBorderButtonProps> = ({
  children,
  className = "",
  active = false,
  ...props
}) => {
  const baseScale = active ? "scale-100" : "scale-0";

  return (
    <button
      {...props}
      className={`
        relative inline-flex items-center justify-center px-4 text-white uppercase tracking-[0.25em]
        text-sm py-1 cursor-pointer md:text-[15px] leading-none group
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <span
        className={`
          pointer-events-none absolute -left-1 -top-1 w-2 h-2 border-l border-t border-white
          transform ${baseScale}
          origin-top-left transition-transform duration-300 group-hover:scale-100
        `}
      />

      <span
        className={`
          pointer-events-none absolute -left-1 -bottom-1 w-2 h-2
          border-l border-b border-white transform ${baseScale} origin-bottom-left transition-transform duration-300
          group-hover:scale-100
        `}
      />

      <span
        className={`
          pointer-events-none absolute -right-1 -top-1 w-2 h-2 border-r border-t border-white transform ${baseScale} origin-top-right transition-transform duration-300 delay-100 group-hover:scale-100
        `}
      />

      <span
        className={`
          pointer-events-none
          absolute
          -right-1 -bottom-1
          w-2 h-2
          border-r border-b border-white
          transform
          ${baseScale}
          origin-bottom-right
          transition-transform duration-300 delay-100
          group-hover:scale-100
        `}
      />
    </button>
  );
};

export default AnimatedBorderButton;
