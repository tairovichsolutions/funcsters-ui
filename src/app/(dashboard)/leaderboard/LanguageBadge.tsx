import React from 'react';
import { Iconify } from "@/components/ui/iconify";
import { LANGUAGE_ICON_MAP } from "@/constants/Language";

interface TechIconProps {
  name: string;
  className?: string; // Allows you to pass Tailwind classes like 'w-6 h-6'
}

export function LanguageBadge({ name, className = "w-6 h-6" }: TechIconProps) {
  const normalizedKey = name.toLowerCase().trim();
  const iconConfig = LANGUAGE_ICON_MAP[normalizedKey];

  if (!iconConfig) {
    // Fallback if language icon doesn't exist
    return (
      <span 
        className={`flex items-center justify-center bg-gray-200 text-gray-600 text-[10px] font-bold rounded cursor-help ${className}`} 
        data-tooltip-id="lang-tooltip"
        data-tooltip-content={name}
      >
        {name.substring(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <div 
      data-tooltip-id="lang-tooltip"
      data-tooltip-content={iconConfig.label} 
      className="flex items-center justify-center cursor-help"
    >
      <Iconify iconName={iconConfig.iconName} className={className} />
    </div>
  );
}