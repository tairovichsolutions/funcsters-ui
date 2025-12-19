/* eslint-disable @next/next/no-img-element */
import { useTheme } from "next-themes";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/providers/AuthModalsProvider";

export const LoginSuccessfullyModal = () => {
  const { closeModal } = useAuthModal();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const imageSrc = isDark
    ? Assets.Images.LoginSuccessfullyDarkImage
    : Assets.Images.LoginSuccessfullyImage;
  return (
    <div className="p-8 flex flex-col gap-4 justify-center items-center">
      <div>
        <img loading="lazy" src={imageSrc} alt="login_successfully_image" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-extrabold text-2xl text-center">
          Login Successfully!
        </h2>
        <p className="font-normal text-sm text-center max-w-xs text-medium-gray">
          You have successfully login to dashboard, now you can improve your
          coding.
        </p>
      </div>
      <Button className="w-full" onClick={() => closeModal()}>
        Continue
      </Button>
    </div>
  );
};
