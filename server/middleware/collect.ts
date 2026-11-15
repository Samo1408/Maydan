import { collectBodySchema } from "../../src/lib/maydan/collect";
import { insertSubmission } from "../../src/lib/maydan/store.server";

type CollectEvent = {
  url?: URL;
  req?: { method?: string; json?: () => Promise<unknown> };
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

/** Plain JSON intake. Phones on the LAN do not use the server-function channel. */
export default async function collectMiddleware(event: CollectEvent, next: () => unknown | Promise<unknown>) {
  const method = String(event.req?.method ?? "GET").toUpperCase();
  if (method !== "POST" || event.url?.pathname !== "/api/collect") return next();

  try {
    const raw = typeof event.req?.json === "function" ? await event.req.json() : null;
    const parsed = collectBodySchema.safeParse(raw);
    if (!parsed.success) return json({ ok: false, message: "البيانات المرسلة غير صالحة" }, 400);
    await insertSubmission(parsed.data);
    console.log(`ALSADEK saved ${parsed.data.id} form=${parsed.data.formId} source=${parsed.data.source}`);
    return json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذّر حفظ الإجابة";
    console.error(`ALSADEK save failed: ${message}`);
    return json({ ok: false, message }, 400);
  }
}
