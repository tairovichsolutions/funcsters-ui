import { FocusText } from "@/components";
import { Slider } from "./Slider";
import { TextFadeAnimation } from "@/components/ui/text-fade-animation";
import { Bold } from "@/components/ui/bold-text";

export const Programinglanguages = () => {
  return (
    <div className="section-container-class! px-0">
      <div className="flex justify-center items-center gap-5 flex-col">
        <TextFadeAnimation
          delay={0.1}
          direction="left"
          className="section-heading-class leading-tight text-center"
        >
          <FocusText>Explore</FocusText> and get fluent in programing{" "}
          <FocusText>languages!</FocusText>{" "}
        </TextFadeAnimation>
        <TextFadeAnimation direction="left" delay={0.2}>
          <p className="section-sub-heading-class">
            Take on <Bold className="font-semibold">real coding </Bold>
            challenges, sharpen your logic, and build the skills to
            <Bold className="font-semibold"> level up</Bold> — one solution at a
            time.
          </p>
        </TextFadeAnimation>
      </div>

      <div>
        <Slider />
      </div>
    </div>
  );
};
