import { gradeAnswers, questionIsScored } from "./logic";
import { newId } from "./id";
import type { Category, Choice, FormDef, Question, QuestionType } from "./types";
import { QUESTION_TYPES } from "./types";
import { looksLikeSurveyCsv, parseCsv } from "./csv";

type Row = Record<string, string>;

function asRows(matrix: string[][]): Row[] {
  if (!matrix.length) return [];
  const header = matrix[0]!.map((cell) => cell.trim().toLowerCase());
  return matrix.slice(1).map((line) => {
    const row: Row = {};
    header.forEach((key, index) => {
      if (key) row[key] = (line[index] ?? "").trim();
    });
    return row;
  });
}

function yes(value: string | undefined): boolean {
  return ["yes", "true", "1", "y", "نعم"].includes((value ?? "").trim().toLowerCase());
}

type TaggedChoice = Choice & { points?: number };

function choiceList(raw: string | undefined): TaggedChoice[] {
  if (!raw?.trim()) return [];
  return raw
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index) => {
      const bits = part.split(":");
      if (bits.length === 1) return { name: `c${index + 1}`, label: part };
      const points = Number(bits[2]);
      return {
        name: bits[0]!.trim() || `c${index + 1}`,
        label: bits[1]?.trim() || part,
        points: bits.length > 2 && Number.isFinite(points) ? points : undefined,
      };
    });
}

function questionFromRow(row: Row, choices: TaggedChoice[], index: number): Question | null {
  const rawType = (row.type ?? "").trim();
  if (!rawType || rawType.startsWith("begin_") || rawType.startsWith("end_") || rawType === "start" || rawType === "end" || rawType === "today" || rawType === "deviceid") {
    return null;
  }
  const [kind, listName] = rawType.split(/\s+/);
  let type: QuestionType = "text";
  if (kind === "select_one" || kind === "select_multiple") type = kind;
  else if (kind === "range") type = "rating";
  else if ((QUESTION_TYPES as readonly string[]).includes(kind ?? "")) type = kind as QuestionType;
  else return null;

  const matched = listName ? choices.filter((choice) => choice.name.startsWith(`${listName}::`)) : choiceList(row.choices);
  const list = matched.map((choice) => ({
    name: listName ? choice.name.slice(listName.length + 2) : choice.name,
    label: choice.label,
  }));
  const choicePoints: Record<string, number> = {};
  matched.forEach((choice) => {
    if (choice.points == null || Number.isNaN(choice.points)) return;
    const name = listName ? choice.name.slice(listName.length + 2) : choice.name;
    choicePoints[name] = Math.min(10, Math.max(0, choice.points));
  });
  const tolerance = Number(row.score_tolerance);

  return {
    id: newId(),
    type,
    name: row.name || `q${index + 1}`,
    label: row.label || row.name || "سؤال",
    hint: row.hint || undefined,
    required: yes(row.required),
    relevant: row.relevant || undefined,
    constraint: row.constraint || (type === "rating" ? ". >= 1 and . <= 5" : undefined),
    constraintMessage: row.constraint_message || undefined,
    choices: type === "select_one" || type === "select_multiple" ? list : undefined,
    scoreExpected: row.score_expected || undefined,
    scoreTolerance: Number.isFinite(tolerance) && tolerance > 0 ? tolerance : undefined,
    choicePoints: Object.keys(choicePoints).length ? choicePoints : undefined,
  };
}

function collectQuestions(rows: Row[], choices: TaggedChoice[]): { questions: Question[]; categories: Category[] } {
  const categories: Category[] = [];
  let current: string | undefined;
  const questions: Question[] = [];
  rows.forEach((row, index) => {
    const rawType = (row.type ?? "").trim();
    if (rawType === "begin_group" || rawType === "begin_repeat") {
      const id = newId();
      current = id;
      categories.push({
        id,
        label: row.label || row.name || "فئة",
        description: row.hint || undefined,
        relevant: row.relevant || undefined,
      });
      return;
    }
    if (rawType === "end_group" || rawType === "end_repeat") {
      current = undefined;
      return;
    }
    const question = questionFromRow(row, choices, index);
    if (!question) return;
    const named = row.category?.trim();
    if (named) {
      let category = categories.find((item) => item.label === named);
      if (!category) {
        category = { id: newId(), label: named };
        categories.push(category);
      }
      question.categoryId = category.id;
    } else if (current) {
      question.categoryId = current;
    }
    questions.push(question);
  });
  return { questions, categories };
}

