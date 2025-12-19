import { cn } from "@/lib";
import { CSSProperties, ReactNode } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

interface ScrollableType
  extends React.ComponentPropsWithoutRef<typeof ScrollArea.Root> {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}

export const Scrollable = ({
  style,
  onClick,
  children,
  className,
}: ScrollableType) => {
  return (
    <ScrollArea.Root
      className={cn("size-full overflow-hidden", className)}
      style={style}
      onClick={onClick}
    >
      <ScrollArea.Viewport className="size-full overflow-auto">
        {children}
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical" className="w-1 lg:w-1.5">
        <ScrollArea.Thumb className="relative flex-1 rounded bg-gray-300/50 dark:bg-gray-700/50 hover:bg-gray-800/50 transition-colors" />
      </ScrollArea.Scrollbar>

      <ScrollArea.Scrollbar
        orientation="horizontal"
        className="h-1 lg:h-1.5 flex flex-col"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded bg-gray-300/50 dark:bg-gray-700/50 hover:bg-gray-800/50 transition-colors" />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
};
