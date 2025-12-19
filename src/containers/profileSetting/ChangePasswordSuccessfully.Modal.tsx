/* eslint-disable @next/next/no-img-element */
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";

export const ChangePasswordSuccessfullyModal = () => {
  const { closeModal } = useProfileSettingModal();
  return (
    <div className="p-8 flex flex-col gap-4 justify-center items-center">
      <div>
        <img src={Assets.Images.NewPasswordImage} alt="" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-extrabold text-2xl text-black text-center">
          Password Changed!
        </h2>
        <p className="font-normal text-[13px] max-w-md text-center text-medium-gray">
          You have successfully change your password. Now you can continue your
          learning and improve your code.
        </p>
      </div>

      <Button className="w-full" onClick={() => closeModal()}>
        Continue
      </Button>
    </div>
  );
};