export function formFromCsvText(text: string, base?: Partial<FormDef>): FormDef {
  if (!looksLikeSurveyCsv(text)) {
    throw new Error("ملف CSV ليس تعريف نموذج. يلزم أعمدة type و name و label.");
  }
  const matrix = parseCsv(text);
  const rows = asRows(matrix);
  const now = new Date().toISOString();
  const collected = collectQuestions(rows, []);
  if (!collected.questions.length) throw new Error("لم يُعثر على أسئلة صالحة في الملف.");
  return {
    id: base?.id || newId(),
    title: base?.title || rows.find((row) => row.form_title)?.form_title || "نموذج مستورد",
    description: base?.description || "استُورد من CSV.",
    version: base?.version || "1",
    deployed: base?.deployed ?? false,
    categories: collected.categories,
    questions: collected.questions,
    createdAt: base?.createdAt || now,
    updatedAt: now,
  };
}

type WorkbookModule = typeof import("xlsx");

function sheetMatrix(XLSX: WorkbookModule, workbook: import("xlsx").WorkBook, name: string): string[][] {
  const found = workbook.SheetNames.find((sheet) => sheet.toLowerCase() === name.toLowerCase());
  const sheet = found ? workbook.Sheets[found] : undefined;
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" }) as string[][];
}

export async function formFromXlsx(buffer: ArrayBuffer, base?: Partial<FormDef>): Promise<FormDef> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(buffer, { type: "array" });
  const survey = sheetMatrix(XLSX, workbook, "survey");
  const choicesSheet = sheetMatrix(XLSX, workbook, "choices");
  const settings = asRows(sheetMatrix(XLSX, workbook, "settings"))[0];
  const matrix = survey.length ? survey : sheetMatrix(XLSX, workbook, workbook.SheetNames[0] ?? "");
  if (!matrix.length) throw new Error("المصنف فارغ.");
  const header = matrix[0]!.map((cell) => String(cell).trim().toLowerCase());
  if (!header.includes("type") || !header.includes("name")) {
    throw new Error("ورقة survey يجب أن تحتوي type و name و label.");
  }
  const choiceRows = asRows(choicesSheet.map((line) => line.map(String)));
  const tagged: TaggedChoice[] = [];
  for (const row of choiceRows) {
    const list = row.list_name || row.list || "";
    const name = row.name || "";
    const label = row.label || name;
    const points = Number(row.points);
    if (!list || !name) continue;
    tagged.push({
      name: `${list}::${name}`,
      label,
      points: Number.isFinite(points) ? points : undefined,
    });
  }
  const rows = asRows(matrix.map((line) => line.map(String)));
  const collected = collectQuestions(rows, tagged);
  if (!collected.questions.length) throw new Error("لم يُعثر على أسئلة مدعومة في ملف XLSForm.");
  const now = new Date().toISOString();
  return {
    id: base?.id || newId(),
    title: settings?.form_title || base?.title || "نموذج مستورد",
    description: base?.description || "استُورد من XLSForm.",
    version: settings?.version || base?.version || "1",
    deployed: base?.deployed ?? false,
    categories: collected.categories,
    questions: collected.questions,
    createdAt: base?.createdAt || now,
    updatedAt: now,
  };
}

