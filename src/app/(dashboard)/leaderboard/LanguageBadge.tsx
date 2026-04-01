import React from 'react';
import { JavaScriptIcon } from '../../../../public/svgs/LanguageBadgeSvg/JavaScriptIcon';
import { PythonIcon } from '../../../../public/svgs/LanguageBadgeSvg/PythonIcon';

interface TechIconProps {
  name: string;
  className?: string; // Allows you to pass Tailwind classes like 'w-6 h-6'
}

export function LanguageBadge({ name, className = "w-6 h-6" }: TechIconProps) {
  // Normalize the name to lowercase so "JS", "js", and "JavaScript" all work
  switch (name.toLowerCase()) {
    case 'js':
    case 'javascript':
      return (
        <JavaScriptIcon className={className} />
      );

    case 'py':
    case 'python':
      return (
        <PythonIcon className={className} />
      );

    default:

      return null;
  }
}