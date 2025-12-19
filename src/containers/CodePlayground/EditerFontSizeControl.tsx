import { cn } from "@/lib";
import { Button } from "@/components";
import { Minus, Plus } from "lucide-react";
import { useEditorSettings } from "@/context/EditorSettingsContext";

export const EditerFontSizeControl = () => {
  const { settings, increaseFontSize, decreaseFontSize } = useEditorSettings();
  return (
    <div className="bg-[#0050921A] dark:bg-[#FFFFFF1A]! px-3 h-[35px] shadow-sm rounded-md text-xs flex items-center gap-1.5 ">
      <Button
        size="icon"
        type="button"
        variant="ghost"
        onClick={decreaseFontSize}
        className="size-4 rounded-xs!"
        aria-label="Decrease font size"
      >
        <Minus className=" size-3.5" strokeWidth={3.5} />
      </Button>

      <span className={cn("text-center w-8 font-medium")}>
        {settings.fontSize}px
      </span>

      <Button
        size="icon"
        type="button"
        variant="ghost"
        onClick={increaseFontSize}
        className="size-4 rounded-xs!"
        aria-label="Increase font size"
      >
        <Plus className=" size-3.5" strokeWidth={3} />
      </Button>
    </div>
  );
};
