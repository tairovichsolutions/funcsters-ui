"use client";
import React, { createContext, useContext, useState } from "react";

interface ProfileSettingModalContextType {
  closeModal: () => void;
  activeModal: string | null;
  openModal: (name: string) => void;
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

  const openModal = (name: string) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
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
