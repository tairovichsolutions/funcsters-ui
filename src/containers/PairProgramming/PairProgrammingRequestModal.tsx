"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const PREDEFINED_SELECTIONS = [
  "Understanding the logic",
  "Syntax help",
  "Debugging",
];

const PROGRAMMING_LANGUAGES = ["JavaScript", "Python", "TypeScript", "C++", "Java", "Go"];
const SPOKEN_LANGUAGES = ["English", "Spanish", "French", "German", "Hindi", "Mandarin"];

interface PairProgrammingRequestModalProps {
  open: boolean;
  onClose: () => void;
  onRequest: (data: any) => void;
  isRequesting: boolean;
  isCancelable?: boolean;
  challengeTitle?: string;
}

export const PairProgrammingRequestModal = ({
  open,
  onClose,
  onRequest,
  isRequesting,
  isCancelable = true,
  challengeTitle = "this challenge",
}: PairProgrammingRequestModalProps) => {
  const [description, setDescription] = useState("");
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [selectedFocuses, setSelectedFocuses] = useState<string[]>([]);
  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>(["JavaScript"]);
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>(["English"]);

  const toggleSelection = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = () => {
    if (!description.trim() && selectedFocuses.length === 0) return;
    if (!agreedToRules) return;

    onRequest({
      description,
      focuses: selectedFocuses,
      programmingLanguages,
      spokenLanguages,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request Pair Programming"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isRequesting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isRequesting || !agreedToRules} loading={isRequesting}>
            {isRequesting ? "Submitting..." : "Pay 1 XP & Request Partner"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 mt-2">
        <p className="text-sm text-muted-foreground mt-[-10px] mb-2">
          Fill in the details below to find a programming partner for <span className="text-primary font-bold">"{challengeTitle}"</span>.
        </p>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">What do you need help with?</label>
          <input
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            placeholder="E.g., I'm stuck on wrapping my head around loops..."
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Or select focuses (multi-select):</label>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_SELECTIONS.map((item) => {
              const isActive = selectedFocuses.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleSelection(setSelectedFocuses, item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-foreground border-input hover:bg-accent"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Programming Languages (multi-select)</label>
          <div className="flex flex-wrap gap-2">
            {PROGRAMMING_LANGUAGES.map((lang) => {
              const isActive = programmingLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleSelection(setProgrammingLanguages, lang)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-foreground border-input hover:bg-accent"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Spoken Languages (multi-select)</label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
            {SPOKEN_LANGUAGES.map((lang) => {
              const isActive = spokenLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleSelection(setSpokenLanguages, lang)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-foreground border-input hover:bg-accent"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-2">
           <label className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl cursor-pointer hover:bg-primary/10 transition-all group">
            <input 
              type="checkbox" 
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
            />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-foreground group-hover:text-primary transition-colors">I agree to be respectful & collaborative</span>
              <p className="text-muted-foreground mt-0.5">
                I understand that I am expected to protect personal data and stay on topic. Harassment results in an immediate ban.
              </p>
            </div>
          </label>
        </div>
      </div>
    </Modal>
  );
};
