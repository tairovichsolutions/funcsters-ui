/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import GlobeIcon from "../../../../public/svgs/leaderBoard/GlobeIcon";

// Define the shape of individual options
export interface DropdownOption {
  value: string;
  label: string;
  image?: string | null;
}

// Define the props for the component
interface CountryDropdownV2Props {
  label?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}

export default function CountryDropdownV2({ 
  label, 
  value, 
  options = [], 
  onChange 
}: CountryDropdownV2Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find the currently selected option to display its label, fallback to the first option if none match
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative    flex flex-col gap-1.5 w-full sm:w-max" ref={dropdownRef}>
      {/* Optional Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Main Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full h-[46px] sm:w-max px-4 py-2.5 items-center justify-between gap-3 bg-[#F8F9FB]  dark:bg-[#282A2E]! dark:border-0  hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[200px]"
      >
        <div className="flex items-center gap-2 truncate">
          {/* Optional: Render image/icon if passed in the option object */}
          {selectedOption?.image && (
            <img
              src={selectedOption.image}
              alt={selectedOption.label}
              className="w-5 h-5 object-cover rounded-full shadow-sm"
            />
          )}
          <span className="truncate text-gray-900 dark:text-white">
            {selectedOption?.label || "Select..."}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-gray-400 dark:text-[#AFAFAF] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 mt-1 w-full min-w-[200px] bg-background border border-gray-100 dark:border-[#2A2C30] dark:bg-[#232629] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto py-1">
          {options.map((option, index) => {
            const isSelected = value === option.value;
            
            return (
              <button
                key={`${option.value}-${index}`}
                type="button"
                onClick={() => {
                  // EXACT MATCH TO NATIVE SELECT BEHAVIOR:
                  // Passes the underlying 'value' up to the parent component
                  onChange(option.value); 
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                  isSelected
                    ? "bg-blue-50 dark:bg-transparent dark:text-white text-blue-700 font-medium"
                    : "text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {/* Optional: Render image/icon in the list */}
                  {option.image ? (
                    <img
                      src={option.image}
                      alt={option.label}
                      className="w-5 h-5 object-cover rounded-full shadow-sm"
                    />
                  ) : <GlobeIcon />}
                  <span className="truncate">{option.label}</span>
                </div>
                
                {/* Visual Checkbox matching your image */}
                <div 
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                    isSelected 
                      ? "border-blue-600 bg-blue-600  " 
                      : "border-gray-300 bg-white dark:border-[#DDDDDF] dark:bg-transparent "
                  }`}
                >
                  {isSelected && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}