"use client";
import React, { createContext, useContext, useState } from "react";

interface AuthModalContextType {
  activeModal: string | null;
  openModal: (name: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalsProvider = ({
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

export const useAuthModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalsProvider");
  }
  return context;
};
