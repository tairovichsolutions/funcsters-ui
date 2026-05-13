"use client";
import React, { createContext, useContext, useState } from "react";

const errorMessages: Record<string, string> = {
  email_exists:
    "An account already exists with this e-mail address. Please sign in to that account first, then connect your account from settings.",
  social_already_linked:
    "This social account is already linked to another profile. Please disconnect it from that account first.",
  email_belongs_to_other_user:
    "This social account belongs to a different email address already registered on our platform. Please log in with that account instead.",
};

interface AuthModalContextType {
  activeModal: string | null;
  authError: string | null;
  openModal: (name: string) => void;
  closeModal: () => void;
  setAuthError: (error: string | null) => void;
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetOtp, setResetOtp] = useState<string>("");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get("error");
    if (errorCode && errorMessages[errorCode]) {
      setAuthError(errorMessages[errorCode]);
      setActiveModal("login");

      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

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
        resetEmail,
        setResetEmail,
        resetOtp,
        setResetOtp,
      }}
    >
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
