/* eslint-disable @next/next/no-img-element */
import { useTheme } from "next-themes";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/providers/AuthModalsProvider";

export const EmailSendModal = () => {
  const { openModal } = useAuthModal();
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className="p-8 flex flex-col gap-4 justify-center items-center">
      <div>
        <img
          src={
            dark
              ? Assets.Images.EmailSendDarkImage
              : Assets.Images.EmailSendImage
          }
          alt="email_send_image"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-extrabold text-3xl text-center">Email Send!</h2>
        <p className="font-normal text-sm text-center max-w-xs text-medium-gray">
          Check you mail you have received the reset mail copy code and enter
          for reset password.
        </p>
      </div>
      <div className=" px-5 w-full mt-3">
        <Button
          className="w-full h-10 text-sm"
          onClick={() => openModal("resetPassword")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
