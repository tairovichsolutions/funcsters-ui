/* eslint-disable @next/next/no-img-element */
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/providers/AuthModalsProvider";

export const SignUpSuccessfullyModal = () => {
  const { closeModal } = useAuthModal();
  return (
    <div className="p-8 flex flex-col gap-4 justify-center items-center">
      <div>
        <img src={Assets.Images.SignUpSuccessfullyImage} alt="" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-extrabold text-2xl text-center">
          Register Successfully!
        </h2>
        <p className="font-normal text-sm text-center max-w-xs text-medium-gray">
          You have successfully register your information to dashboard, now you
          can improve your coding.
        </p>
      </div>
      <Button className="w-full" onClick={() => closeModal()}>
        Continue
      </Button>
    </div>
  );
};
