import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormRunner } from "@/components/maydan/runner";
import { useMaydan } from "@/lib/maydan/context";

export const Route = createFileRoute("/c/$formId")({
  component: CollectForm,
});

function CollectForm() {
  const { formId } = Route.useParams();
  const { snap, addSubmission } = useMaydan();
  const form = snap.forms.find((item) => item.id === formId);
  const [done, setDone] = useState(0);

  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link to="/c" className="text-sm font-semibold text-primary">
          كل النماذج
        </Link>
        <span className="font-display text-xs tracking-widest text-primary">MAYDAN</span>
      </div>
      {!form ? (
        <section className="rounded-lg border border-border bg-surface p-5">
          <h1 className="text-xl font-bold">النموذج غير موجود على هذا الخادم</h1>
        </section>
      ) : !form.deployed ? (
        <section className="rounded-lg border border-border bg-surface p-5">
          <h1 className="text-xl font-bold">{form.title}</h1>
          <p className="mt-2 text-sm text-muted">هذا النموذج ما زال مسودة. انشره من المكتب ليقبله الجمع الشبكي.</p>
        </section>
      ) : done > 0 ? (
        <section className="rounded-lg border border-border bg-surface p-5">
          <p className="font-display text-xs tracking-widest text-primary">SENT</p>
          <h1 className="mt-2 text-2xl font-bold text-balance">وصلت الإجابة إلى جهاز المكتب</h1>
          <p className="mt-2 text-sm text-pretty text-muted">
            حُفظت محلياً على الخادم الذي فتحته. يمكنك إرسال استمارة أخرى من دون إنترنت.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg"
            onClick={() => setDone(0)}
          >
            استمارة جديدة
          </button>
        </section>
      ) : (
        <>
          <header className="mb-4">
            <h1 className="text-2xl font-bold text-balance">{form.title}</h1>
            {form.description ? <p className="mt-2 text-sm text-pretty text-muted">{form.description}</p> : null}
          </header>
          <FormRunner
            key={done}
            form={form}
            submitLabel="إرسال إلى الجهاز المستضيف"
            onSubmit={async (answers, deviceLabel) => {
              await addSubmission({ formId: form.id, answers, deviceLabel, source: "lan" });
              toast.success("تم الإرسال");
              setDone((value) => value + 1);
            }}
          />
        </>
      )}
    </main>
  );
}
