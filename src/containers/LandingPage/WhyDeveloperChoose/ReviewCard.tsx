import { cn } from "@/lib";

export const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <div
      className={cn(
        "relative h-full w-80 md:w-fit  shrink-0 font-poppins! cursor-pointer overflow-hidden rounded-xl border  ",
        "border-[#000000] bg-[#001425] hover:bg-[#001425]/90"
      )}
    >
      <div className="flex flex-row items-center gap-3  3xl:gap-6 px-4 3xl:px-5 pb-2 pt-3 3xl:pt-5 ">
        <img
          className="rounded-full size-[36px] 3xl:size-[70.049px]"
          alt=""
          src={img}
        />
        <div className="flex flex-col gap-1 3xl:gap-2.5">
          <h6 className="text-sm font-medium  3xl:text-[24.683px]">{name}</h6>
          <p className="text-xs font-normal  3xl:text-[19.746px] ">
            {username}
          </p>
        </div>
      </div>
      <p className=" 3xl:text-[22.215px]/10! mt-2  md:text-[16px] text-[13px] font-light! border-t border-[#004D8C] px-4 3xl:px-6 py-5 3xl:py-8 border-dashed">
        {body}
      </p>

      <div className=" bg-[#008CFF70]   size-32 rounded-full blur-3xl absolute right-0 z-0 bottom-0"></div>
    </div>
  );
};
