/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  SendHorizonal, Play, Pen,
  Bold, Italic, List, ListOrdered, Quote, Code, Link2
} from "lucide-react";
import { commands } from "@uiw/react-md-editor";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface TextEditorProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export default function TextEditorPrimary({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Share Your Thoughts"
}: TextEditorProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleTextChange = (newValue?: string) => {
    const text = newValue || "";
    if (text.length <= 1000) {
      onChange(text);
    } else {
      onChange(text.slice(0, 1000));
    }
  };

  if (!hasMounted) {
    return <div className="w-full h-[200px] bg-[#F5F8FB] dark:bg-[#282A2E] animate-pulse rounded-xl border border-slate-200 dark:border-slate-800" />;
  }

  const gapCommand = {
    name: "gap",
    keyCommand: "gap",
    render: () => <div className="w-2 shrink-0 border-none" aria-hidden="true" />,
  };

  const customBold = { ...commands.bold, icon: <Bold size={16} className="text-[#808080]" /> };
  const customItalic = { ...commands.italic, icon: <Italic size={16} className="text-[#808080]" /> };
  const customHeading = {
    ...commands.heading,
    execute: (state: any, api: any) => {
      const targetText = state.selectedText || "Heading";
      api.replaceSelection(`## ${targetText}`);
    },
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="15" viewBox="0 0 19 15" fill="none">
        <path
          d="M5.75 7.5H13.25"
          stroke="#808080"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.75 12.5V2.5"
          stroke="#808080"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.25 12.5V2.5"
          stroke="#808080"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  };

  const customLinkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="15" viewBox="0 0 19 15" fill="none">
      <path
        d="M8.25 8.12547C8.51841 8.4843 8.86085 8.78121 9.25409 8.99605C9.64734 9.2109 10.0822 9.33866 10.5292 9.37068C10.9761 9.40269 11.4247 9.3382 11.8446 9.18158C12.2644 9.02496 12.6457 8.77989 12.9625 8.46297L14.8375 6.58797C15.4067 5.99859 15.7217 5.2092 15.7146 4.38984C15.7075 3.57047 15.3788 2.78668 14.7994 2.20728C14.22 1.62788 13.4362 1.29923 12.6169 1.29211C11.7975 1.28499 11.0081 1.59997 10.4188 2.16922L9.34375 3.23797"
        stroke="#808080"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.7499 6.87526C10.4815 6.51643 10.139 6.21952 9.74579 6.00468C9.35254 5.78983 8.91769 5.66206 8.47072 5.63005C8.02376 5.59804 7.57514 5.66253 7.15529 5.81915C6.73544 5.97577 6.35418 6.22084 6.03738 6.53776L4.16238 8.41276C3.59314 9.00214 3.27815 9.79153 3.28527 10.6109C3.29239 11.4303 3.62105 12.214 4.20045 12.7934C4.77985 13.3728 5.56364 13.7015 6.383 13.7086C7.20237 13.7157 7.99175 13.4008 8.58113 12.8315L9.64988 11.7628"
        stroke="#808080"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  const visibleCommands = [
    customBold, gapCommand, customItalic, gapCommand, customHeading, gapCommand,
    { ...commands.unorderedListCommand, icon: <List size={16} className="text-[#808080]" /> }, gapCommand,
    { ...commands.orderedListCommand, icon: <ListOrdered size={16} className="text-[#808080]" /> }, gapCommand,
    { ...commands.quote, icon: <Quote size={16} className="text-[#808080]" /> }, gapCommand,
    { ...commands.code, icon: <Code size={16} className="text-[#808080]" /> }, gapCommand,
    { ...commands.link, icon: customLinkIcon }, gapCommand,
    commands.divider,
  ];

  const previewCommand = {
    name: "previewToggle",
    keyCommand: "previewToggle",
    render: (command: any, disabled: boolean) => {
      const isEditing = mode === "edit";
      return (
        <button
          type="button"
          onClick={() => setMode(isEditing ? "preview" : "edit")}
          className="flex text-[#4D4D4D]! items-center gap-2 p-3! py-4! rounded-md!  dark:bg-white bg-[#CDDDEE]!   hover:bg-blue-200 dark:hover:bg-slate-700  dark:text-slate-200  transition-colors ml-auto mr-1"
        >
          {isEditing ? <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6.00074 7.20005C6.66348 7.20005 7.20074 6.66279 7.20074 6.00005C7.20074 5.33731 6.66348 4.80005 6.00074 4.80005C5.338 4.80005 4.80074 5.33731 4.80074 6.00005C4.80074 6.66279 5.338 7.20005 6.00074 7.20005Z" fill="#4D4D4D" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.275391 6.00007C1.03994 3.5658 3.31412 1.80005 6.00072 1.80005C8.68729 1.80005 10.9615 3.56578 11.726 6.00003C10.9615 8.4343 8.68729 10.2 6.0007 10.2C3.31413 10.2 1.03996 8.43432 0.275391 6.00007ZM8.40074 6.00005C8.40074 7.32553 7.32622 8.40005 6.00074 8.40005C4.67525 8.40005 3.60074 7.32553 3.60074 6.00005C3.60074 4.67457 4.67525 3.60005 6.00074 3.60005C7.32622 3.60005 8.40074 4.67457 8.40074 6.00005Z" fill="#4D4D4D" />
          </svg> : <Pen size={14} />}
          <span className="text-xs font-semibold">{isEditing ? "Preview" : "Edit"}</span>
        </button>
      );
    },
  };

  return (
    <div className="w-full border  border-[#D9D9D9] dark:border-slate-800 rounded-xl overflow-hidden bg-[#F5F8FB] dark:bg-[#282A2E] shadow-sm font-sans transition-colors">

      <div data-color-mode="auto" className="custom-editor">
        <MDEditor
          value={(mode === "preview" && (!value || value.trim() === ""))
            ? "*You did not input anything...*"
            : value
          }
          onChange={handleTextChange}
          preview={mode}
          height={140}
          textareaProps={{ placeholder }}
          commands={visibleCommands}
          extraCommands={[previewCommand]}
          hideToolbar={false}
          visibleDragbar={false}
        />
      </div>

      {/* Footer with NO top border, matching the redesigned look */}
      <div className="flex justify-between items-center px-5 py-3 bg-[#F5F8FB] dark:bg-[#282A2E]">
        <span className={`text-xs font-bold ${value?.length === 1000 ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
          {value?.length} / 1000
        </span>
        <button type="button" onClick={onSubmit} className="  px-4 py-1.5 text-white bg-[#008CFF]  rounded-md transition-transform active:scale-90">
          Post Coment
        </button>
      </div>

      <style jsx global>{`
        /* --- LIGHT MODE --- */
        .custom-editor .w-md-editor { border: none !important; box-shadow: none !important; background-color: #F5F8FB !important; }
        .custom-editor .w-md-editor-toolbar { 
          background-color: #F5F8FB !important; 
          border-bottom: 1px solid #D9D9D9 !important; 
          padding: 14px 16px !important; /* Bigger Header */
        }
        .custom-editor .w-md-editor-toolbar ul { display: flex !important; align-items: center !important;  !important; }
        .custom-editor .w-md-editor-toolbar ul li button { color: #94a3b8 !important; }
        .custom-editor .w-md-editor-content { background-color: #F5F8FB !important; }
        .w-md-editor-text-input::placeholder { color: #808080 !important; }

        /* --- DARK MODE FIX --- */
        :global(.dark) .custom-editor .w-md-editor { background-color: #282A2E !important; }
        :global(.dark) .custom-editor .w-md-editor-toolbar { 
          background-color: #282A2E !important; 
          border-bottom: 1px solid #333638 !important; 
        }
        :global(.dark) .custom-editor .w-md-editor-content { background-color: #282A2E !important; }
        :global(.dark) .w-md-editor-text-input { color: #ffffff !important; background-color: #282A2E !important; }
        :global(.dark) .w-md-editor-preview { background-color: #282A2E !important; color: #ffffff !important; }
        :global(.dark) .wmde-markdown { background-color: transparent !important; color: #ffffff !important; }
        :global(.dark) .custom-editor .w-md-editor-toolbar ul li button { color: #6b7280 !important; }
        :global(.dark) .custom-editor .w-md-editor-toolbar ul li button:hover { color: #ffffff !important; background-color: #333638 !important; }
        
        .w-md-editor-text-input::-webkit-scrollbar { width: 4px; }
        .w-md-editor-text-input::-webkit-scrollbar-thumb { border-radius: 10px; background: #cbd5e1; }
        :global(.dark) .w-md-editor-text-input::-webkit-scrollbar-thumb { background: #374151; }

         /* Main Container */
  :global(.dark) .custom-editor .w-md-editor { 
    background-color: #282A2E !important; 
  }
  
  /* Toolbar */
  :global(.dark) .custom-editor .w-md-editor-toolbar { 
    background-color: #282A2E !important; 
    border-bottom: 1px solid #333638 !important; 
  }
  
  /* Content Area Background */
  :global(.dark) .custom-editor .w-md-editor-content { 
    background-color: #282A2E !important; 
  }

  /* Input Text Color - FORCING WHITE */
  :global(.dark) .w-md-editor-text-input { 
    color: #ffffff !important; 
    background-color: #282A2E !important; 
    -webkit-text-fill-color: #ffffff !important; /* Ensures color on some mobile browsers */
  }

  /* Preview Text Color - FORCING WHITE */
  :global(.dark) .w-md-editor-preview { 
    background-color: #282A2E !important; 
    color: #ffffff !important; 
  }
  
  /* Ensure all markdown elements (p, h1, h2, etc.) inside preview are white */
  :global(.dark) .wmde-markdown {
    background-color: transparent !important;
    color: #ffffff !important;
  }

  /* Toolbar Buttons */
  :global(.dark) .custom-editor .w-md-editor-toolbar ul li button { 
    color: #94a3b8 !important; 
  }
  :global(.dark) .custom-editor .w-md-editor-toolbar ul li button:hover { 
    color: #ffffff !important; 
    background-color: #333638 !important; 
  }
  
  /* Shared Scrollbar */
  .w-md-editor-text-input::-webkit-scrollbar { width: 6px; }
  .w-md-editor-text-input::-webkit-scrollbar-thumb { 
    border-radius: 10px; 
    background: #cbd5e1; 
  }
  :global(.dark) .w-md-editor-text-input::-webkit-scrollbar-thumb { 
    background: #374151; 
  }
      `}</style>
    </div>
  );
}

