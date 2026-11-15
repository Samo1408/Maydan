import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { validateAnswers } from "./logic";
import type { Answers, FormDef, NetworkInfo, Snapshot, Submission } from "./types";
import { IMAGE_SENTINEL } from "./types";

type Database = { forms: FormDef[]; submissions: Submission[] };

const filePath = path.join(process.cwd(), "data", "maydan-store.json");

/**
 * The server bundle can hold more than one copy of this module (the phone
 * intake middleware and the app's server functions are bundled separately).
 * State therefore lives on globalThis and is re-validated against the file's
 * modification time, so a row saved through one copy shows up in the other
 * without restarting the app.
 */
type Shared = { database: Database | null; mtimeMs: number; writeChain: Promise<void> };
const shared = ((globalThis as Record<string, unknown>).__alsadekStore ??= {
  database: null,
  mtimeMs: 0,
  writeChain: Promise.resolve(),
}) as Shared;

const DEMO_FORM_ID = "frm-household";

function seed(): Database {
  return { forms: [], submissions: [] };
}

function upgrade(data: Database): boolean {
  const before = data.forms.length + data.submissions.length;
  data.forms = data.forms.filter((form) => form.id !== DEMO_FORM_ID);
  data.submissions = data.submissions.filter((submission) => submission.formId !== DEMO_FORM_ID);
  return data.forms.length + data.submissions.length !== before;
}

async function persist(next: Database) {
  const payload = JSON.stringify(next);
  shared.writeChain = shared.writeChain.then(async () => {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, payload, "utf8");
    shared.mtimeMs = (await stat(filePath)).mtimeMs;
  });
  await shared.writeChain;
}

async function load(): Promise<Database> {
  let current = 0;
  try {
    current = (await stat(filePath)).mtimeMs;
  } catch {
    current = 0;
  }
  if (shared.database && current === shared.mtimeMs) return shared.database;
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Database;
    if (!Array.isArray(parsed.forms) || !Array.isArray(parsed.submissions)) throw new Error("bad store");
    const changed = upgrade(parsed);
    shared.database = parsed;
    shared.mtimeMs = current;
    if (changed) await persist(parsed);
  } catch (error) {
    const missing =
      error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT";
    if (!missing && shared.database) return shared.database;
    shared.database = seed();
    try {
      await persist(shared.database);
    } catch (writeError) {
      console.error("[alsadek] local store is memory-only", writeError);
    }
  }
  return shared.database;
}

export function networkInfo(): NetworkInfo {
  const addresses: NetworkInfo["addresses"] = [];
  for (const [name, list] of Object.entries(os.networkInterfaces())) {
    for (const item of list ?? []) {
      const family = String(item.family);
      if (item.internal || (family !== "IPv4" && family !== "4")) continue;
      addresses.push({ name, address: item.address });
    }
  }
  return { port: Number(process.env.PORT) || 8080, addresses };
}

function slim(submission: Submission): Submission {
  const answers: Answers = {};
  for (const [key, value] of Object.entries(submission.answers)) {
    answers[key] = typeof value === "string" && value.startsWith("data:") ? IMAGE_SENTINEL : value;
  }
  return { ...submission, answers };
}

function sorted(data: Database): Database {
  return {
    forms: [...data.forms].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    submissions: [...data.submissions].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
  };
}

export async function snapshot(): Promise<Snapshot> {
  const data = sorted(await load());
  return {
    forms: data.forms,
    submissions: data.submissions.map(slim),
    network: networkInfo(),
  };
}

export async function upsertForm(form: FormDef): Promise<Snapshot> {
  const data = await load();
  const next: FormDef = { ...form, updatedAt: new Date().toISOString() };
  const index = data.forms.findIndex((item) => item.id === next.id);
  if (index === -1) data.forms.unshift(next);
  else data.forms[index] = next;
  shared.database = data;
  await persist(data);
  return snapshot();
}

export async function removeForm(id: string): Promise<Snapshot> {
  const data = await load();
  data.forms = data.forms.filter((form) => form.id !== id);
  data.submissions = data.submissions.filter((submission) => submission.formId !== id);
  shared.database = data;
  await persist(data);
  return snapshot();
}

export async function insertSubmission(input: {
  id: string;
  formId: string;
  answers: Answers;
  deviceLabel: string;
  source: "desk" | "lan";
  submittedAt?: string;
  categoryId?: string;
}): Promise<Snapshot> {
  const data = await load();
  if (data.submissions.some((item) => item.id === input.id)) return snapshot();
  const form = data.forms.find((item) => item.id === input.formId);
  if (!form) throw new Error("النموذج غير موجود");
  if (!form.deployed && input.source === "lan") throw new Error("النموذج غير منشور على الشبكة");
  if (input.categoryId && !form.categories?.some((category) => category.id === input.categoryId)) {
    throw new Error("الفئة غير موجودة في هذا النموذج");
  }
  const errors = validateAnswers(form, input.answers, input.categoryId);
  const messages = Object.values(errors);
  if (messages.length) throw new Error(messages[0] ?? "الإجابة غير مكتملة");
  for (const value of Object.values(input.answers)) {
    if (typeof value === "string" && value.length > 700_000) throw new Error("الصورة أكبر من الحد المسموح");
  }
  data.submissions.unshift({
    id: input.id,
    formId: input.formId,
    answers: input.answers,
    deviceLabel: input.deviceLabel.trim().slice(0, 80) || "جهاز",
    source: input.source,
    submittedAt: input.submittedAt || new Date().toISOString(),
    categoryId: input.categoryId,
  });
  shared.database = data;
  await persist(data);
  return snapshot();
}

export async function removeSubmission(id: string): Promise<Snapshot> {
  const data = await load();
  data.submissions = data.submissions.filter((submission) => submission.id !== id);
  shared.database = data;
  await persist(data);
  return snapshot();
}

export async function importRows(
  formId: string,
  rows: { id: string; answers: Answers; deviceLabel?: string; submittedAt?: string }[],
): Promise<Snapshot> {
  const data = await load();
  const form = data.forms.find((item) => item.id === formId);
  if (!form) throw new Error("النموذج غير موجود");
  for (const row of rows.slice(0, 500)) {
    if (data.submissions.some((item) => item.id === row.id)) continue;
    data.submissions.unshift({
      id: row.id,
      formId,
      answers: row.answers,
      deviceLabel: row.deviceLabel?.trim().slice(0, 80) || "استيراد",
      source: "desk",
      submittedAt: row.submittedAt || new Date().toISOString(),
    });
  }
  shared.database = data;
  await persist(data);
  return snapshot();
}

export async function readSubmission(id: string): Promise<Submission | null> {
  const data = await load();
  return data.submissions.find((submission) => submission.id === id) ?? null;
}
