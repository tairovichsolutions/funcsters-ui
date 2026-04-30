"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreatePairRequest } from "../hooks/usePairQueries";
import type { PairFocusArea } from "../types";

/**
 * "Request Pair Programming" modal from the Figma mock.
 *
 * Note on backend compatibility:
 *   Figma shows multi-select for focus areas + languages and a free-text
 *   description. The current backend (pair_request table) stores only a
 *   single focusArea + single languageId and no description. This UI
 *   captures the full Figma fields; submit degrades to the first selection
 *   and drops the description. When backend is widened, remove the
 *   [0] picks in submit() and pass the full arrays.
 */

interface CreatePairRequestModalProps {
  open: boolean;
  onClose: () => void;
  challengeId: number;
  challengeTitle: string;
  languageOptions: Array<{ id: number; name: string }>;
}

const FOCUS_AREAS: Array<{ value: PairFocusArea; label: string }> = [
  { value: "LEARNING", label: "Understanding the logic" },
  { value: "DEBUGGING", label: "Debugging" },
  { value: "REFACTORING", label: "Refactoring" },
  { value: "OPTIMIZATION", label: "Optimization" },
  { value: "GENERAL", label: "General help" },
];

const SPOKEN_LANGUAGES = [
  { value: "EN", label: "English" },
  { value: "ES", label: "Spanish" },
  { value: "FR", label: "French" },
  { value: "DE", label: "German" },
  { value: "HI", label: "Hindi" },
  { value: "ZH", label: "Mandarin" },
  { value: "JA", label: "Japanese" },
  { value: "PT", label: "Portuguese" },
];

