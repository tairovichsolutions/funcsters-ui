import React from "react";
import { Assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { Iconify } from "@/components/ui/iconify";
import { SvgColor } from "@/components/ui/svg-color";
import type { ConnectionItem } from "./AccountStatus.constant";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";

interface ContentProps {
  icon: string;
  label: string;
  desc: string;
  buttonLabel: string;
  onActionClick: () => void;
}

const Content: React.FC<ContentProps> = ({
  icon,
  label,
  desc,
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
        <Button onClick={onActionClick} variant="destructive">
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
  const { openModal: openSettingModal } = useProfileSettingModal();

  const onDeleteAccountClick = () => {
    openSettingModal("deleteAccountConfirmation");
  };
  const onResetAccountClick = () => {
    openSettingModal("resetAccount");
  };
  return (
    <div className="flex flex-col gap-4  px-3">
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
              variant={item.connected ? "destructive" : "default"}
            >
              {item.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {/* <Content
          label="Reset Account"
          desc="Once you do, all your completed challenges, achievements, and earned points will be permanently lost and cannot be recovered."
          buttonLabel="Reset your account"
          icon={Assets.Svgs.ResetAccount}
          onActionClick={onResetAccountClick}
        /> */}
        <Content
          label="Delete Account"
          desc="This action will permanently remove all your data, progress, and achievements from Funcsters, and you won’t be able to recover them later."
          buttonLabel="Delete your account"
          icon={Assets.Svgs.DeleteAccount}
          onActionClick={onDeleteAccountClick}
        />
      </div>
    </div>
  );
};
