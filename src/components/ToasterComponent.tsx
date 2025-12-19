import React from "react";
import { Toaster } from "react-hot-toast";

export const ToasterComponent = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          borderRadius: "8px",
          width: "400px",
        },
        className:
          "text-sm dark:bg-[#0C253B]! p-3! text-start dark:text-white! w-fit! max-w-[370px]!  ",
      }}
    />
  );
};