export function CreatePairRequestModal({
  open,
  onClose,
  challengeId,
  challengeTitle,
  languageOptions,
}: CreatePairRequestModalProps) {
  const createRequest = useCreatePairRequest();
  const [description, setDescription] = useState("");
  const [selectedFocus, setSelectedFocus] = useState<Set<PairFocusArea>>(new Set(["LEARNING"]));
  const [selectedLanguages, setSelectedLanguages] = useState<Set<number>>(new Set());
  const [selectedSpoken, setSelectedSpoken] = useState<Set<string>>(new Set(["EN"]));
  const [agreed, setAgreed] = useState(false);

  const canSubmit =
    selectedFocus.size > 0 &&
    selectedLanguages.size > 0 &&
    selectedSpoken.size > 0 &&
    agreed &&
    !createRequest.isPending;

  if (!open) return null;

  const submit = async () => {
    if (!canSubmit) return;
    // Single-value degrade: backend takes one focusArea + one languageId.
    // Pick the first selection from each set. Full multi-select support
    // requires backend V4 migration (client discussion pending).
    const focusArea: PairFocusArea = Array.from(selectedFocus)[0];
    const languageId = Array.from(selectedLanguages)[0];
    try {
      await createRequest.mutateAsync({
        challengeId,
        languageId,
        focusArea,
        description,
        spokenLanguages: Array.from(selectedSpoken),
      });
      // description intentionally dropped — no backend column yet.
      onClose();
    } catch {
      // errors shown inline via createRequest.error if needed
    }
  };

  console.log({ description });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl text-neutral-01 font-semibold">Request Pair Programming</h2>

          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9.11606 10L3.93231 4.8175C3.8742 4.75939 3.82811 4.6904 3.79666 4.61448C3.76521 4.53855 3.74902 4.45718 3.74902 4.375C3.74902 4.29282 3.76521 4.21144 3.79666 4.13552C3.82811 4.05959 3.8742 3.99061 3.93231 3.9325C3.99042 3.87439 4.05941 3.82829 4.13533 3.79684C4.21126 3.76539 4.29263 3.74921 4.37481 3.74921C4.45699 3.74921 4.53837 3.76539 4.61429 3.79684C4.69022 3.82829 4.7592 3.87439 4.81731 3.9325L9.99981 9.11625L15.1823 3.9325C15.2997 3.81514 15.4588 3.74921 15.6248 3.74921C15.7908 3.74921 15.95 3.81514 16.0673 3.9325C16.1847 4.04985 16.2506 4.20903 16.2506 4.375C16.2506 4.54097 16.1847 4.70014 16.0673 4.8175L10.8836 10L16.0673 15.1825C16.1847 15.2999 16.2506 15.459 16.2506 15.625C16.2506 15.791 16.1847 15.9501 16.0673 16.0675C15.95 16.1849 15.7908 16.2508 15.6248 16.2508C15.4588 16.2508 15.2997 16.1849 15.1823 16.0675L9.99981 10.8837L4.81731 16.0675C4.69995 16.1849 4.54078 16.2508 4.37481 16.2508C4.20884 16.2508 4.04967 16.1849 3.93231 16.0675C3.81495 15.9501 3.74902 15.791 3.74902 15.625C3.74902 15.459 3.81495 15.2999 3.93231 15.1825L9.11606 10Z" fill="#4D4D4D" />
            </svg>
          </button>
        </div>
        <hr className="my-4 border-t w-full border border-[#F0F0F0]"></hr>
        <p className="mt-1 text-sm text-[#4D4D4D]">
          Fill in the details below to find a programming partner for{" "}
          <span className="font-semibold text-[#008CFF]">&ldquo;{challengeTitle}&rdquo;</span>.
        </p>
        <div className="mt-4 space-y-5">
          <div>
            <label className="block text-sm text-neutral-01 font-medium">What do you need help with?</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you're stuck on (optional)"
              className="mt-1 w-full rounded-md border border-border bg-[#FAFAFA] px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <PillGroup
            label="Or select focuses"
            multi
            options={FOCUS_AREAS.map((f) => ({ value: f.value, label: f.label }))}
            selected={selectedFocus as Set<string>}
            onToggle={(v) => {
              const next = new Set(selectedFocus);
              const val = v as PairFocusArea;
              if (next.has(val)) next.delete(val);
              else next.add(val);
              setSelectedFocus(next);
            }}
          />

          <PillGroup
            label="Programming Languages"
            multi
            options={languageOptions.map((l) => ({ value: String(l.id), label: l.name }))}
            selected={new Set(Array.from(selectedLanguages).map(String))}
            onToggle={(v) => {
              const id = Number(v);
              const next = new Set(selectedLanguages);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              setSelectedLanguages(next);
            }}
          />

          <PillGroup
            label="Spoken Languages"
            multi
            options={SPOKEN_LANGUAGES}
            selected={selectedSpoken}
            onToggle={(v) => {
              const next = new Set(selectedSpoken);
              if (next.has(v)) next.delete(v);
              else next.add(v);
              setSelectedSpoken(next);
            }}
          />
        <hr className="my-4 border-t w-full border border-[#F0F0F0]"/>

          <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-[#038CFF33] bg-[#f0f8ff] p-4 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-blue-600"
            />
            <span className="">
              <span className="font-semibold text-neutral-01   ">I agree to be respectful &amp; collaborative.</span>
              <br />
              <span className="text-xs text-[#808080] ">
                I understand that I am joining a community and that my behavior must be respectful and collaborative.
              </span>
            </span>
          </label>

          {createRequest.isError && (
            <div className="rounded-md bg-rose-50 p-2 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              {extractErrorMessage(createRequest.error)}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-[#008CFF] text-[#008CFF] px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-md bg-[#008CFF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createRequest.isPending ? "Sending…" : "Request Partner"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface PillGroupProps {
  label: string;
  multi?: boolean;
  options: Array<{ value: string; label: string }>;
  selected: Set<string>;
  onToggle: (value: string) => void;
}

function PillGroup({ label, multi, options, selected, onToggle }: PillGroupProps) {
  return (
    <div>
      <div className="mb-2 text-neutral-01 text-sm font-medium">
        {label}
        {multi && <span className="ml-1 ">(multi-select):</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const on = selected.has(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${on
                ? "border-[#038CFF] bg-[#038CFF] text-white"
                : "border-border bg-[#FAFAFA] text-foreground hover:bg-muted"
                }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const resp = (err as { response?: { data?: { message?: string } } }).response;
    if (resp?.data?.message) return resp.data.message;
  }
  return "Something went wrong. Please try again.";
}
