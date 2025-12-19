/* eslint-disable @next/next/no-img-element */
import { Assets } from "@/constants/assets";

export const NoOutputResult = () => {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className=" space-y-3">
        <h1 className="text-[20px] font-semibold leading-none">
          No Result Yet!
        </h1>

        <p className="text-sm font-semibold leading-tight">
          You haven’t <span className="text-primary">run</span> your code yet —
          <span className="text-primary">write</span> your solution and hit{" "}
          <span className="text-primary">Run</span> to see the{" "}
          <span className="text-primary">output</span> in the terminal. Results
          only <span className="text-primary">appear</span> once your code is{" "}
          <span className="text-primary">executed</span>.
        </p>
      </div>
      <div className="shrink-0">
        <img
          src={Assets.Images.HandCoding}
          className="h-24 w-auto object-contain"
          alt="hand_coding"
        />
      </div>
    </div>
  );
};
