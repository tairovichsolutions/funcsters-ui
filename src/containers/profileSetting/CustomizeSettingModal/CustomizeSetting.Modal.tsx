import React from "react";
import { cn } from "@/lib";
import { OAUTH2_BASE_URL } from "@/constants/oauth";
import { SvgColor } from "@/components";
import { AccountStatus } from "./AccountStatus";
import { ChangePassword } from "./ChangePassword";
import { Tabs, TabsItems } from "./ProfileSetting.constant";
import { PersonalInformation } from "./PersonalInformation";
import { useGetUserProfile } from "@/queries/useGetUserProfile";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";
import { Modal, Button } from "@/components/ui";
import { Iconify } from "@/components/ui/iconify";
import type { ConnectionItem } from "./AccountStatus.constant";


export const CustomizeSettingModal = () => {
  const { data, refetch } = useGetUserProfile();
  const user = data?.data?.user;
  const { setAuthError, authError } = useProfileSettingModal();
  const [pendingDisconnect, setPendingDisconnect] = React.useState<
    string | null
  >(null);
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const connections: ConnectionItem[] = React.useMemo(
    () => [
      {
        id: "linkedin",
        name: "LinkedIn",
        connected: !!user?.linkedInId,
        identifier: user?.linkedInEmail,
        Icon: "skill-icons:linkedin",
      },
      {
        id: "github",
        name: "GitHub",
        connected: !!user?.githubId,
        identifier: user?.githubUsername,
        Icon: "mdi:github",
      },
      {
        id: "google",
        name: "Google",
        connected: !!user?.googleId,
        identifier: user?.googleEmail,
        Icon: "logos:google-gmail",
      },
    ],
    [user],
  );

  const handleToggle = async (id: string) => {
    setAuthError(null);
    setSuccessMessage(null);
    const connection = connections.find((c) => c.id === id);
    if (connection?.connected) {
      setPendingDisconnect(id);
    } else {
      // Connect flow: open OAuth popup through secure Next.js proxy
      // The proxy reads the httpOnly accessToken cookie and passes it
      // to the backend as a verified JWT — no forgeable email parameter
      const url = `/api/auth/connect/${id}?display=popup`;
      const width = 500,
        height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      window.open(
        url,
        "oauth-popup",
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      const listener = (event: MessageEvent) => {
        // SECURITY: Only accept messages from our backend origin
        const expectedOrigin = new URL(OAUTH2_BASE_URL).origin;
        if (event.origin !== expectedOrigin) return;
        if (event.data?.type === "PORTAL_AUTH_RESULT") {
          window.removeEventListener("message", listener);
          if (event.data.status === "success") {
            setSuccessMessage(
              `${connections.find((c) => c.id === id)?.name || id} connected successfully!`,
            );
            refetch();
          } else {
            setAuthError(event.data.message);
          }
        }
      };
      window.addEventListener("message", listener);
    }
  };

  const confirmDisconnect = async () => {
    if (!pendingDisconnect) return;
    setIsDisconnecting(true);
    setAuthError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/auth/disconnect/${pendingDisconnect}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json();
        if (res.status === 400 || res.status === 409) {
          setAuthError("final_method_required");
        } else {
          setAuthError(body.message || "Failed to disconnect account.");
        }
      } else {
        setSuccessMessage(
          `${connections.find((c) => c.id === pendingDisconnect)?.name || pendingDisconnect} disconnected successfully!`,
        );
        refetch();
      }
    } catch {
      setAuthError("An error occurred. Please try again.");
    } finally {
      setIsDisconnecting(false);
      setPendingDisconnect(null);
    }
  };

  const [activeTab, setActiveTab] = React.useState(Tabs.PersonalInformation);

  const isPersonalInformationTab = activeTab === Tabs.PersonalInformation;
  const isAccountStatusTab = activeTab === Tabs.AccountStatus;
  const isChangePasswordTab = activeTab === Tabs.ChangePassword;

  const providerName =
    connections.find((c) => c.id === pendingDisconnect)?.name ||
    "social account";

  return (
    <>
      <div className="h-full flex gap-5">
        <div className=" w-52 flex flex-col shrink-0 h-fit gap-3">
          <h2 className=" font-semibold text-2xl">Setting</h2>
          <div className=" flex flex-col gap-3">
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
                    activeTab === item.value ? "bg-white!" : "bg-[#737B83]!",
                  )}
                />
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className=" h-full w-full ">
          {isPersonalInformationTab && <PersonalInformation />}
          {isAccountStatusTab && (
            <AccountStatus
              connections={connections}
              onConnectionClick={handleToggle}
              authError={authError}
              successMessage={successMessage}
            />
          )}
          {isChangePasswordTab && <ChangePassword />}
        </div>
      </div>

      {/* Disconnect confirmation modal — only mount when needed */}
      {pendingDisconnect && (
        <Modal
          open={true}
          onClose={() => setPendingDisconnect(null)}
          className="!max-w-[440px] p-0"
          showClose={false}
        >
          <div className="p-6 flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-full h-fit shrink-0">
                <Iconify
                  iconName="mdi:alert-circle"
                  className="text-red-500 size-6"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold dark:text-white">
                  Disconnect
                </h3>
                <p className="text-sm text-secondary-text leading-relaxed">
                  Are you sure you want to disconnect your{" "}
                  <span className="font-semibold text-black dark:text-white">
                    {providerName}
                  </span>{" "}
                  social account?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <Button
                variant="tertiary"
                onClick={() => setPendingDisconnect(null)}
                className="px-6!"
                disabled={isDisconnecting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDisconnect}
                loading={isDisconnecting}
                className="px-6!"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
