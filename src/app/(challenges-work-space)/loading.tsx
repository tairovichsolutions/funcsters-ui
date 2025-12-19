"use client";
import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="w-full h-full overflow-hidden flex justify-center items-center">
      <BarLoader height={7} width={200} speedMultiplier={0.8} color="#018CFF" />
    </div>
  );
}
