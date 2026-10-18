import type { Choice, FormDef, Question, QuestionType } from "./types";
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

function choiceList(raw: string | undefined): Choice[] {
  if (!raw?.trim()) return [];
  return raw
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index) => {
      const splitAt = part.indexOf(":");
      if (splitAt === -1) return { name: `c${index + 1}`, label: part };
      return {
        name: part.slice(0, splitAt).trim() || `c${index + 1}`,
        label: part.slice(splitAt + 1).trim() || part,
      };
    });
}

function questionFromRow(row: Row, choices: Choice[], index: number): Question | null {
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

  const list = listName
    ? choices.filter((choice) => choice.name.startsWith(`${listName}::`)).map((choice) => ({
        name: choice.name.slice(listName.length + 2),
        label: choice.label,
      }))
    : choiceList(row.choices);

  return {
    id: crypto.randomUUID(),
    type,
    name: row.name || `q${index + 1}`,
    label: row.label || row.name || "سؤال",
    hint: row.hint || undefined,
    required: yes(row.required),
    relevant: row.relevant || undefined,
    constraint: row.constraint || (type === "rating" ? ". >= 1 and . <= 5" : undefined),
    constraintMessage: row.constraint_message || undefined,
    choices: type === "select_one" || type === "select_multiple" ? list : undefined,
  };
}

export function formFromCsvText(text: string, base?: Partial<FormDef>): FormDef {
  if (!looksLikeSurveyCsv(text)) {
    throw new Error("ملف CSV ليس تعريف نموذج. يلزم أعمدة type و name و label.");
  }
  const matrix = parseCsv(text);
  const rows = asRows(matrix);
  const now = new Date().toISOString();
  const questions = rows
    .map((row, index) => questionFromRow(row, [], index))
    .filter((item): item is Question => item !== null);
  if (!questions.length) throw new Error("لم يُعثر على أسئلة صالحة في الملف.");
  return {
    id: base?.id || crypto.randomUUID(),
    title: base?.title || rows.find((row) => row.form_title)?.form_title || "نموذج مستورد",
    description: base?.description || "استُورد من CSV.",
    version: base?.version || "1",
    deployed: base?.deployed ?? false,
    questions,
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
  const tagged: Choice[] = choiceRows
    .map((row) => {
      const list = row.list_name || row.list || "";
      const name = row.name || "";
      const label = row.label || name;
      if (!list || !name) return null;
      return { name: `${list}::${name}`, label };
    })
    .filter((item): item is Choice => item !== null);
  const rows = asRows(matrix.map((line) => line.map(String)));
  const questions = rows
    .map((row, index) => questionFromRow(row, tagged, index))
    .filter((item): item is Question => item !== null);
  if (!questions.length) throw new Error("لم يُعثر على أسئلة مدعومة في ملف XLSForm.");
  const now = new Date().toISOString();
  return {
    id: base?.id || crypto.randomUUID(),
    title: settings?.form_title || base?.title || "نموذج مستورد",
    description: base?.description || "استُورد من XLSForm.",
    version: settings?.version || base?.version || "1",
    deployed: base?.deployed ?? false,
    questions,
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
    "choices",
  ];
  const rows = form.questions.map((question) => {
    const list = `${question.name}_list`;
    const type =
      question.type === "select_one" || question.type === "select_multiple"
        ? `${question.type} ${list}`
        : question.type === "rating"
          ? "range"
          : question.type;
    const inline =
      question.type === "select_one" || question.type === "select_multiple"
        ? (question.choices ?? []).map((choice) => `${choice.name}:${choice.label}`).join("|")
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
      inline,
    ];
  });
  return [header, ...rows];
}

export async function formToXlsxBlob(form: FormDef): Promise<Blob> {
  const XLSX = await import("xlsx");
  const survey = surveyMatrix(form).map((row) => row.slice(0, 8));
  const choices: string[][] = [["list_name", "name", "label"]];
  for (const question of form.questions) {
    if (question.type !== "select_one" && question.type !== "select_multiple") continue;
    for (const choice of question.choices ?? []) {
      choices.push([`${question.name}_list`, choice.name, choice.label]);
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
  const header = ["_id", "_submitted_at", "_device", "_source", ...questions.map((question) => question.name)];
  const body = rows.map((row) => [
    row.id,
    row.submittedAt,
    row.deviceLabel,
    row.source,
    ...questions.map((question) => {
      const value = row.answers[question.name];
      if (value == null) return "";
      if (Array.isArray(value)) return value.join(" ");
      if (value === "__image__" || value.startsWith("data:")) return "yes";
      return value;
    }),
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([header, ...body]), "data");
  const out = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  return new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
