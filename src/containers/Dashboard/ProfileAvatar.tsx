/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Iconify } from "@/components/ui/iconify";
import { useLogout } from "@/mutations/useLogout";
import { DisplayAvatar } from "@/components/ui/display-avatar";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";
import { getAvatarUrl } from "@/lib/utils";

export const ProfileAvatar = ({ userData }: any) => {
  const { mutate: doLogout } = useLogout();
  const { openModal: openSettingModal } = useProfileSettingModal();
  const firstLetter = userData?.username?.charAt(0)?.toUpperCase();

  const handleLogout = () => {
    // The logout mutation handles everything: cancels queries, clears
    // cookies, calls the server, and does a hard redirect.
    doLogout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none border-none cursor-pointer">
        <div className="flex gap-3 items-center">
          <DisplayAvatar
            FallbackName={firstLetter}
            src={userData?.avatarUrl ? getAvatarUrl(userData.avatarUrl) : undefined}
          />
          <div className=" text-start md:block  hidden">
            <h4 className="text-sm dark:text-white font-semibold max-w-28 truncate text-nowrap text-mid-slate">
              {userData?.username}
            </h4>
            <h6 className="text-xs dark:text-[#AFAFAF] font-normal max-w-36 truncate  text-nowrap text-medium-gray">
              {userData?.email}
            </h6>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 mt-4 mb-5!  max-h-52 p-3 rounded-xl! overflow-hidden  "
        sideOffset={4}
      >
        <DropdownMenuItem
          onClick={() => openSettingModal("setting")}
          className="flex gap-3 border-none outline-none items-center px-1.5 cursor-pointer"
        >
          <DisplayAvatar
            FallbackName={firstLetter}
            src={userData?.avatarUrl ? getAvatarUrl(userData.avatarUrl) : undefined}
          />
          <div className=" text-start ">
            <h4 className="text-sm font-semibold w-28 truncate text-nowrap text-mid-slate">
              {userData?.username}
            </h4>
            <h6 className="text-xs font-normal w-36 truncate  text-nowrap text-medium-gray">
              {userData?.email}
            </h6>
          </div>
        </DropdownMenuItem>

        <div className="mt-3 space-y-1">
          <button
            onClick={() => handleLogout()}
            className="flex w-full items-center text-sm font-semibold dark:text-[#D7263D]! dark:bg-[#D7263D1A]! justify-between bg-[#9400140D] text-[#940014]!  gap-2 py-2.5 px-3.5 rounded-lg cursor-pointer"
          >
            <span>Logout</span>
            <Iconify iconName="hugeicons:logout-02" />
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
