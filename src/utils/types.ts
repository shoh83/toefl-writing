// src/utils/types.ts

export type Evaluation = {
  totalScore: number;
  relevancy: number;
  elaboration: number;
  syntax: number;
  vocabulary: number;
  naturalness: number;
  grammar: number;
  detailedFeedback: string;
};

export type RationaleItem = {
  category: string;
  original: string;
  revised: string;
  reason: string;
};

export type ChatHistory = {
  role: 'user' | 'model';
  parts: { text: string }[];
};
