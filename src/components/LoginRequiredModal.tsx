/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Button, FocusText } from "./ui";
import { Assets } from "@/constants/assets";
import { useAuthModal } from "@/providers/AuthModalsProvider";

export const LoginRequiredModal = () => {
  const { openModal } = useAuthModal();
  return (
    <div className="  flex flex-col  gap-5 p-5 justify-center items-center">
      <div>
        <img
          src={Assets.Images.LoginSuccessfullyImage}
          alt="login_successfully_image"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-extrabold text-2xl text-center">
          Login Required to Continue!
        </h2>
        <p className="font-! text-sm text-center px-5 ">
          You’ve reached the <FocusText>limit</FocusText> for guest access. To
          keep using <FocusText>Funcsters</FocusText> and continue{" "}
          <FocusText>earning points</FocusText>, please log in or sign up. It
          only takes a few seconds to join and unlock the full experience.
        </p>
      </div>
      <div className=" grid grid-cols-2 w-full gap-4 mt-3">
        <Button
          variant={"secondary"}
          className="w-full h-11 rounded-xl"
          onClick={() => openModal("login")}
        >
          Login Now
        </Button>
        <Button
          className="w-full h-11 rounded-xl"
          onClick={() => openModal("signUp")}
        >
          Register Now
        </Button>
      </div>
    </div>
  );
};
