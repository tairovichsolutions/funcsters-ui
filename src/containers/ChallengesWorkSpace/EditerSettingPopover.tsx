"use client";
import React from "react";
import {
  EditorTheme,
  EditorKeyBinding,
  useEditorSettings,
} from "@/context/EditorSettingsContext";
import {
  TAB_SIZE_OPTIONS,
  EDITOR_THEME_OPTIONS,
} from "@/constants/selectOptions";
import { Command } from "lucide-react";
import { SvgColor } from "@/components";
import { Assets } from "@/constants/assets";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SelectBox } from "@/components/ui/select-box";

const KEY_BINDING_OPTIONS: { label: string; value: EditorKeyBinding }[] = [
  { label: "Default", value: "default" },
  { label: "VS Code", value: "vscode" },
  { label: "Sublime", value: "sublime" },
  { label: "Vim", value: "vim" },
];

export const EditerSettingPopover = React.memo(() => {
  const { settings, setTheme, setTabSize, setAutoComplete, setKeyBinding } =
    useEditorSettings();

  return (
    <div className="space-y-3">
      <div className="bg-[#0050920D] p-3 rounded-md flex justify-between items-center">
        <h4 className="text-[13px] font-semibold">Auto complete</h4>
        <div>
          <Switch
            textSize="sm"
            uiSize="md"
            checked={settings.autoComplete}
            onCheckedChange={setAutoComplete}
          />
        </div>
      </div>

      <div className="bg-[#0050920D] p-3 rounded-md space-y-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-xs font-semibold">
            Key Binding
          </label>
          <SelectBox
            className="text-xs"
            placeholder="Select"
            options={KEY_BINDING_OPTIONS}
            value={settings.keyBinding}
            onValueChange={(v) => setKeyBinding(v as EditorKeyBinding)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-xs font-semibold">
            Tab Size
          </label>
          <SelectBox
            className="text-xs"
            placeholder="Select"
            options={TAB_SIZE_OPTIONS}
            value={String(settings.tabSize)}
            onValueChange={(v) => {
              const n = parseInt(v, 10);
              if (!Number.isNaN(n)) setTabSize(n);
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-xs font-semibold">
            Editor Theme
          </label>
          <SelectBox
            className="text-xs"
            placeholder="Select"
            value={settings.theme}
            onValueChange={(v) => setTheme(v as EditorTheme)}
            options={EDITOR_THEME_OPTIONS}
          />
        </div>
      </div>

      <div className="bg-[#0050920D] p-3 rounded-md">
        <h4 className="text-[13px] font-semibold text-[#0F172A] dark:text-white">
          Shortcuts
        </h4>

        <Separator className="my-2 bg-[#E2E8F0]" />

        <div className="flex justify-between items-start text-xs">
          <div className="flex flex-col gap-3">
            <h6 className="text-[#4E4E4E] dark:text-gray-400 text-xs font-semibold">
              Run code
            </h6>
            <div className="flex items-center gap-1.5">
              <Command className="w-3.5 h-3.5" />
              <SvgColor
                src={Assets.Svgs.Singlecomma}
                className="w-3.5 h-3 bg-black dark:bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h6 className="text-[#4E4E4E] dark:text-gray-400 text-xs font-semibold">
              Submit
            </h6>
            <div className="flex items-center gap-1.5">
              <Command className="w-3.5 h-3.5" />

              <SvgColor
                src={Assets.Svgs.EnterIcon}
                className="w-3.5 h-3 bg-black dark:bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
