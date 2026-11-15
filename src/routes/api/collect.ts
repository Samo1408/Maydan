import { createFileRoute } from "@tanstack/react-router";
import { collectBodySchema } from "@/lib/maydan/collect";

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export const Route = createFileRoute("/api/collect")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const raw = await request.json();
          const parsed = collectBodySchema.safeParse(raw);
          if (!parsed.success) return json({ ok: false, message: "البيانات المرسلة غير صالحة" }, 400);
          const { insertSubmission } = await import("@/lib/maydan/store.server");
          await insertSubmission(parsed.data);
          console.log(`ALSADEK saved ${parsed.data.id} form=${parsed.data.formId} source=${parsed.data.source}`);
          return json({ ok: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : "تعذّر حفظ الإجابة";
          console.error(`ALSADEK save failed: ${message}`);
          return json({ ok: false, message }, 400);
        }
      },
    },
  },
});
