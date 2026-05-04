"use client";
import React, { createContext, useContext, useState } from "react";

interface AuthModalContextType {
  activeModal: string | null;
  openModal: (name: string) => void;
  closeModal: () => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  resetOtp: string;
  setResetOtp: (otp: string) => void;
}

const ModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetOtp, setResetOtp] = useState<string>("");

  const openModal = (name: string) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal, resetEmail, setResetEmail, resetOtp, setResetOtp }}>
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
