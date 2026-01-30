"use client";
import { Modal } from "@/components/ui/modal";
import { useProfileSettingModal } from "@/providers/ProfileSettingModalsProvider";
import { CustomizeSettingModal } from "./CustomizeSettingModal/CustomizeSetting.Modal";
import { DeleteAccountConfirmationModal } from "./DeleteAccountConfirmation.Modal";

export const ProfileSettingModal = () => {
  const { activeModal, closeModal } = useProfileSettingModal();

  const showHeader = activeModal === "setting";

  return (
    <Modal
      size="md"
      open={!!activeModal}
      onClose={closeModal}
      showClose={showHeader}
      className="h-[600px] min-w-[800px]! "
    >
      {activeModal === "setting" && <CustomizeSettingModal />}
      {activeModal === "deleteAccountConfirmation" && (
        <DeleteAccountConfirmationModal />
      )}
      {/* {activeModal === "resetAccount" && <ResetAccountModal />} */}
      {/* {activeModal === "ChangePasswordSuccessfullyModal" && (
        <ChangePasswordSuccessfullyModal />
      )} */}
    </Modal>
  );
};
