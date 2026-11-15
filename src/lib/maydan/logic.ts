import type { Answers, FormDef, Question, ScoreBand } from "./types";
import { DEFAULT_SCORE_BANDS } from "./types";

export function isBlank(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  return String(value).trim() === "";
}

function asText(value: unknown): string {
  if (Array.isArray(value)) return value.join(" ");
  if (value == null) return "";
  return String(value);
}

function compare(left: string, op: string, right: string): boolean {
  const ln = Number(left);
  const rn = Number(right);
  const numeric =
    left.trim() !== "" && right.trim() !== "" && !Number.isNaN(ln) && !Number.isNaN(rn);
  if (op === "=") return numeric ? ln === rn : left === right;
  if (op === "!=") return numeric ? ln !== rn : left !== right;
  if (!numeric) return false;
  if (op === ">") return ln > rn;
  if (op === ">=") return ln >= rn;
  if (op === "<") return ln < rn;
  if (op === "<=") return ln <= rn;
  return false;
}

function splitTop(input: string, keyword: " and " | " or "): string[] {
  const parts: string[] = [];
  let buf = "";
  let quote: "'" | '"' | null = null;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    if (quote) {
      buf += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      buf += ch;
      continue;
    }
    if (input.slice(i, i + keyword.length).toLowerCase() === keyword) {
      parts.push(buf);
      buf = "";
      i += keyword.length - 1;
      continue;
    }
    buf += ch;
  }
  parts.push(buf);
  return parts;
}

function evalAtom(atom: string, answers: Answers): boolean {
  const selected = atom.match(
    /^selected\(\s*\$\{([A-Za-z_][A-Za-z0-9_]*)\}\s*,\s*'([^']*)'\s*\)$/i,
  );
  if (selected) {
    const raw = answers[selected[1]!];
    const list = Array.isArray(raw) ? raw : raw ? raw.split(/\s+/) : [];
    return list.includes(selected[2]!);
  }
  const cmp = atom.match(
    /^\$\{([A-Za-z_][A-Za-z0-9_]*)\}\s*(!=|>=|<=|=|>|<)\s*(?:'([^']*)'|"([^"]*)"|(-?\d+(?:\.\d+)?))$/,
  );
  if (!cmp) return true;
  const right = cmp[3] ?? cmp[4] ?? cmp[5] ?? "";
  return compare(asText(answers[cmp[1]!]), cmp[2]!, right);
}

export function isRelevant(expr: string | undefined, answers: Answers): boolean {
  if (!expr?.trim()) return true;
  return splitTop(expr.trim(), " or ").some((part) => {
    const atoms = splitTop(part, " and ")
      .map((item) => item.trim())
      .filter(Boolean);
    return atoms.every((atom) => evalAtom(atom, answers));
  });
}

export function passesConstraint(expr: string | undefined, value: unknown): boolean {
  if (!expr?.trim() || isBlank(value)) return true;
  const current = asText(value);
  return splitTop(expr.trim(), " and ")
    .map((item) => item.trim())
    .filter(Boolean)
    .every((atom) => {
      const match = atom.match(
        /^\.\s*(!=|>=|<=|=|>|<)\s*(?:'([^']*)'|"([^"]*)"|(-?\d+(?:\.\d+)?))$/,
      );
      if (!match) return true;
      const right = match[2] ?? match[3] ?? match[4] ?? "";
      return compare(current, match[1]!, right);
    });
}

export function questionsInScope(form: FormDef, categoryId?: string): Question[] {
  if (!categoryId || !form.categories?.length) return form.questions;
  return form.questions.filter((question) => !question.categoryId || question.categoryId === categoryId);
}

export function visibleQuestions(form: FormDef, answers: Answers, categoryId?: string): Question[] {
  return questionsInScope(form, categoryId).filter((question) => isRelevant(question.relevant, answers));
}