export function surveyMatrix(form: FormDef): string[][] {
  const header = [
    "type",
    "name",
    "label",
    "hint",
    "required",
    "relevant",
    "constraint",
    "constraint_message",
    "category",
    "score_expected",
    "score_tolerance",
    "choices",
  ];
  const line = (question: Question): string[] => {
    const list = `${question.name}_list`;
    const type =
      question.type === "select_one" || question.type === "select_multiple"
        ? `${question.type} ${list}`
        : question.type === "rating"
          ? "range"
          : question.type;
    const category = form.categories?.find((item) => item.id === question.categoryId)?.label ?? "";
    const inline =
      question.type === "select_one" || question.type === "select_multiple"
        ? (question.choices ?? [])
            .map((choice) => {
              const points = question.choicePoints?.[choice.name];
              return points == null ? `${choice.name}:${choice.label}` : `${choice.name}:${choice.label}:${points}`;
            })
            .join("|")
        : "";
    return [
      type,
      question.name,
      question.label,
      question.hint ?? "",
      question.required ? "yes" : "",
      question.relevant ?? "",
      question.constraint ?? "",
      question.constraintMessage ?? "",
      category,
      question.scoreExpected ?? "",
      question.scoreTolerance == null ? "" : String(question.scoreTolerance),
      inline,
    ];
  };
  const rows: string[][] = [];
  const loose = form.questions.filter((question) => !question.categoryId || !form.categories?.length);
  loose.forEach((question) => rows.push(line(question)));
  if (form.categories?.length) {
    form.categories.forEach((category, index) => {
      rows.push([
        "begin_group",
        `cat_${index + 1}`,
        category.label,
        category.description ?? "",
        "",
        category.relevant ?? "",
        "",
        "",
        category.label,
        "",
        "",
        "",
      ]);
      form.questions
        .filter((question) => question.categoryId === category.id)
        .forEach((question) => rows.push(line(question)));
      rows.push(["end_group", "", "", "", "", "", "", "", "", "", "", ""]);
    });
  }
  return [header, ...rows];
}

export async function formToXlsxBlob(form: FormDef): Promise<Blob> {
  const XLSX = await import("xlsx");
  const survey = surveyMatrix(form).map((row) => row.slice(0, -1));
  const choices: string[][] = [["list_name", "name", "label", "points"]];
  for (const question of form.questions) {
    if (question.type !== "select_one" && question.type !== "select_multiple") continue;
    for (const choice of question.choices ?? []) {
      const points = question.choicePoints?.[choice.name];
      choices.push([`${question.name}_list`, choice.name, choice.label, points == null ? "" : String(points)]);
    }
  }
  const settings = [
    ["form_title", "form_id", "version"],
    [form.title, form.id, form.version || "1"],
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(survey), "survey");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(choices), "choices");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(settings), "settings");
  const out = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  return new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export async function submissionsToXlsxBlob(form: FormDef, rows: import("./types").Submission[]): Promise<Blob> {
  const XLSX = await import("xlsx");
  const questions = form.questions.filter((question) => question.type !== "note");
  const scored = questions.filter((question) => questionIsScored(question));
  const header = [
    "_id",
    "_submitted_at",
    "_device",
    "_source",
    "_category",
    "_score",
    "_class",
    ...questions.map((question) => question.name),
    ...scored.flatMap((question) => [`${question.name}__points`, `${question.name}__class`]),
  ];
  const body = rows.map((row) => {
    const grade = gradeAnswers(form, row.answers, row.categoryId);
    const category = form.categories?.find((item) => item.id === row.categoryId)?.label ?? "";
    return [
      row.id,
      row.submittedAt,
      row.deviceLabel,
      row.source,
      category,
      grade.scored ? String(grade.average) : "",
      grade.band,
      ...questions.map((question) => {
        const value = row.answers[question.name];
        if (value == null) return "";
        if (Array.isArray(value)) return value.join(" ");
        if (value === "__image__" || value.startsWith("data:")) return "yes";
        return value;
      }),
      ...scored.flatMap((question) => {
        const line = grade.items.find((item) => item.name === question.name);
        return [line ? String(line.points) : "", line?.band ?? ""];
      }),
    ];
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([header, ...body]), "data");
  const out = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  return new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
