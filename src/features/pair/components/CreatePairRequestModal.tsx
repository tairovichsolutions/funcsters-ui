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
        spokenLanguages: Array.from(selectedSpoken),
      });
      // description intentionally dropped — no backend column yet.
      onClose();
    } catch {
      // errors shown inline via createRequest.error if needed
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Request Pair Programming</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the details below to find a programming partner for{" "}
              <span className="font-medium text-foreground">&ldquo;{challengeTitle}&rdquo;</span>.
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          <div>
            <label className="block text-sm font-medium">What do you need help with?</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you're stuck on (optional)"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
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

          <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-blue-600"
            />
            <span>
              <span className="font-medium">I agree to be respectful &amp; collaborative.</span>
              <br />
              <span className="text-xs text-muted-foreground">
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
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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
      <div className="mb-2 text-sm font-medium">
        {label}
        {multi && <span className="ml-1 text-xs font-normal text-muted-foreground">(multi-select)</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const on = selected.has(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                on
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-border bg-background text-foreground hover:bg-muted"
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