export function validateAnswers(
  form: FormDef,
  answers: Answers,
  categoryId?: string,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const question of questionsInScope(form, categoryId)) {
    if (!isRelevant(question.relevant, answers) || question.type === "note") continue;
    const value = answers[question.name];
    if (question.required && isBlank(value)) {
      errors[question.name] = "هذا الحقل مطلوب";
      continue;
    }
    if (!isBlank(value) && (question.type === "integer" || question.type === "decimal" || question.type === "rating")) {
      const numeric = Number(value);
      if (Number.isNaN(numeric)) {
        errors[question.name] = "أدخل رقماً صالحاً";
        continue;
      }
      if (question.type === "integer" && !Number.isInteger(numeric)) {
        errors[question.name] = "أدخل عدداً صحيحاً";
        continue;
      }
      if (question.type === "rating" && (numeric < 1 || numeric > 5)) {
        errors[question.name] = "التقييم من 1 إلى 5";
        continue;
      }
    }
    if (question.type === "geopoint" && !isBlank(value)) {
      const parts = asText(value).trim().split(/\s+/);
      if (parts.length < 2 || parts.slice(0, 2).some((part) => Number.isNaN(Number(part)))) {
        errors[question.name] = "أدخل خط العرض وخط الطول";
        continue;
      }
    }
    if (!passesConstraint(question.constraint, value)) {
      errors[question.name] = question.constraintMessage?.trim() || "القيمة خارج الشرط المسموح";
    }
  }
  return errors;
}

export function sanitizeName(raw: string, fallback: string): string {
  let name = raw.trim().replace(/\s+/g, "_").replace(/[^A-Za-z0-9_]/g, "");
  if (!name) name = fallback;
  if (!/^[A-Za-z_]/.test(name)) name = `n_${name}`;
  return name.slice(0, 64);
}

export function uniqueName(name: string, used: Set<string>): string {
  const base = name || "q";
  let next = base;
  let index = 2;
  while (used.has(next)) next = `${base}_${index++}`;
  used.add(next);
  return next;
}

export function normalizeForm(form: FormDef): FormDef {
  const used = new Set<string>();
  const categories = (form.categories ?? [])
    .map((category, index) => ({
      id: category.id || `cat${index + 1}`,
      label: category.label.trim() || `فئة ${index + 1}`,
      description: category.description?.trim() || undefined,
      relevant: category.relevant?.trim() || undefined,
    }))
    .filter((category, index, list) => list.findIndex((item) => item.id === category.id) === index);
  const categoryIds = new Set(categories.map((category) => category.id));
  const questions = form.questions.map((question, index) => {
    const name = uniqueName(sanitizeName(question.name, `q${index + 1}`), used);
    const select = question.type === "select_one" || question.type === "select_multiple";
    const choiceNames = new Set<string>();
    const sourceChoices = question.choices ?? [];
    const choices = select
      ? sourceChoices.map((choice, choiceIndex) => ({
          name: uniqueName(sanitizeName(choice.name, `c${choiceIndex + 1}`), choiceNames),
          label: choice.label.trim() || `خيار ${choiceIndex + 1}`,
        }))
      : undefined;
    const choicePoints: Record<string, number> = {};
    if (select && question.choicePoints) {
      sourceChoices.forEach((choice, choiceIndex) => {
        const raw = question.choicePoints?.[choice.name];
        const nextName = choices?.[choiceIndex]?.name;
        if (!nextName || raw == null || Number.isNaN(Number(raw))) return;
        choicePoints[nextName] = Math.min(10, Math.max(0, Number(raw)));
      });
    }
    const tolerance = Number(question.scoreTolerance);
    return {
      ...question,
      name,
      label: question.label.trim() || "سؤال بلا عنوان",
      hint: question.hint?.trim() || undefined,
      relevant: question.relevant?.trim() || undefined,
      constraint: question.constraint?.trim() || undefined,
      constraintMessage: question.constraintMessage?.trim() || undefined,
      required: Boolean(question.required) && question.type !== "note",
      choices,
      categoryId: question.categoryId && categoryIds.has(question.categoryId) ? question.categoryId : undefined,
      scoreExpected: question.scoreExpected?.trim() || undefined,
      scoreTolerance: Number.isFinite(tolerance) && tolerance > 0 ? tolerance : undefined,
      choicePoints: Object.keys(choicePoints).length ? choicePoints : undefined,
    };
  });
  const scoreBands = (form.scoreBands ?? [])
    .map((band) => ({
      min: Math.min(10, Math.max(0, Number(band.min) || 0)),
      label: band.label.trim(),
    }))
    .filter((band) => band.label)
    .sort((a, b) => a.min - b.min);
  return {
    ...form,
    title: form.title.trim() || "نموذج بلا عنوان",
    description: form.description.trim(),
    version: form.version.trim() || "1",
    categories,
    scoreBands: scoreBands.length ? scoreBands : undefined,
    questions,
    updatedAt: new Date().toISOString(),
  };
}

