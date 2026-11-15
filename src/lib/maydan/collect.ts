import { z } from "zod";

const answerSchema = z.union([z.string().max(700_000), z.array(z.string().max(200)).max(40)]);

export const collectBodySchema = z.object({
  id: z.string().min(1).max(80),
  formId: z.string().min(1).max(80),
  answers: z.record(z.string().max(80), answerSchema),
  deviceLabel: z.string().max(80),
  source: z.enum(["desk", "lan"]),
  submittedAt: z.string().max(40).optional(),
  categoryId: z.string().max(80).optional(),
});

export type CollectBody = z.infer<typeof collectBodySchema>;
