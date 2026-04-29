// types/answers.ts
export type QuestionSource = 'PYQ' | 'Mock Test' | 'Self-generated' | 'Coaching material';
export type GSPaper = 'GS I' | 'GS II' | 'GS III' | 'GS IV' | 'Essay' | 'Optional';

export const MISTAKE_TAGS = [
  'Structure', 'No Diagram', 'Factual Error', 'Off-Topic', 'Too Short',
  'Too Long', 'No Examples', 'Poor Intro', 'Weak Conclusion', 'Time Overrun', 'Factual Gaps',
] as const;
export type MistakeTag = typeof MISTAKE_TAGS[number];

export interface AnswerEntry {
  id: string;
  question: string;
  source: QuestionSource;
  paper: GSPaper;
  topic?: string;
  dateAttempted: string; // YYYY-MM-DD
  wordCount: number;
  timeTaken: number; // minutes
  marksObtained?: number;
  maxMarks?: number;
  selfScore: number; // 1–10
  mistakeTags: MistakeTag[];
  notes?: string;
  createdAt: string;
}
