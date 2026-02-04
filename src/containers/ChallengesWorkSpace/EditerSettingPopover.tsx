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
  { label: "VS Code", value: "vscode" },
  { label: "Sublime", value: "sublime" },
  { label: "Vim", value: "vim" },
];

// ---------- Shortcut Display Helpers ----------

type Modifier = "cmd" | "ctrl";
type KeyIconType = "comma" | "enter" | "singlequote" | "r" | "b";

type ShortcutDisplay = {
  run: { modifier: Modifier; key: KeyIconType };
  submit: { modifier: Modifier; key: KeyIconType };
};

function isMacOS(): boolean {
  if (typeof window === "undefined") return true;
  return /Mac|iPhone|iPad|iPod/i.test(window.navigator.userAgent);
}

function getShortcutDisplay(
  keyBinding: EditorKeyBinding,
  isMac: boolean,
): ShortcutDisplay {
  const modifier: Modifier = isMac ? "cmd" : "ctrl";

  switch (keyBinding) {
    case "vscode":
      return {
        run: { modifier, key: "singlequote" }, // Cmd/Ctrl + '
        submit: { modifier, key: "enter" }, // Cmd/Ctrl + Enter
      };

    case "sublime":
      return {
        run: { modifier, key: "b" }, // Cmd/Ctrl + B
        submit: { modifier, key: "enter" }, // Cmd/Ctrl + Enter
      };

    case "vim":
      return {
        run: { modifier, key: "r" }, // Cmd/Ctrl + R
        submit: { modifier, key: "enter" }, // Cmd/Ctrl + Enter
      };

    default:
      return {
        run: { modifier, key: "comma" }, // Cmd/Ctrl + ,
        submit: { modifier, key: "enter" }, // Cmd/Ctrl + Enter
      };
  }
}

function ModifierIcon({ m }: { m: Modifier }) {
  if (m === "cmd") return <Command className="w-3.5 h-3.5" />;

  // Windows/Linux: show "Ctrl" as a small badge
  return (
    <span className="text-[11px] font-semibold leading-none px-1.5 py-1 rounded bg-black/10 dark:bg-white/10">
      Ctrl
    </span>
  );
}

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold leading-none px-1.5 py-1 rounded bg-black/10 dark:bg-white/10">
      {children}
    </span>
  );
}

function KeyIcon({ k }: { k: KeyIconType }) {
  if (k === "comma") {
    return (
      <SvgColor
        src={Assets.Svgs.Singlecomma}
        className="w-3.5 h-3 bg-black dark:bg-white"
      />
    );
  }

  if (k === "enter") {
    return (
      <SvgColor
        src={Assets.Svgs.EnterIcon}
        className="w-3.5 h-3 bg-black dark:bg-white"
      />
    );
  }

  if (k === "singlequote") {
    return (
      <SvgColor
        src={Assets.Svgs.Singlecomma}
        className="w-3.5 h-3 bg-black dark:bg-white"
      />
    );
  }

  if (k === "b") {
    return <KeyBadge>B</KeyBadge>;
  }

  return <KeyBadge>R</KeyBadge>;
}

export const EditerSettingPopover = React.memo(() => {
  const {
    settings,
    setTheme,
    setTabSize,
    setThemeMode,
    setAutoComplete,
    setKeyBinding,
  } = useEditorSettings();

  const isMac = React.useMemo(() => isMacOS(), []);
  const shortcuts = React.useMemo(
    () => getShortcutDisplay(settings.keyBinding, isMac),
    [settings.keyBinding, isMac],
  );

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

      {/* <div className="bg-[#0050920D] p-3 rounded-md flex justify-between items-center">
        <h4 className="text-[13px] font-semibold">Follow website theme</h4>
        <Switch
          textSize="sm"
          uiSize="md"
          checked={settings.themeMode === "system"}
          onCheckedChange={(checked) =>
            setThemeMode(checked ? "system" : "manual")
          }
        />
      </div> */}

      <div className="bg-[#0050920D] p-3 rounded-md space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold">Key Binding</label>
          <SelectBox
            className="text-xs"
            placeholder="Select"
            options={KEY_BINDING_OPTIONS}
            value={settings.keyBinding}
            onValueChange={(v) => setKeyBinding(v as EditorKeyBinding)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold">Tab Size</label>
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
          <label className="text-xs font-semibold">Editor Theme</label>
          <SelectBox
            className="text-xs"
            placeholder="Select"
            value={settings.theme}
            onValueChange={(v) => setTheme(v as EditorTheme)}
            options={EDITOR_THEME_OPTIONS}
            // disabled={settings.themeMode === "system"}
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
              <ModifierIcon m={shortcuts.run.modifier} />
              <KeyIcon k={shortcuts.run.key} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h6 className="text-[#4E4E4E] dark:text-gray-400 text-xs font-semibold">
              Submit
            </h6>
            <div className="flex items-center gap-1.5">
              <ModifierIcon m={shortcuts.submit.modifier} />
              <KeyIcon k={shortcuts.submit.key} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EditerSettingPopover.displayName = "EditerSettingPopover";
