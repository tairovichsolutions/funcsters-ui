import Image from "next/image";
import { Assets } from "@/constants/assets";

export const AlertBanner = () => {
  return (
    <div className=" rounded-md flex items-center justify-between bg-[#008CFF0D] border border-[#008CFFCC] py-1.5  px-3">
      <div className=" space-y-2">
        <h4 className=" text-sm leading-none font-medium line-clamp-1">
          You haven’t solved this challenge yet,
        </h4>
        <p className="text-primary text-sm leading-none font-semibold line-clamp-1">
          Give it a try and put your skills to the test!
        </p>
      </div>

      <Image
        src={Assets.Images.HandCoding}
        height={10}
        width={75}
        alt="hand_coding_img"
        className="object-cover"
      />
    </div>
  );
};
