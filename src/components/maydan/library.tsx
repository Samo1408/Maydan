import { useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FileSpreadsheet, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useMaydan } from "@/lib/maydan/context";
import { isSameLocalDay } from "@/lib/maydan/format";
import { normalizeForm } from "@/lib/maydan/logic";
import type { FormDef } from "@/lib/maydan/types";
import { formFromCsvText, formFromXlsx } from "@/lib/maydan/xlsform";
import { NetworkCard } from "./network-card";
import { Button } from "./ui";

function blankForm(): FormDef {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "نموذج جديد",
    description: "",
    version: "1",
    deployed: false,
    createdAt: now,
    updatedAt: now,
    questions: [
      {
        id: crypto.randomUUID(),
        type: "note",
        name: "intro",
        label: "تعليمات قصيرة لجامع البيانات قبل بدء الأسئلة.",
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        name: "respondent_name",
        label: "الاسم",
        required: true,
      },
    ],
  };
}

export function Library() {
  const { snap, saveForm, deleteForm } = useMaydan();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const today = snap.submissions.filter((row) => isSameLocalDay(row.submittedAt)).length;
  const deployed = snap.forms.filter((form) => form.deployed).length;

  async function createForm() {
    const form = normalizeForm(blankForm());
    await saveForm(form);
    await navigate({ to: "/forms/$formId", params: { formId: form.id } });
  }

  async function importFile(file: File) {
    try {
      const base = { id: crypto.randomUUID(), deployed: false, createdAt: new Date().toISOString() };
      const form = file.name.toLowerCase().endsWith(".csv")
        ? formFromCsvText(await file.text(), base)
        : await formFromXlsx(await file.arrayBuffer(), base);
      const next = normalizeForm(form);
      await saveForm(next);
      toast.success("تم استيراد النموذج");
      await navigate({ to: "/forms/$formId", params: { formId: next.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر الاستيراد");
    }
  }

  const stats = [
    { label: "النماذج", value: snap.forms.length },
    { label: "منشورة على الشبكة", value: deployed },
    { label: "كل الإجابات", value: snap.submissions.length },
    { label: "اليوم", value: today },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
        <div className="absolute inset-y-0 start-0 w-2 bg-primary" aria-hidden="true" />
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 py-5 ps-6">
          <div className="max-w-xl">
            <p className="font-display text-xs tracking-widest text-primary">FIELD LEDGER</p>
            <h1 className="mt-1 text-3xl font-bold text-balance text-fg">دفتر النماذج الميداني</h1>
            <p className="mt-2 text-pretty text-muted">
              ابنِ النموذج، استورد XLSForm أو CSV، ثم انشره على عنوان جهازك. أي هاتف على نفس الراوتر يعبّئ ويرسل، والبيانات لا تغادر الشبكة.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => void createForm()}>
              <Plus className="size-4" aria-hidden="true" />
              نموذج جديد
            </Button>
            <Button variant="quiet" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" aria-hidden="true" />
              استيراد
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void importFile(file);
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-surface px-4 py-3">
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-fg">{stat.value}</p>
          </div>
        ))}
      </div>

      <NetworkCard forms={snap.forms} network={snap.network} />

      <section className="space-y-3">
        <h2 className="text-lg font-bold">النماذج</h2>
        {snap.forms.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-surface px-4 py-8 text-center text-muted">
            لا نماذج بعد. أنشئ واحداً أو استورد ملف XLSForm.
          </p>
        ) : (
          <ul className="grid gap-3">
            {snap.forms.map((form) => {
              const count = snap.submissions.filter((row) => row.formId === form.id).length;
              return (
                <li key={form.id} className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-fg">{form.title}</h3>
                        <span
                          className={
                            form.deployed
                              ? "rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-fg"
                              : "rounded-full bg-rule px-2 py-1 text-xs font-semibold text-muted"
                          }
                        >
                          {form.deployed ? "منشور" : "مسودة"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-pretty text-muted">
                        {form.description || "بلا وصف"} · {form.questions.length} سؤالاً · {count} إجابة
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/forms/$formId"
                        params={{ formId: form.id }}
                        className="inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold"
                      >
                        تحرير
                      </Link>
                      <Link
                        to="/forms/$formId/data"
                        params={{ formId: form.id }}
                        className="inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold"
                      >
                        <FileSpreadsheet className="me-2 size-4" aria-hidden="true" />
                        البيانات
                      </Link>
                      <Button
                        variant="danger"
                        onClick={() => {
                          if (pendingDelete !== form.id) {
                            setPendingDelete(form.id);
                            return;
                          }
                          setPendingDelete(null);
                          void deleteForm(form.id);
                        }}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        {pendingDelete === form.id ? "تأكيد الحذف" : "حذف"}
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
