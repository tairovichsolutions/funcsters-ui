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
  authError?: string | null;
  successMessage?: string | null;
}

export const AccountStatus: React.FC<AccountStatusProps> = ({
  connections,
  onConnectionClick,
  authError,
  successMessage,
}) => {
  const { openModal: openAuthModal } = useAuthModal();

  return (
    <div className="flex flex-col gap-6 ">
      <div className=" space-y-1">
        <h2 className=" font-semibold text-xl">Account Status</h2>
        <p className=" text-xs">Edit Your Account Status </p>
      </div>

      {successMessage && (
        <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="mt-0.5 shrink-0 bg-green-500/10 p-1.5 rounded-lg border border-green-500/20">
            <Iconify
              iconName="ion:checkmark-circle-outline"
              className="text-green-600 dark:text-green-400 w-4 h-4"
            />
          </div>
          <p className="text-green-700 dark:text-green-400 font-medium text-[12px] leading-relaxed">
            {successMessage}
          </p>
        </div>
      )}

      {authError && (
        <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="mt-0.5 shrink-0 bg-destructive/10 p-1.5 rounded-lg border border-destructive/20">
            <Iconify
              iconName="ion:warning-outline"
              className="text-destructive w-4 h-4"
            />
          </div>
          <p className="text-destructive font-medium text-[12px] leading-relaxed">
            {authError}
          </p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {connections.map((item) => (
          <div
            key={item.id}
            className="p-2 flex items-center justify-between gap-2 bg-flash-white dark:bg-[#FFFFFF1A]!  border rounded-md"
          >
            <div className="flex items-center gap-2">
              <Iconify iconName={item.Icon} />
              <div className="flex flex-col">
                <p className="text-secondary font-medium text-base dark:text-white leading-tight">
                  {item.name}
                </p>
                {item.connected && item.identifier && (
                  <p className="text-black/40 dark:text-white/40 text-[11px] font-normal leading-tight">
                    {item.identifier}
                  </p>
                )}
              </div>
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
