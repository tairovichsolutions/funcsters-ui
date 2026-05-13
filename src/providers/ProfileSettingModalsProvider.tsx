"use client";
import React, { createContext, useContext, useState } from "react";

const errorMessages: Record<string, string> = {
  email_exists:
    "An account already exists with this e-mail address. Please sign in to that account first, then connect your account from settings.",
  social_already_linked:
    "This social account is already linked to another profile. Please disconnect it from that account first.",
  email_belongs_to_other_user:
    "This social account is already linked to another profile. Please disconnect it from that account first.",
  final_method_required:
    "You must set a password or connect an alternate social account before disconnecting your final login method.",
};

interface ProfileSettingModalContextType {
  closeModal: () => void;
  activeModal: string | null;
  authError: string | null;
  openModal: (name: string) => void;
  setAuthError: (error: string | null) => void;
}

const ModalContext = createContext<ProfileSettingModalContextType | undefined>(
  undefined
);

export const ProfileSetingModalsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const openModal = (name: string) => {
    setAuthError(null);
    setActiveModal(name);
  };
  const closeModal = () => {
    setAuthError(null);
    setActiveModal(null);
  };

  const setAuthErrorForce = (errorCode: string | null) => {
    if (!errorCode) {
      setAuthError(null);
      return;
    }
    setAuthError(errorMessages[errorCode] || errorCode);
  };

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        openModal,
        closeModal,
        authError,
        setAuthError: setAuthErrorForce,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useProfileSettingModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useProfileSettingModal must be used within an useProfileSettingModal"
    );
  }
  return context;
};
