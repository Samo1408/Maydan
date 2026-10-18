import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { QUESTION_TYPES } from "./types";
import type { Snapshot, Submission } from "./types";

const choiceSchema = z.object({
  name: z.string().min(1).max(80),
  label: z.string().max(200),
});

const questionSchema = z.object({
  id: z.string().min(1).max(80),
  type: z.enum(QUESTION_TYPES),
  name: z.string().min(1).max(80),
  label: z.string().max(500),
  hint: z.string().max(500).optional(),
  required: z.boolean().optional(),
  choices: z.array(choiceSchema).max(60).optional(),
  relevant: z.string().max(400).optional(),
  constraint: z.string().max(400).optional(),
  constraintMessage: z.string().max(300).optional(),
});

const formSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().max(180),
  description: z.string().max(1000),
  version: z.string().max(40),
  deployed: z.boolean(),
  questions: z.array(questionSchema).max(150),
  createdAt: z.string().max(40),
  updatedAt: z.string().max(40),
});

const answerSchema = z.union([z.string().max(700_000), z.array(z.string().max(200)).max(40)]);

const submissionInput = z.object({
  id: z.string().min(1).max(80),
  formId: z.string().min(1).max(80),
  answers: z.record(z.string().max(80), answerSchema),
  deviceLabel: z.string().max(80),
  source: z.enum(["desk", "lan"]),
  submittedAt: z.string().max(40).optional(),
});

function parsed<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) throw new Error("البيانات المرسلة غير صالحة");
  return result.data;
}

export const getSnapshot = createServerFn({ method: "GET" }).handler(async (): Promise<Snapshot> => {
  const store = await import("./store.server");
  return store.snapshot();
});

export const saveForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => parsed(formSchema, data))
  .handler(async ({ data }): Promise<Snapshot> => {
    const store = await import("./store.server");
    return store.upsertForm(data);
  });

export const deleteForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => parsed(z.object({ id: z.string().min(1).max(80) }), data))
  .handler(async ({ data }): Promise<Snapshot> => {
    const store = await import("./store.server");
    return store.removeForm(data.id);
  });

export const addSubmission = createServerFn({ method: "POST" })
  .validator((data: unknown) => parsed(submissionInput, data))
  .handler(async ({ data }): Promise<Snapshot> => {
    const store = await import("./store.server");
    return store.insertSubmission(data);
  });

export const deleteSubmission = createServerFn({ method: "POST" })
  .validator((data: unknown) => parsed(z.object({ id: z.string().min(1).max(80) }), data))
  .handler(async ({ data }): Promise<Snapshot> => {
    const store = await import("./store.server");
    return store.removeSubmission(data.id);
  });

export const importSubmissions = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    parsed(
      z.object({
        formId: z.string().min(1).max(80),
        rows: z
          .array(
            z.object({
              id: z.string().min(1).max(80),
              answers: z.record(z.string().max(80), answerSchema),
              deviceLabel: z.string().max(80).optional(),
              submittedAt: z.string().max(40).optional(),
            }),
          )
          .max(500),
      }),
      data,
    ),
  )
  .handler(async ({ data }): Promise<Snapshot> => {
    const store = await import("./store.server");
    return store.importRows(data.formId, data.rows);
  });

export const getSubmission = createServerFn({ method: "POST" })
  .validator((data: unknown) => parsed(z.object({ id: z.string().min(1).max(80) }), data))
  .handler(async ({ data }): Promise<{ submission: Submission | null }> => {
    const store = await import("./store.server");
    return { submission: await store.readSubmission(data.id) };
  });
