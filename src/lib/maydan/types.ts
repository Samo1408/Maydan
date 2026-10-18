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
};

export type FormDef = {
  id: string;
  title: string;
  description: string;
  version: string;
  deployed: boolean;
  questions: Question[];
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
