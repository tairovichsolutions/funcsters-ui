import { DifficultyLevelTypes, UserProgressTypes } from "./chips-types";

export type LanguageImplementation = {
  languageId: number;
  starterCode: string;
  languageName: string;
  userProgress: UserProgressTypes;
};

export type ChallengeDetailTypes = {
  xp: number;
  id: number;
  slug: string;
  title: string;
  tags: string[];
  summary: string;
  isActive: boolean;
  solvedCount: number;
  instructions: string;
  estimatedSolveTime: string;
  difficulty: DifficultyLevelTypes;
  languageImplementations: LanguageImplementation[];
};