export function answerCount(form: FormDef, answers: Answers, categoryId?: string): { done: number; total: number } {
  const required = visibleQuestions(form, answers, categoryId).filter(
    (question) => question.required && question.type !== "note",
  );
  const done = required.filter((question) => !isBlank(answers[question.name])).length;
  return { done, total: required.length };
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(Math.min(10, Math.max(0, value)) * 10) / 10;
}

function words(value: string): string[] {
  return value
    .toLowerCase()
    .trim()
    .split(/[\s,،|]+/)
    .filter(Boolean);
}

export function questionIsScored(question: Question): boolean {
  if (question.type === "note" || question.type === "image" || question.type === "geopoint") return false;
  if (question.scoreExpected?.trim()) return true;
  return Object.keys(question.choicePoints ?? {}).length > 0;
}

export function scoreQuestion(question: Question, value: unknown): number | null {
  if (!questionIsScored(question)) return null;
  if (isBlank(value)) return 0;
  const expected = question.scoreExpected?.trim() ?? "";
  const pointsMap = question.choicePoints ?? {};
  const hasChoicePoints = Object.keys(pointsMap).length > 0;

  if (question.type === "select_one") {
    const picked = asText(value);
    if (hasChoicePoints) return clampScore(Number(pointsMap[picked] ?? 0));
    const label = question.choices?.find((choice) => choice.name === picked)?.label ?? "";
    return picked === expected || label === expected ? 10 : 0;
  }

  if (question.type === "select_multiple") {
    const picked = Array.isArray(value) ? value : words(asText(value));
    if (hasChoicePoints) {
      if (!picked.length) return 0;
      const total = picked.reduce((sum, name) => sum + Number(pointsMap[name] ?? 0), 0);
      return clampScore(total / picked.length);
    }
    const want = new Set(words(expected));
    if (!want.size) return null;
    const got = new Set(picked);
    let shared = 0;
    for (const name of want) if (got.has(name)) shared += 1;
    const union = new Set([...want, ...got]).size || 1;
    return clampScore((shared / union) * 10);
  }

  if (question.type === "integer" || question.type === "decimal" || question.type === "rating") {
    const actual = Number(value);
    const target = Number(expected);
    if (Number.isNaN(actual) || Number.isNaN(target)) return 0;
    const tolerance =
      question.scoreTolerance && question.scoreTolerance > 0
        ? question.scoreTolerance
        : Math.max(1, Math.abs(target) || 1);
    return clampScore(10 * (1 - Math.abs(actual - target) / tolerance));
  }

  if (question.type === "acknowledge") {
    const ok = ["OK", "yes", "1", "نعم"].includes(asText(value));
    const wantYes = !expected || ["OK", "yes", "1", "نعم"].includes(expected);
    return ok === wantYes ? 10 : 0;
  }

  const actualText = asText(value).trim().toLowerCase();
  const wantText = expected.toLowerCase();
  if (!wantText) return null;
  if (actualText === wantText) return 10;
  if (actualText.includes(wantText) || wantText.includes(actualText)) return 7;
  const have = new Set(words(actualText));
  const need = words(wantText);
  if (!need.length) return 0;
  return clampScore((need.filter((token) => have.has(token)).length / need.length) * 10);
}

export function bandFor(points: number, bands?: ScoreBand[]): string {
  const list = [...(bands?.length ? bands : DEFAULT_SCORE_BANDS)].sort((a, b) => b.min - a.min);
  return list.find((band) => points >= band.min)?.label ?? "";
}

export type GradeLine = { name: string; label: string; points: number; band: string };

export function gradeAnswers(form: FormDef, answers: Answers, categoryId?: string) {
  const items: GradeLine[] = [];
  for (const question of questionsInScope(form, categoryId ?? undefined)) {
    const points = scoreQuestion(question, answers[question.name]);
    if (points == null) continue;
    items.push({
      name: question.name,
      label: question.label,
      points,
      band: bandFor(points, form.scoreBands),
    });
  }
  const average = items.length
    ? Math.round((items.reduce((sum, item) => sum + item.points, 0) / items.length) * 10) / 10
    : 0;
  return {
    items,
    average,
    band: items.length ? bandFor(average, form.scoreBands) : "",
    scored: items.length,
  };
}
