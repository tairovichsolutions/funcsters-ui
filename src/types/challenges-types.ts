/* eslint-disable @typescript-eslint/no-explicit-any */
import { DifficultyLevelTypes, UserProgressTypes } from "./chips-types";

export interface ChallengesTypes {
  id: number;
  title: string;
  summary: string;
  tags?: string[];
  [x: string]: any;
  difficulty: DifficultyLevelTypes;
  userProgress?: UserProgressTypes | undefined;
}

export type ChallengesApiResponse = {
  data: {
    total: number;
    challenges: ChallengesTypes[];
  };
  meta?: {
    page: number;
    pageSize: number;
  };
};
