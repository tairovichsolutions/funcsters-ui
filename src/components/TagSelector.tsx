import {
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui";
import React from "react";
import { cn } from "@/lib";
import { ChevronDown } from "lucide-react";

interface TagSelectorProps {
  className?: string;
  label: string;
  tags: { id: string; label: string }[];
  value?: string[];
  multiple?: boolean;
  onChange?: (selected: string[]) => void;
}

export const TagSelector = React.memo(
  ({
    className,
    label,
    tags,
    value = [],
    multiple = true,
    onChange,
  }: TagSelectorProps) => {
    const handleSelect = (id: string) => {
      let newValue: string[];

      if (multiple) {
        newValue = value.includes(id)
          ? value.filter((v) => v !== id)
          : [...value, id];
      } else {
        newValue = value.includes(id) ? [] : [id];
      }

      onChange?.(newValue);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "border font-inter text-nowrap shrink-0 font-medium text-sm border-searchInputBorder! rounded-lg flex justify-between items-center gap-4 px-3 py-2 cursor-pointer",
              className
            )}
          >
            <span className="truncate!">{label}</span>
            <ChevronDown color="#878787" size={18} className="shrink-0" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <div className="flex flex-col gap-1 p-1 min-w-[160px]">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex justify-between items-center gap-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-100/10 px-2 py-1.5 rounded-sm"
                  onClick={() => handleSelect(tag.id)}
                >
                  <p className="font-inter font-normal text-xs text-black dark:text-gray-100">
                    {tag.label}
                  </p>
                  <Checkbox checked={value?.includes(tag.id)} />
                </div>
              ))
            ) : (
              <div className="px-2 py-1.5 text-xs text-gray-400 text-center">
                Data not available
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
