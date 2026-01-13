type StepItemProps = {
  number: string;
  title: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export const StepItem: React.FC<StepItemProps> = ({
  number,
  title,
  description,
  isActive,
  onClick,
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex items-center self-start md:gap-10 gap-6 3xl:h-32 rounded-xl p-4 md:p-5 text-left
       transition-all duration-300 cursor-pointer
      ${
        isActive
          ? "bg-[linear-gradient(131.27deg,rgba(0,140,255,0.2)_20.18%,rgba(0,84,153,0)_69.87%)] backdrop-opacity-100 "
          : "bg-transparent opacity-50"
      } ${className}
    `}
  >
    <div className="flex font-satoshi items-center  min-w-20 overflow-hidden justify-center text-3xl md:text-6xl 3xl:text-[52.61px] font-bold">
      {number}
    </div>
    <div className="space-y-1 font-imbMono!">
      <h3 className="text-base md:text-lg 3xl:text-[27.499px]! font-normal">
        {title}
      </h3>
      <p className="text-xs md:text-sm leading-snug font-light 3xl:text-[18px]! line-clamp-2 text-white/80">
        {description}
      </p>
    </div>
  </button>
);
