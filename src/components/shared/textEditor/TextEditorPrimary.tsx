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
    return <div className="w-full h-[200px] bg-[#F5F8FB] dark:bg-[#0B1120] animate-pulse rounded-xl border border-slate-200 dark:border-slate-800" />;
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

  const customLinkIcon=(
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
    { ...commands.unorderedListCommand, icon: <List size={16} className="text-[#808080]"  /> }, gapCommand,
    { ...commands.orderedListCommand, icon: <ListOrdered size={16} className="text-[#808080]" /> },gapCommand,
    { ...commands.quote, icon: <Quote size={16} className="text-[#808080]" /> }, gapCommand,
    { ...commands.code, icon: <Code size={16} className="text-[#808080]" /> }, gapCommand,
    { ...commands.link, icon: customLinkIcon  }, gapCommand,
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
          className="flex text-[#4D4D4D]! items-center gap-2 p-3! rounded-md!  bg-[#CDDDEE]!  dark:bg-slate-800 hover:bg-blue-200 dark:hover:bg-slate-700 text-blue-700 dark:text-slate-200  transition-colors ml-auto mr-1"
        >
          {isEditing ? <Play size={14} fill="currentColor" /> : <Pen size={14} />}
          <span className="text-xs font-semibold">{isEditing ? "Preview" : "Edit"}</span>
        </button>
      );
    },
  };

  return (
    <div className="w-full border  border-[#D9D9D9] dark:border-slate-800 rounded-xl overflow-hidden bg-[#F5F8FB] dark:bg-[#0B1120] shadow-sm font-sans transition-colors">
      
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
      <div className="flex justify-between items-center px-5 py-3 bg-[#F5F8FB] dark:bg-[#0B1120]">
        <span className={`text-xs font-bold ${value?.length === 1000 ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
          {value?.length} / 1000
        </span>
        <button type="button" onClick={onSubmit} className="text-slate-500 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-transform active:scale-90">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M15.5428 1.64452C16.3298 1.40423 17.1044 1.33347 17.7557 1.81737C18.4102 2.30397 18.5573 3.06615 18.5418 3.88378C18.5263 4.70144 18.3424 5.7846 18.1151 7.1328L17.3192 11.8506C17.1714 12.7268 17.0506 13.4517 16.8748 14.001C16.6934 14.5678 16.4207 15.0574 15.8983 15.3633C15.377 15.6682 14.8151 15.6685 14.2284 15.5537C13.6581 15.4421 12.9583 15.199 12.1092 14.9053L6.80453 13.0703C6.48422 12.9595 6.17763 12.8524 5.88461 12.75L12.0946 9.1289C12.3031 9.00713 12.3734 8.73889 12.2518 8.53026C12.13 8.3217 11.8618 8.25134 11.6532 8.37304L4.80844 12.3642C4.11968 12.11 3.53604 11.8751 3.06918 11.6367C2.22705 11.2066 1.51059 10.6467 1.4598 9.73144C1.40913 8.81558 2.05973 8.18067 2.84945 7.6621C3.66237 7.12837 4.87432 6.5575 6.40512 5.83397L12.5057 2.95019C13.7539 2.36023 14.7539 1.88545 15.5428 1.64452Z" 
      fill="#808080"
    />
    <path 
      d="M7.91406 12.917V14.7732C7.91406 16.7512 7.91406 17.7402 8.50589 17.8979C9.09772 18.0556 9.72097 17.2327 10.9675 15.5869L11.6641 14.5837" 
      fill="#808080"
    />
    <path 
      d="M7.91406 12.917V14.7732C7.91406 16.7512 7.91406 17.7402 8.50589 17.8979C9.09772 18.0556 9.72097 17.2327 10.9675 15.5869L11.6641 14.5837" 
      stroke="#808080" 
      strokeWidth="1.25" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
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
        :global(.dark) .custom-editor .w-md-editor { background-color: #0B1120 !important; }
        :global(.dark) .custom-editor .w-md-editor-toolbar { 
          background-color: #0B1120 !important; 
          border-bottom: 1px solid #1f2937 !important; 
        }
        :global(.dark) .custom-editor .w-md-editor-content { background-color: #0B1120 !important; }
        :global(.dark) .w-md-editor-text-input { color: #ffffff !important; background-color: #0B1120 !important; }
        :global(.dark) .w-md-editor-preview { background-color: #0B1120 !important; color: #ffffff !important; }
        :global(.dark) .wmde-markdown { background-color: transparent !important; color: #ffffff !important; }
        :global(.dark) .custom-editor .w-md-editor-toolbar ul li button { color: #6b7280 !important; }
        :global(.dark) .custom-editor .w-md-editor-toolbar ul li button:hover { color: #ffffff !important; background-color: #1f2937 !important; }
        
        .w-md-editor-text-input::-webkit-scrollbar { width: 4px; }
        .w-md-editor-text-input::-webkit-scrollbar-thumb { border-radius: 10px; background: #cbd5e1; }
        :global(.dark) .w-md-editor-text-input::-webkit-scrollbar-thumb { background: #374151; }

         /* Main Container */
  :global(.dark) .custom-editor .w-md-editor { 
    background-color: #0B1120 !important; 
  }
  
  /* Toolbar */
  :global(.dark) .custom-editor .w-md-editor-toolbar { 
    background-color: #111827 !important; 
    border-bottom: 1px solid #1f2937 !important; 
  }
  
  /* Content Area Background */
  :global(.dark) .custom-editor .w-md-editor-content { 
    background-color: #0B1120 !important; 
  }

  /* Input Text Color - FORCING WHITE */
  :global(.dark) .w-md-editor-text-input { 
    color: #ffffff !important; 
    background-color: #0B1120 !important; 
    -webkit-text-fill-color: #ffffff !important; /* Ensures color on some mobile browsers */
  }

  /* Preview Text Color - FORCING WHITE */
  :global(.dark) .w-md-editor-preview { 
    background-color: #0B1120 !important; 
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
    background-color: #1f2937 !important; 
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


// "use client";
// import React, { useState } from "react";
// import dynamic from "next/dynamic";
// import { SendHorizonal, Play, Pen } from "lucide-react";
// import { commands } from "@uiw/react-md-editor";

// import "@uiw/react-md-editor/markdown-editor.css";
// import "@uiw/react-markdown-preview/markdown.css";

// // Dynamically import the editor to prevent hydration errors in Next.js
// const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// export default function MarkdownEditor() {
//   const [value, setValue] = useState<string | undefined>("");
//   const [mode, setMode] = useState<"edit" | "preview">("edit");

//   // 1. Custom Gap Command with shrink-0 so flexbox never squishes it
//   const gapCommand = {
//     name: "gap",
//     keyCommand: "gap",
//     render: () => {
//       // w-8 creates exactly 32px of blank space. 
//       return <div className="w-2 shrink-0 border-none" aria-hidden="true" />;
//     },
//   };

//   // 2. Toolbar layout explicitly matching your screenshot
//   const visibleCommands = [
//     commands.bold,
//      gapCommand, // Equal Gap 2
//     commands.italic,
//     gapCommand, // Equal Gap 1
//     commands.unorderedListCommand,
//      gapCommand, // Equal Gap 2
//     commands.orderedListCommand,
//     commands.quote,
//      gapCommand, // Equal Gap 2
//     commands.code,
//      gapCommand, // Equal Gap 2
//     commands.link,
//     // Add a small gap before the divider if you want it separated, or leave it adjacent
   
//     gapCommand, // Equal Gap 2
//     gapCommand, // Equal Gap 3
//     commands.divider,
//   ];

//   // 3. Custom Preview/Edit toggle button
//   const previewCommand = {
//     name: "previewToggle",
//     keyCommand: "previewToggle",
//     render: (command: any, disabled: boolean) => {
//       const isEditing = mode === "edit";

//       return (
//         <button
//           type="button"
//           onClick={() => setMode(isEditing ? "preview" : "edit")}
//           disabled={disabled}
//           className="flex items-center gap-2 px-3 py-1.5 bg-[#D8E5F3] hover:bg-[#C5D9ED] text-[#475569] rounded-md transition-colors ml-auto mr-1 disabled:opacity-50"
//           style={{ height: "unset" }}
//         >
//           {isEditing ? (
//             <Play size={14} fill="currentColor" />
//           ) : (
//             <Pen size={14} />
//           )}
//           <span className="text-sm font-medium">
//             {isEditing ? "Preview" : "Edit"}
//           </span>
//         </button>
//       );
//     },
//   };

//   return (
//     <div className="w-full max-w-2xl border border-[#E2E8F0] rounded-lg overflow-hidden bg-white shadow-sm font-sans">
      
//       <div data-color-mode="light" className="custom-editor">
//         <MDEditor
//           value={value}
//           onChange={setValue}
//           preview={mode}
//           height={180}
//           textareaProps={{
//             placeholder: "Share Your Thoughts",
//           }}
//           commands={visibleCommands}
//           extraCommands={[previewCommand]}
//           hideToolbar={false}
//           visibleDragbar={false}
//         />
//       </div>

//       <div className="flex justify-between items-center px-4 py-3 border-t border-[#E2E8F0] bg-white">
//         <span className="text-sm text-[#94A3B8] font-medium">
//           {value?.length || 0} / 1000
//         </span>
//         <button className="text-[#94A3B8] hover:text-[#475569] transition-colors">
//           <SendHorizonal size={20} />
//         </button>
//       </div>

//       {/* Global CSS Overrides */}
//       <style jsx global>{`
//         /* Remove default bounds */
//         .custom-editor .w-md-editor {
//           border: none !important;
//           box-shadow: none !important;
//           border-radius: 0 !important;
//         }
        
//         /* Toolbar background and padding */
//         .custom-editor .w-md-editor-toolbar {
//           background-color: #F8FAFC !important; 
//           border-bottom: 1px solid #E2E8F0 !important; 
//           padding: 8px 12px !important;
//         }

//         /* --- THE FLEXBOX FIX FOR EQUAL GAPS --- */
//         .custom-editor .w-md-editor-toolbar ul {
//           display: flex !important;
//           align-items: center !important;
//           gap: 4px !important; /* Standard small gap between adjacent icons */
//         }

//         /* Strip all default UIW margins that cause uneven spacing */
//         .custom-editor .w-md-editor-toolbar ul li {
//           margin: 0 !important;
//         }
//         /* -------------------------------------- */

//         /* Icon Colors */
//         .custom-editor .w-md-editor-toolbar ul li button {
//           color: #94A3B8 !important;
//         }
        
//         .custom-editor .w-md-editor-toolbar ul li button:hover {
//           color: #475569 !important;
//           background-color: #F1F5F9 !important;
//           border-radius: 4px;
//         }
        
//         /* Editor Area Colors */
//         .custom-editor .w-md-editor-content {
//            background-color: #FFFFFF !important;
//         }

//         .w-md-editor-text-input::placeholder {
//            color: #94A3B8 !important;
//         }

//         /* Scrollbar Styling */
//         .w-md-editor-text-input::-webkit-scrollbar {
//           width: 6px;
//         }
//         .w-md-editor-text-input::-webkit-scrollbar-thumb {
//           background: #CBD5E1;
//           border-radius: 10px;
//         }
//       `}</style>
//     </div>
//   );
// }   