import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getSubmission } from "@/lib/maydan/api";
import { submissionsFromCsv, submissionsToCsv } from "@/lib/maydan/csv";
import { useMaydan } from "@/lib/maydan/context";
import { downloadBlob, downloadText, fileSlug } from "@/lib/maydan/download";
import { formatWhen } from "@/lib/maydan/format";
import type { Question, Submission } from "@/lib/maydan/types";
import { IMAGE_SENTINEL } from "@/lib/maydan/types";
import { submissionsToXlsxBlob } from "@/lib/maydan/xlsform";
import { FormRunner } from "./runner";
import { Button } from "./ui";

function labelOf(question: Question, value: Submission["answers"][string] | undefined): string {
  if (value == null || value === "") return "—";
  if (value === IMAGE_SENTINEL || (typeof value === "string" && value.startsWith("data:"))) return "صورة مرفقة";
  if (question.type === "acknowledge") return value === "OK" ? "نعم" : "—";
  const names = Array.isArray(value) ? value : String(value).split(/\s+/);
  if (question.choices?.length && (question.type === "select_one" || question.type === "select_multiple")) {
    return names
      .map((name) => question.choices?.find((choice) => choice.name === name)?.label ?? name)
      .join("، ");
  }
  return Array.isArray(value) ? value.join(" ") : String(value);
}

