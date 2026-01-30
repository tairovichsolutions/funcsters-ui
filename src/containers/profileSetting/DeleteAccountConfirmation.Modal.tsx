/* eslint-disable @next/next/no-img-element */
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";
import { Input } from "@/components";

export const DeleteAccountConfirmationModal = () => {
  const { closeModal } = useProfileSettingModal();
  const onDelete = () => {
    closeModal();
  };
  return (
    <div className="p-8 flex flex-col gap-4 justify-center items-center">
      <div>
        <img src={Assets.Images.ConfirmationImage} alt="" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-extrabold text-2xl text-black text-center">
          Account Deletion?
        </h2>
        <p className="font-normal text-[13px] max-w-md text-center text-medium-gray">
          Are you sure you want to delete your account? This action will
          permanently remove all your data, progress, and achievements from
          Funcsters, and you won’t be able to recover them later.
        </p>
      </div>

      <div className="w-full">
        <Input label="Reason" placeholder="Enter your reason" />
      </div>
      <div className=" grid grid-cols-2 items-center justify-center gap-4  w-full">
        <Button variant="outline" onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Yes,Delete
        </Button>
      </div>
    </div>
  );
};
