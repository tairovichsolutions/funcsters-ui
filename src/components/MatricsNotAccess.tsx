/* eslint-disable @next/next/no-img-element */
import { Assets } from "@/constants/assets";
import { Button } from "./ui";
import { useAuthModal } from "@/providers/AuthModalsProvider";

export const MatricsNotAccess = () => {
  const { openModal } = useAuthModal();
  return (
    <div
      role="note"
      aria-live="polite"
      className="cursor-pointer absolute flex-col inset-0 z-50 bg-white/20  rounded-md overflow-hidden select-none backdrop-blur-xl w-full h-full flex gap-3 items-center justify-center p-4"
    >
      <img
        src={Assets.Images.LockKeyImage}
        alt="lock_key_image"
        className="w-12 h-12 object-contain"
      />
      <h2 className="text-white text-2xl text-center  tracking-wide font-magseva lg:text-3xl ">
        Log In to start Tracking your code <br /> improvement roadmap
      </h2>

      <div className=" flex justify-center gap-3 items-center">
        <Button
          className=" border border-white! w-24"
          onClick={() => openModal("login")}
        >
          Log in
        </Button>
        <Button
          className=" border border-white! w-24"
          onClick={() => openModal("signUp")}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};
