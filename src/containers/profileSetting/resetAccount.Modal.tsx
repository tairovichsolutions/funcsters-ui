/* eslint-disable @next/next/no-img-element */
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";

export const ResetAccountModal = () => {
  const { closeModal } = useProfileSettingModal();
  const onReset = () => {
    closeModal();
  };
  return (
    <div className="p-8 flex flex-col gap-4 justify-center items-center">
      <div>
        <img src={Assets.Images.ConfirmationImage} alt="" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-extrabold text-2xl text-black text-center">
          Reset Account?
        </h2>
        <p className="font-normal text-[13px] max-w-md text-center text-medium-gray">
          Are you sure you want to reset all your progress? Once you do, all
          your completed challenges, achievements, and earned points will be
          permanently lost and cannot be recovered.
        </p>
      </div>

      <div className=" grid grid-cols-2 items-center justify-center gap-4  w-full">
        <Button variant="outline" onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onReset}>
          Yes, Reset
        </Button>
      </div>
    </div>
  );
};
