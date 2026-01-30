import React from "react";
import { cn } from "@/lib";
import { useSafeArray } from "@/hooks";
import { SvgColor } from "@/components";
import { AccountStatus } from "./AccountStatus";
import { ChangePassword } from "./ChangePassword";
import { Tabs, TabsItems } from "./ProfileSetting.constant";
import { initialConnections } from "./AccountStatus.constant";
import { PersonalInformation } from "./PersonalInformation";

export const CustomizeSettingModal = () => {
  const connectionArray = useSafeArray(initialConnections);
  const [connections, setConnections] = React.useState(connectionArray);
  const handleToggle = (id: string) => {
    setConnections((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, connected: !item.connected } : item
      )
    );
  };

  const [activeTab, setActiveTab] = React.useState(Tabs.PersonalInformation);

  const isPersonalInformationTab = activeTab === Tabs.PersonalInformation;
  const isAccountStatusTab = activeTab === Tabs.AccountStatus;
  const isChangePasswordTab = activeTab === Tabs.ChangePassword;
  return (
    <div className="h-full flex  gap-5">
      <div className=" w-52 flex  flex-col shrink-0 h-fit gap-3">
        <h2 className=" font-semibold text-2xl">Setting</h2>
        <div className=" flex  flex-col   gap-3">
          {TabsItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.value)}
              className={`relative w-full flex items-center gap-2  text-start cursor-pointer text-xs py-[9px] px-3 rounded-md font-medium transition-colors duration-200 ${
                activeTab === item.value
                  ? "text-white bg-[#008CFF]"
                  : "text-[#737B83] hover:bg-[#737B83]/10"
              }`}
            >
              <SvgColor
                src={item.svgImage}
                className={cn(
                  activeTab === item.value ? "bg-white!" : "bg-[#737B83]!"
                )}
              />
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className=" h-full w-full  ">
        {isPersonalInformationTab && <PersonalInformation />}
        {isAccountStatusTab && (
          <AccountStatus
            connections={connections}
            onConnectionClick={handleToggle}
          />
        )}
        {isChangePasswordTab && <ChangePassword />}
      </div>
    </div>
  );
};
