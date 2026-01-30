"use client";
import { Modal } from "@/components/ui/modal";
import { EmailSendModal } from "./EmailSend.Modal";
import { LoginFormModal } from "./LoginForm.Modal";
import { SignUpFormModal } from "./SignUpForm.Modal";
import { CongratulationModal } from "./Congratulation.Modal";
import { useAuthModal } from "@/providers/AuthModalsProvider";
import { NewPasswordFormModal } from "./NewPasswordForm.Modal";
import { LoginSuccessfullyModal } from "./LoginSuccessfully.Modal";
import { ResetPasswordFormModal } from "./ResetPasswordForm.modal";
import { ForgotPasswordFormModal } from "./ForgotPasswordForm.Modal";
import { SignUpSuccessfullyModal } from "./SignUpSuccessfully.Modal";
import { LoginRequiredModal } from "@/components/LoginRequiredModal";
import { DeleteAccountConfirmationModal } from "../profileSetting/DeleteAccountConfirmation.Modal";

export const AuthModal = () => {
  const { activeModal, closeModal } = useAuthModal();

  let modalSize: "sm" | "md" | "lg" | "2xl" | "xl" = "md";

  switch (activeModal) {
    case "login":
      modalSize = "2xl";
      break;
    case "signUp":
      modalSize = "2xl";
      break;
    case "forgotPassword":
      modalSize = "xl";
      break;
    case "resetPassword":
      modalSize = "xl";
      break;
    case "newPassword":
      modalSize = "xl";
      break;
    case "loginSuccessfully":
      modalSize = "md";
      break;
    case "signUpSuccessfully":
      modalSize = "md";
      break;
    case "congratulation":
      modalSize = "md";
      break;
    case "emailSend":
      modalSize = "md";
      break;

    case "deleteAccount":
      modalSize = "md";
      break;

    case "loginRequiredModal":
      modalSize = "md";
      break;

    default:
      modalSize = "md";
      break;
  }

  return (
    <Modal
      open={!!activeModal}
      onClose={closeModal}
      size={modalSize}
      showClose={false}
      contentClass="p-0!"
    >
      {activeModal === "login" && <LoginFormModal />}
      {activeModal === "signUp" && <SignUpFormModal />}
      {activeModal === "emailSend" && <EmailSendModal />}
      {activeModal === "newPassword" && <NewPasswordFormModal />}
      {activeModal === "congratulation" && <CongratulationModal />}
      {activeModal === "resetPassword" && <ResetPasswordFormModal />}
      {activeModal === "loginRequiredModal" && <LoginRequiredModal />}
      {activeModal === "forgotPassword" && <ForgotPasswordFormModal />}
      {activeModal === "loginSuccessfully" && <LoginSuccessfullyModal />}
      {activeModal === "signUpSuccessfully" && <SignUpSuccessfullyModal />}
      {activeModal === "deleteAccount" && <DeleteAccountConfirmationModal />}
    </Modal>
  );
};
