import { cn } from "@/lib";

export const ReviewCard = ({
  img,
  name,
  username,
  body,
  isActive,
  className,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  isActive?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative h-full md:w-fit shrink-0 font-poppins! cursor-pointer overflow-hidden rounded-xl border  ",
        "border-[#000000] bg-[#001425] hover:bg-[#001425]/90",
        isActive
          ? "scale-100 transform transition-all duration-150 opacity-100"
          : "scale-90 transform transition-all duration-100 opacity-50",
        className
      )}
    >
      <div className="flex flex-row items-center gap-5 3xl:gap-6 px-5 3xl:px-5 py-3 pt-4 3xl:pt-5 ">
        <img
          className="rounded-full size-12 3xl:size-[70.049px]"
          alt=""
          src={img}
        />
        <div className="flex flex-col gap-1 3xl:gap-2.5">
          <h6 className="text-base font-medium  3xl:text-[24.683px]">{name}</h6>
          <p className="text-xs font-normal  3xl:text-[19.746px] ">
            {username}
          </p>
        </div>
      </div>
      <p
        className=" 3xl:text-[22.215px]/10! mt-2  md:text-[16px]/7 text-[13px] font-light! border-t!
         border-[#004D8C]/50! px-5 3xl:px-6 py-5 3xl:py-8
            [border-image:repeating-linear-gradient(90deg,#004D8C_0_10px,transparent_10px_16px)_1]"
      >
        {body}
      </p>

      <div className=" bg-[#008CFF70]   size-32 rounded-full blur-3xl absolute right-0 z-0 bottom-0"></div>
    </div>
  );
};
