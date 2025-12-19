/* eslint-disable @next/next/no-img-element */
import { Assets } from "@/constants/assets";

export const MatricsNotAccess = () => {
  return (
    <div
      role="note"
      aria-live="polite"
      className="cursor-pointer absolute inset-0 z-50 bg-white/20  rounded-md overflow-hidden select-none backdrop-blur-xl w-full h-full flex gap-3 items-center justify-center p-4"
    >
      <img
        src={Assets.Images.LockKeyImage}
        alt="lock_key_image"
        className="w-16 h-16 object-contain"
      />
      <div className="flex flex-col gap-1 max-w-xl">
        <h2 className="text-white font-extrabold text-xl lg:text-2xl">
          You can’t access this feature
        </h2>
        <p className="font-normal text-white/90 text-sm lg:text-[15px]">
          You’re currently in guest mode. To view challenge statistics and track
          your progress, please create an account or sign in. Joining takes just
          a moment and unlocks your full coding experience.
        </p>
      </div>
    </div>
  );
};
