/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib";
import { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { Assets } from "@/constants/assets";
import { SocialLoginButtons } from "@/containers/AuthModals/SocialLoginButtons";
import { usePathname } from "next/navigation";

interface RegistrationLayoutType {
  image?: string;
  reverse?: boolean;
  className?: string;
  children: ReactNode;
}

export const RegistrationLayout = ({
  image,
  reverse,
  children,
  className,
}: RegistrationLayoutType) => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    localStorage.setItem("redirectUrl", pathname);
  }, [pathname]);

  return (
    <div className={cn("h-full grid grid-cols-2 w-full!", className)}>
      <motion.div
        layout
        initial={{ opacity: 0, x: reverse ? -140 : 140 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: reverse ? -40 : 40 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        className={cn(
          "flex flex-col justify-center ",
          reverse ? "order-2" : " order-1 shadow-2xl",
        )}
      >
        <div className={cn("flex p-6", reverse ? "order-2" : "order-1 ")}>
          {children}
        </div>
      </motion.div>
      <motion.div
        key={reverse ? "right-image" : "left-image"}
        layout
        initial={{ opacity: 0, x: reverse ? 140 : -140 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: reverse ? 40 : -40 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        className={cn(
          "px-6 flex flex-col justify-center py-10",
          reverse ? "order-1 shadow-2xl" : "order-2",
        )}
      >
        <img
          alt="login_image"
          src={image || Assets.Images.LoginImage}
          className="object-contain w-full h-80"
        />

        <div className="flex flex-col gap-5 mt-5 items-center">
          <h2 className="font-semibold text-sm">Continue with </h2>
          <SocialLoginButtons />
        </div>
      </motion.div>
    </div>
  );
};
