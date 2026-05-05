export type Topic = 'Basics' | 'Functions' | 'Pointers' | 'Records' | 'Files';

export type QuestionType = 'mcq' | 'boolean' | 'text';

export interface Question {
  id: number;
  topic: Topic;
  type: QuestionType;
  text: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer?: number; // Index for mcq/boolean
  correctTextAnswer?: string | string[]; // Accepted answers for text type
  explanation: string;
  visual?: string; // Emoji or simple helper visual
}

export interface User {
  fullName: string;
  matricule: string;
}

export interface QuizResult {
  topic: Topic;
  total: number;
  correct: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  matricule: string;
  score: number;
  timeSpent: number;
  date: string;
}
