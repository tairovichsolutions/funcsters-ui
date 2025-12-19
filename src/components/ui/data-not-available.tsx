import { cn } from "@/lib";
import { Iconify } from "./iconify";

interface DataNotAvailableType {
  text?: string;
  iconName?: string;
  iconClass?: string;
  textClass?: string;
  containerClass?: string;
}

export const DataNotAvailable = ({
  iconClass,
  textClass,
  containerClass,
  text = "No challenges found",
  iconName = "ic:round-manage-search",
}: DataNotAvailableType) => {
  return (
    <div
      className={cn(
        "py-20 flex flex-col justify-center text-gray-400 dark:text-gray-600 items-center text-center",
        containerClass
      )}
    >
      <Iconify iconName={iconName} className={cn("size-16", iconClass)} />
      <h2 className={cn("font-semibold text-base mt-2", textClass)}>{text}</h2>
    </div>
  );
};
