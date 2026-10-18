import type { Answers, FormDef, Submission } from "./types";
import { IMAGE_SENTINEL } from "./types";

export function parseCsv(text: string): string[][] {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else quoted = false;
      } else cell += ch;
      continue;
    }
    if (ch === '"') {
      quoted = true;
      continue;
    }
    if (ch === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    if (ch !== "\r") cell += ch;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((item) => item.some((value) => value.trim() !== ""));
}

export function toCsv(rows: string[][]): string {
  const body = rows
    .map((row) =>
      row
        .map((cell) => (/[",\n\r]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell))
        .join(","),
    )
    .join("\r\n");
  return `\uFEFF${body}`;
}

function cellValue(value: Answers[string] | undefined): string {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join(" ");
  if (value === IMAGE_SENTINEL || value.startsWith("data:")) return "yes";
  return value;
}

export function submissionsToCsv(form: FormDef, rows: Submission[]): string {
  const questions = form.questions.filter((question) => question.type !== "note");
  const header = ["_id", "_submitted_at", "_device", "_source", ...questions.map((question) => question.name)];
  const body = rows.map((row) => [
    row.id,
    row.submittedAt,
    row.deviceLabel,
    row.source,
    ...questions.map((question) => cellValue(row.answers[question.name])),
  ]);
  return toCsv([header, ...body]);
}

export function submissionsFromCsv(
  text: string,
  form: FormDef,
): { answers: Answers; deviceLabel?: string; submittedAt?: string }[] {
  const matrix = parseCsv(text);
  if (matrix.length < 2) return [];
  const header = matrix[0]!.map((item) => item.trim());
  const names = new Set(form.questions.map((question) => question.name));
  return matrix.slice(1).map((line) => {
    const answers: Answers = {};
    let deviceLabel: string | undefined;
    let submittedAt: string | undefined;
    header.forEach((key, index) => {
      const value = (line[index] ?? "").trim();
      if (!value) return;
      if (key === "_device") deviceLabel = value;
      else if (key === "_submitted_at") submittedAt = value;
      else if (names.has(key)) {
        const question = form.questions.find((item) => item.name === key);
        answers[key] =
          question?.type === "select_multiple"
            ? value.split(/\s+/).filter(Boolean)
            : value;
      }
    });
    return { answers, deviceLabel, submittedAt };
  });
}

export function looksLikeSurveyCsv(text: string): boolean {
  const matrix = parseCsv(text);
  const header = (matrix[0] ?? []).map((item) => item.trim().toLowerCase());
  return header.includes("type") && header.includes("name") && header.includes("label");
}
