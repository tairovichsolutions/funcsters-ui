"use client";
import { Modal } from "@/components/ui/modal";
import { ResetAccountModal } from "./resetAccount.Modal";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";
import { DeleteAccountConfirmationModal } from "./DeleteAccountConfirmation.Modal";
import { ChangePasswordSuccessfullyModal } from "./ChangePasswordSuccessfully.Modal";
import { CustomizeSettingModal } from "./CustomizeSettingModal/CustomizeSetting.Modal";

export const ProfileSettingModal = () => {
  const { activeModal, closeModal } = useProfileSettingModal();

  const showHeader = activeModal === "setting";

  return (
    <Modal
      open={!!activeModal}
      onClose={closeModal}
      size="md"
      title={showHeader ? "Settings" : ""}
      showClose={showHeader}
      className="h-[700px]"
    >
      {activeModal === "setting" && <CustomizeSettingModal />}
      {activeModal === "deleteAccountConfirmation" && (
        <DeleteAccountConfirmationModal />
      )}
      {activeModal === "resetAccount" && <ResetAccountModal />}
      {activeModal === "ChangePasswordSuccessfullyModal" && (
        <ChangePasswordSuccessfullyModal />
      )}
    </Modal>
  );
};
