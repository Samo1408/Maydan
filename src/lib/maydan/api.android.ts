import type { FormDef, Snapshot, Submission } from "./types";

type ServerCall<T> = { data: T };

async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) throw new Error(payload.error || `تعذّر الاتصال بالخادم (${response.status})`);
  return payload;
}

export function getSnapshot(): Promise<Snapshot> {
  return request<Snapshot>("/api/snapshot");
}
export function saveForm({ data }: ServerCall<FormDef>): Promise<Snapshot> {
  return request<Snapshot>("/api/forms/save", data);
}
export function deleteForm({ data }: ServerCall<{ id: string }>): Promise<Snapshot> {
  return request<Snapshot>("/api/forms/delete", data);
}
export function addSubmission({ data }: ServerCall<{
  id: string;
  formId: string;
  answers: Record<string, string | string[]>;
  deviceLabel: string;
  source: "desk" | "lan";
  submittedAt?: string;
}>): Promise<Snapshot> {
  return request<Snapshot>("/api/submissions/add", data);
}
export function deleteSubmission({ data }: ServerCall<{ id: string }>): Promise<Snapshot> {
  return request<Snapshot>("/api/submissions/delete", data);
}
export function importSubmissions({ data }: ServerCall<{
  formId: string;
  rows: { id: string; answers: Record<string, string | string[]>; deviceLabel?: string; submittedAt?: string }[];
}>): Promise<Snapshot> {
  return request<Snapshot>("/api/submissions/import", data);
}
export function getSubmission({ data }: ServerCall<{ id: string }>): Promise<{ submission: Submission | null }> {
  return request<{ submission: Submission | null }>("/api/submissions/get", data);
}
