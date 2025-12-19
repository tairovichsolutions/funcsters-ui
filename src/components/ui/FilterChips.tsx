import { cn } from "@/lib";
import { X } from "lucide-react";
import { useSafeArray } from "@/hooks";

interface FilterChipsProps {
  WrapperclassName?: string;
  className?: string;
  filters: string[];
  onRemove?: (filter: string) => void;
  onClearAll?: () => void | undefined;
}

export const FilterChips = ({
  WrapperclassName,
  className,
  filters,
  onRemove,
  onClearAll,
}: FilterChipsProps) => {
  const Items = useSafeArray(filters);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", WrapperclassName)}>
      {Items?.length > 0 &&
        Items?.map((filter) => (
          <div
            key={filter}
            className={cn(
              "flex items-center justify-between gap-5 bg-medium-gray/20 text-black font-semibold text-sm px-2 py-1 rounded-full transition",
              className
            )}
          >
            <h2>{filter}</h2>
            <button
              onClick={() => onRemove?.(filter)}
              className="text-black/60 transition cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      {Items?.length > 0 && (
        <button
          onClick={onClearAll}
          className="text-sm font-bold text-black underline cursor-pointer  "
        >
          Clear Filter
        </button>
      )}
    </div>
  );
};
