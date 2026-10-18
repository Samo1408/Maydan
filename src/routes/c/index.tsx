import { createFileRoute, Link } from "@tanstack/react-router";
import { useMaydan } from "@/lib/maydan/context";

export const Route = createFileRoute("/c/")({
  component: CollectIndex,
});

function CollectIndex() {
  const { snap } = useMaydan();
  const forms = snap.forms.filter((form) => form.deployed);
  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 py-6">
      <p className="font-display text-xs tracking-widest text-primary">MAYDAN</p>
      <h1 className="mt-1 text-3xl font-bold">النماذج الجاهزة للتعبئة</h1>
      <p className="mt-2 text-sm text-pretty text-muted">
        أنت على شبكة الجهاز المستضيف. اختر نموذجاً، أرسله، وتُحفظ الإجابة هناك مباشرة.
      </p>
      <ul className="mt-5 space-y-3">
        {forms.length === 0 ? (
          <li className="rounded-lg border border-border bg-surface p-4 text-muted">لا يوجد نموذج منشور بعد.</li>
        ) : (
          forms.map((form) => (
            <li key={form.id}>
              <Link
                to="/c/$formId"
                params={{ formId: form.id }}
                className="block rounded-lg border border-border bg-surface p-4"
              >
                <span className="block text-lg font-bold text-fg">{form.title}</span>
                <span className="mt-1 block text-sm text-muted">{form.description || `${form.questions.length} سؤالاً`}</span>
              </Link>
            </li>
          ))
        )}
      </ul>
      <Link to="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-primary">
        فتح مكتب النماذج
      </Link>
    </main>
  );
}
