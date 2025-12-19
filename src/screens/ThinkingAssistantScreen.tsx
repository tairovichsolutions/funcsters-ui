/* eslint-disable @next/next/no-img-element */
import { Assets } from "@/constants/assets";
import { FocusText } from "@/components/ui/focus-text";
import { CodeSkeleton, ProblemIntuition } from "@/containers/ThinkingAssistant";

export const ThinkingAssistantScreen = () => {
  return (
    <div className=" space-y-5 ">
      <div className=" flex justify-between items-center gap-4">
        <div className=" space-y-3">
          <h1 className="text-[20px] font-semibold leading-none">
            Thinking Assistant!
          </h1>

          <p className="text-sm leading-tight">
            <FocusText>Stuck</FocusText> on how to begin?
            <FocusText> Get structured guidance </FocusText>to shape your logic
            — not the full solution. Thinking Assistance helps you{" "}
            <FocusText> break </FocusText> down the problem, plan your code, and
            <FocusText> strengthen </FocusText> your problem-solving skills{" "}
            <FocusText>step by step</FocusText>.
          </p>
        </div>
        <div className="shrink-0">
          <img
            src={Assets.Images.ThinkingAssistant}
            className="h-40 w-auto object-contain"
            alt="hand_coding"
          />
        </div>
      </div>

      <ProblemIntuition />
      <CodeSkeleton />
    </div>
  );
};
