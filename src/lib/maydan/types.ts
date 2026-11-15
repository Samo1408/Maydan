export const QUESTION_TYPES = [
  "text",
  "integer",
  "decimal",
  "select_one",
  "select_multiple",
  "note",
  "date",
  "time",
  "geopoint",
  "image",
  "acknowledge",
  "rating",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export type Choice = { name: string; label: string };

export type ScoreBand = { min: number; label: string };

export const DEFAULT_SCORE_BANDS: ScoreBand[] = [
  { min: 0, label: "ضعيف" },
  { min: 4, label: "متوسط" },
  { min: 7, label: "جيد" },
  { min: 9, label: "ممتاز" },
];

export type Category = {
  id: string;
  label: string;
  description?: string;
  /** Same expression language as a question's relevant field. */
  relevant?: string;
};

export type Question = {
  id: string;
  type: QuestionType;
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  choices?: Choice[];
  relevant?: string;
  constraint?: string;
  constraintMessage?: string;
  categoryId?: string;
  /** Reference answer. Closeness to it maps onto 0–10. */
  scoreExpected?: string;
  /** Numeric distance at which the score reaches 0. */
  scoreTolerance?: number;
  /** Points per choice name, each from 0 to 10. */
  choicePoints?: Record<string, number>;
};

export type FormDef = {
  id: string;
  title: string;
  description: string;
  version: string;
  deployed: boolean;
  questions: Question[];
  categories?: Category[];
  scoreBands?: ScoreBand[];
  createdAt: string;
  updatedAt: string;
};

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export type Submission = {
  id: string;
  formId: string;
  answers: Answers;
  submittedAt: string;
  deviceLabel: string;
  source: "desk" | "lan";
  categoryId?: string;
};

export type NetworkInfo = {
  port: number;
  addresses: { name: string; address: string }[];
};

export type Snapshot = {
  forms: FormDef[];
  submissions: Submission[];
  network: NetworkInfo;
};

export const IMAGE_SENTINEL = "__image__";

export function emptySnapshot(): Snapshot {
  return { forms: [], submissions: [], network: { port: 8080, addresses: [] } };
}
