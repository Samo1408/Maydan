import type { Answers, FormDef, Question } from "./types";

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

export function visibleQuestions(form: FormDef, answers: Answers): Question[] {
  return form.questions.filter((question) => isRelevant(question.relevant, answers));
}

export function validateAnswers(form: FormDef, answers: Answers): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const question of form.questions) {
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
  const questions = form.questions.map((question, index) => {
    const name = uniqueName(sanitizeName(question.name, `q${index + 1}`), used);
    const select = question.type === "select_one" || question.type === "select_multiple";
    const choiceNames = new Set<string>();
    const choices = select
      ? (question.choices ?? []).map((choice, choiceIndex) => ({
          name: uniqueName(sanitizeName(choice.name, `c${choiceIndex + 1}`), choiceNames),
          label: choice.label.trim() || `خيار ${choiceIndex + 1}`,
        }))
      : undefined;
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
    };
  });
  return {
    ...form,
    title: form.title.trim() || "نموذج بلا عنوان",
    description: form.description.trim(),
    version: form.version.trim() || "1",
    questions,
    updatedAt: new Date().toISOString(),
  };
}

export function answerCount(form: FormDef, answers: Answers): { done: number; total: number } {
  const required = visibleQuestions(form, answers).filter(
    (question) => question.required && question.type !== "note",
  );
  const done = required.filter((question) => !isBlank(answers[question.name])).length;
  return { done, total: required.length };
}
