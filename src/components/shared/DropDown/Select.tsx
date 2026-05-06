import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";


interface SelectProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
}

export function Select({ label, value, options, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find the selected label for the trigger button, fallback to the label prop
  const selectedLabel = options.find((opt) => opt.value === value)?.label || label;

  return (
    <div className="relative inline-block w-full   sm:w-50" ref={dropdownRef}>
      {/* Trigger Button (Matches your old select's look) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full h-[46px] bg-[#F8F9FB] dark:bg-background items-center justify-between rounded-lg border border-border  py-2 pl-3 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <span className="truncate text-[15px] ">{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-neutral-05   transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* New Dropdown Menu with Checkboxes */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[200px] rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="py-3.5 max-h-64 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = value === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false); // Close dropdown after selection
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span className="text-xs ">{opt.label}</span>

                  {/* Visual Checkbox */}
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${isSelected
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300 bg-white"
                      }`}
                  >
                    {isSelected && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7L6 10L11 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}