function SummaryCharts({ questions, rows }: { questions: Question[]; rows: Submission[] }) {
  const [charts, setCharts] = useState<typeof import("recharts") | null>(null);
  const blocks = useMemo(() => {
    return questions
      .filter((question) => question.type === "select_one" || question.type === "select_multiple" || question.type === "rating")
      .slice(0, 4)
      .map((question) => {
        const buckets = new Map<string, number>();
        const keys =
          question.type === "rating"
            ? ["1", "2", "3", "4", "5"]
            : (question.choices ?? []).map((choice) => choice.name);
        keys.forEach((key) => buckets.set(key, 0));
        for (const row of rows) {
          const raw = row.answers[question.name];
          const picked = Array.isArray(raw) ? raw : raw ? String(raw).split(/\s+/).filter(Boolean) : [];
          for (const key of picked) buckets.set(key, (buckets.get(key) ?? 0) + 1);
        }
        return {
          id: question.id,
          title: question.label,
          data: [...buckets.entries()].map(([key, count]) => ({
            name: question.choices?.find((choice) => choice.name === key)?.label ?? key,
            count,
          })),
        };
      });
  }, [questions, rows]);

  useEffect(() => {
    if (charts) return;
    let cancel = false;
    void import("recharts").then((mod) => {
      if (!cancel) setCharts(mod);
    });
    return () => {
      cancel = true;
    };
  }, [charts]);

  if (!charts) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {blocks.map((block) => (
          <div key={block.id} className="rounded-lg border border-border bg-surface p-4">
            <h3 className="mb-2 text-sm font-semibold">{block.title}</h3>
            <ul className="space-y-1 text-sm">
              {block.data.map((item) => (
                <li key={item.name} className="flex justify-between gap-3">
                  <span>{item.name}</span>
                  <span className="tabular-nums">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  const { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } = charts;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {blocks.map((block) => (
        <div key={block.id} className="rounded-lg border border-border bg-surface p-4">
          <h3 className="mb-2 text-sm font-semibold text-balance">{block.title}</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={block.data}>
                <XAxis dataKey="name" tick={{ fill: "var(--color-muted)", fontSize: 12 }} interval={0} />
                <YAxis allowDecimals={false} tick={{ fill: "var(--color-muted)", fontSize: 12 }} width={28} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}

function PhotoSlot({ submissionId, name }: { submissionId: string; name: string }) {
  const [src, setSrc] = useState("");
  if (src) return <img src={src} alt="" className="mt-2 max-h-48 rounded-lg border border-border" />;
  return (
    <button
      type="button"
      className="mt-1 text-sm font-semibold text-primary"
      onClick={() => {
        void getSubmission({ data: { id: submissionId } }).then((result) => {
          const value = result.submission?.answers[name];
          if (typeof value === "string" && value.startsWith("data:")) setSrc(value);
          else toast.message("لا توجد صورة في هذه الإجابة");
        });
      }}
    >
      عرض الصورة
    </button>
  );
}

export function DataView({ formId }: { formId: string }) {
  const { snap, deleteSubmission, importSubmissions, addSubmission } = useMaydan();
  const form = snap.forms.find((item) => item.id === formId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [filling, setFilling] = useState(false);
  const rows = snap.submissions.filter((row) => row.formId === formId);

  if (!form) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <h1 className="text-xl font-bold">النموذج غير موجود</h1>
        <Link to="/" className="mt-3 inline-flex font-semibold text-primary">
          المكتبة
        </Link>
      </div>
    );
  }

  const numbers = form.questions.filter((question) => question.type === "integer" || question.type === "decimal");

  async function exportXlsx() {
    downloadBlob(await submissionsToXlsxBlob(form!, rows), `${fileSlug(form!.title)}-data.xlsx`);
  }

  async function onImport(file: File) {
    try {
      let text = "";
      if (file.name.toLowerCase().endsWith(".csv")) text = await file.text();
      else {
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ""];
        text = sheet ? XLSX.utils.sheet_to_csv(sheet) : "";
      }
      const parsed = submissionsFromCsv(text, form!);
      if (!parsed.length) {
        toast.error("لم تُقرأ صفوف. تأكد أن العناوين تطابق أسماء الحقول.");
        return;
      }
      await importSubmissions(formId, parsed);
      toast.success(`تم استيراد ${parsed.length} صفاً`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر الاستيراد");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/forms/$formId" params={{ formId }} className="text-sm font-semibold text-primary">
            تحرير النموذج
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-balance">{form.title}</h1>
          <p className="text-sm text-muted tabular-nums">{rows.length} إجابة محفوظة على هذا الخادم</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="quiet" onClick={() => downloadText(`${fileSlug(form.title)}-data.csv`, submissionsToCsv(form, rows))}>
            <Download className="size-4" />
            CSV
          </Button>
          <Button variant="quiet" onClick={() => void exportXlsx()}>
            XLSX
          </Button>
          <Button variant="quiet" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" />
            استيراد
          </Button>
          <Button variant="primary" onClick={() => setFilling((value) => !value)}>
            {filling ? "إغلاق الإدخال" : "إدخال من المكتب"}
          </Button>
          <input
            ref={fileRef}
            className="sr-only"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void onImport(file);
            }}
          />
        </div>
      </div>

      {numbers.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {numbers.map((question) => {
            const values = rows
              .map((row) => Number(row.answers[question.name]))
              .filter((value) => !Number.isNaN(value));
            const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
            return (
              <div key={question.id} className="rounded-lg border border-border bg-surface px-4 py-3">
                <p className="text-sm text-muted">{question.label}</p>
                <p className="mt-1 text-lg font-bold tabular-nums">
                  {values.length ? avg.toFixed(1) : "—"}
                  <span className="ms-2 text-sm font-medium text-muted">متوسط · {values.length} قيمة</span>
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      <SummaryCharts questions={form.questions} rows={rows} />

      {filling ? (
        <div className="rounded-lg border border-border bg-bg p-3">
          <FormRunner
            form={form}
            submitLabel="حفظ الإجابة في الدفتر"
            onSubmit={async (answers, deviceLabel) => {
              await addSubmission({ formId, answers, deviceLabel, source: "desk" });
              toast.success("حُفظت الإجابة في دفتر هذا الجهاز");
              setFilling(false);
            }}
          />
        </div>
      ) : null}

      <ul className="space-y-3">
        {rows.length === 0 ? (
          <li className="rounded-lg border border-dashed border-border bg-surface px-4 py-8 text-center text-muted">
            لا إجابات بعد. أدخل من المكتب أو افتح رابط الجمع من هاتف على الشبكة.
          </li>
        ) : (
          rows.map((row) => {
            const titleQuestion = form.questions.find((question) => question.type === "text");
            const titleValue = titleQuestion ? labelOf(titleQuestion, row.answers[titleQuestion.name]) : row.deviceLabel;
            return (
              <li key={row.id} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold">{titleValue}</h2>
                    <p className="text-sm text-muted">
                      {formatWhen(row.submittedAt)} · {row.deviceLabel} · {row.source === "lan" ? "من الشبكة" : "من المكتب"}
                    </p>
                  </div>
                  <Button variant="danger" onClick={() => void deleteSubmission(row.id)}>
                    <Trash2 className="size-4" />
                    حذف
                  </Button>
                </div>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  {form.questions
                    .filter((question) => question.type !== "note")
                    .map((question) => (
                      <div key={question.id}>
                        <dt className="text-xs text-muted">{question.label}</dt>
                        <dd className="text-sm font-medium text-fg">{labelOf(question, row.answers[question.name])}</dd>
                        {question.type === "image" &&
                        (row.answers[question.name] === IMAGE_SENTINEL ||
                          (typeof row.answers[question.name] === "string" &&
                            String(row.answers[question.name]).startsWith("data:"))) ? (
                          <PhotoSlot submissionId={row.id} name={question.name} />
                        ) : null}
                      </div>
                    ))}
                </dl>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
