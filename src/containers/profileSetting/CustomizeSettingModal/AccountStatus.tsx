import React from "react";
import { cn } from "@/lib";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { Iconify } from "@/components/ui/iconify";
import { SvgColor } from "@/components/ui/svg-color";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import type { ConnectionItem } from "./AccountStatus.constant";

interface ContentProps {
  icon: string;
  desc: string;
  label: string;
  buttonLabel: string;
  onActionClick: () => void;
}

const Content: React.FC<ContentProps> = ({
  icon,
  desc,
  label,
  buttonLabel,
  onActionClick,
}) => {
  return (
    <div className="p-2 flex flex-col gap-2 bg-flash-white dark:bg-[#FFFFFF1A]! border rounded-md">
      <div className="flex items-center gap-2">
        <SvgColor src={icon} />
        <h2 className="font-medium text-base text-black  dark:text-white">
          {label}
        </h2>
      </div>
      <p className="font-normal text-sm text-black/60  dark:text-white/50">
        {desc}
      </p>
      <div className="flex justify-end">
        <Button
          onClick={onActionClick}
          variant="destructive"
          className=" bg-[#D7263D33]! font-semibold! dark:bg-[#D7263D]! dark:text-white! hover:bg-[#D7263D53]! text-[#D7263D]!"
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

interface AccountStatusProps {
  connections: ConnectionItem[];
  onConnectionClick: (id: string) => void;
}

export const AccountStatus: React.FC<AccountStatusProps> = ({
  connections,
  onConnectionClick,
}) => {
  const { openModal: openAuthModal } = useAuthModal();

  return (
    <div className="flex flex-col gap-6 ">
      <div className=" space-y-1">
        <h2 className=" font-semibold text-xl">Account Status</h2>
        <p className=" text-xs">Edit Your Account Status </p>
      </div>
      <div className="flex flex-col gap-3">
        {connections.map((item) => (
          <div
            key={item.id}
            className="p-2 flex items-center justify-between gap-2 bg-flash-white dark:bg-[#FFFFFF1A]!  border rounded-md"
          >
            <div className="flex items-center gap-2">
              <Iconify iconName={item.Icon} />
              <p className="text-secondary font-medium text-base dark:text-white">
                {item.name}
              </p>
            </div>
            <Button
              onClick={() => onConnectionClick(item.id)}
              className={cn(
                "font-semibold!",
                item.connected
                  ? "bg-[#D7263D33]! dark:bg-[#D7263D]! dark:text-white! hover:bg-[#D7263D53]! text-[#D7263D]!"
                  : null
              )}
              variant={item.connected ? "destructive" : "default"}
            >
              {item.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Content
          label="Delete Account"
          desc="This action will permanently remove all your data, progress, and achievements from Funcsters, and you won’t be able to recover them later."
          buttonLabel="Delete your account"
          icon={Assets.Svgs.DeleteAccount}
          onActionClick={() => openAuthModal("deleteAccount")}
        />
      </div>
    </div>
  );
};
