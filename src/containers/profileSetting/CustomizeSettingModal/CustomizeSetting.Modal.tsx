import React from "react";
import { useSafeArray } from "@/hooks";
import { AccountStatus } from "./AccountStatus";
import { ChangePassword } from "./ChangePassword";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="  h-full flex flex-col">
      <div className="relative w-full mb-5 shrink-0  bg-[#E5EDF4] dark:bg-[#FFFFFF1A] grid grid-cols-3 gap-1.5 p-1.5 rounded-md overflow-hidden">
        {TabsItems.map((item) => (
          <div key={item.id} className="relative">
            <button
              onClick={() => setActiveTab(item.value)}
              className={`relative w-full cursor-pointer text-xs py-[9px] rounded-md font-medium transition-colors duration-200 ${
                activeTab === item.value
                  ? "text-white"
                  : "text-[#737B83] hover:bg-[#737B83]/10"
              }`}
            >
              <AnimatePresence>
                {activeTab === item.value && (
                  <motion.span
                    layoutId="activeTabBg"
                    className="absolute inset-0 rounded-md bg-[#008CFF]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{item.label}</span>
            </button>
          </div>
        ))}
      </div>

      <div className=" h-full  ">
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
