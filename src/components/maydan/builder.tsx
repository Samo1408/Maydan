import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Download, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useMaydan } from "@/lib/maydan/context";
import { downloadBlob, downloadText, fileSlug } from "@/lib/maydan/download";
import { normalizeForm, sanitizeName } from "@/lib/maydan/logic";
import type { FormDef, Question, QuestionType, ScoreBand } from "@/lib/maydan/types";
import { DEFAULT_SCORE_BANDS, QUESTION_TYPES } from "@/lib/maydan/types";
import { formFromCsvText, formToXlsxBlob, surveyMatrix } from "@/lib/maydan/xlsform";
import { formFromXlsx } from "@/lib/maydan/xlsform";
import { toCsv } from "@/lib/maydan/csv";
import { FormRunner } from "./runner";
import { TYPE_META } from "./type-meta";
import { Button, Field, TextArea, TextInput, Toggle } from "./ui";
import { newId } from "@/lib/maydan/id";
import { blankForm } from "@/lib/maydan/blank";
import { cn } from "@/lib/cn";

function freshQuestion(type: QuestionType, index: number): Question {
  const id = newId();
  const base: Question = {
    id,
    type,
    name: `q${index}`,
    label: TYPE_META[type].label,
    required: type !== "note" && type !== "image",
  };
  if (type === "select_one" || type === "select_multiple") {
    base.choices = [
      { name: "yes", label: "نعم" },
      { name: "no", label: "لا" },
    ];
  }
  if (type === "rating") base.constraint = ". >= 1 and . <= 5";
  if (type === "note") {
    base.required = false;
    base.label = "ملاحظة تظهر لجامع البيانات ولا تُجمع كإجابة.";
  }
  return base;
}

export function Builder({ formId, isNew = false }: { formId: string; isNew?: boolean }) {
  const { snap, saveForm, offline } = useMaydan();
  const remote = snap.forms.find((form) => form.id === formId);
  const [fresh] = useState<FormDef | null>(() => (!remote && isNew ? blankForm(formId) : null));
  const [draft, setDraft] = useState<FormDef | null>(remote ?? fresh);
  const [activeId, setActiveId] = useState((remote ?? fresh)?.questions[0]?.id ?? "");
  const [status, setStatus] = useState(fresh ? "نموذج جديد غير محفوظ" : "محفوظ");
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(Boolean(fresh));
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!remote) return;
    setDraft((current) => (!current || current.id !== remote.id ? remote : current));
    setActiveId((current) => current || remote.questions[0]?.id || "");
  }, [remote]);

  useEffect(() => {
    if (!dirty) return;
    const onLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  function update(patch: Partial<FormDef> | ((form: FormDef) => FormDef)) {
    setDirty(true);
    setStatus("تعديلات غير محفوظة");
    setDraft((current) => {
      if (!current) return current;
      return typeof patch === "function" ? patch(current) : { ...current, ...patch };
    });
  }

  async function saveDraft() {
    if (!draft) return;
    const normalized = normalizeForm(draft);
    setDraft(normalized);
    setSaving(true);
    setStatus("يحفظ…");
    try {
      await saveForm(normalized);
      setDirty(false);
      setStatus(offline ? "محفوظ على الجهاز" : "محفوظ");
      toast.success("تم حفظ النموذج");
    } catch {
      setStatus("تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  if (!draft) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <h1 className="text-xl font-bold">النموذج غير موجود</h1>
        <Link to="/" className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary">
          العودة إلى المكتبة
        </Link>
      </div>
    );
  }

  const active = draft.questions.find((question) => question.id === activeId) ?? draft.questions[0];

  function patchQuestion(id: string, patch: Partial<Question>) {
    update((form) => ({
      ...form,
      questions: form.questions.map((question) => (question.id === id ? { ...question, ...patch } : question)),
    }));
  }

  async function exportXlsx() {
    if (!draft) return;
    const blob = await formToXlsxBlob(normalizeForm(draft));
    downloadBlob(blob, `${fileSlug(draft.title)}.xlsx`);
  }

  function exportCsv() {
    if (!draft) return;
    downloadText(`${fileSlug(draft.title)}-survey.csv`, toCsv(surveyMatrix(normalizeForm(draft))));
  }

  async function importFile(file: File) {
    if (!draft) return;
    try {
      const next = file.name.toLowerCase().endsWith(".csv")
        ? formFromCsvText(await file.text(), draft)
        : await formFromXlsx(await file.arrayBuffer(), draft);
      setDirty(true);
      setStatus("تعديلات غير محفوظة");
      setDraft(normalizeForm({ ...next, id: draft.id, createdAt: draft.createdAt }));
      toast.success("استُبدلت أسئلة هذا النموذج بمحتوى الملف");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر الاستيراد");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Link to="/" className="text-sm font-semibold text-primary">
          المكتبة
        </Link>
        <span className="text-muted">/</span>
        <Link to="/forms/$formId/data" params={{ formId }} className="text-sm font-semibold text-primary">
          البيانات
        </Link>
        <span className="ms-auto text-sm text-muted">{status}</span>
        <Button variant="primary" disabled={saving} onClick={() => void saveDraft()}>
          {saving ? "يحفظ…" : dirty && fresh && !remote ? "حفظ النموذج الجديد" : "حفظ"}
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
          <Field label="عنوان النموذج">
            <TextInput value={draft.title} onChange={(event) => update({ title: event.target.value })} />
          </Field>
        </div>
          <div className="md:pt-6">
            <Toggle
              checked={draft.deployed}
              label={draft.deployed ? "منشور على الشبكة" : "مسودة"}
              onChange={(deployed) => update({ deployed })}
            />
          </div>
        </div>
        <div className="mt-3">
          <Field label="وصف قصير" hint="يظهر في المكتبة وصفحة الجمع">
            <TextArea value={draft.description} onChange={(event) => update({ description: event.target.value })} />
          </Field>
        </div>
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <div>
            <p className="text-sm font-semibold">فئات داخل النموذج</p>
            <p className="mt-1 text-sm text-pretty text-muted">
              بعد النشر تظهر الفئات أولاً. اختيار فئة يفتح أسئلتها فقط. السؤال بلا فئة يظهر داخل كل الفئات.
            </p>
          </div>
          {(draft.categories ?? []).map((category, index) => (
            <div key={category.id} className="grid gap-2 rounded-lg border border-border bg-bg p-3 md:grid-cols-2">
              <Field label={`الفئة ${index + 1}`}>
                <TextInput
                  value={category.label}
                  onChange={(event) =>
                    update((form) => ({
                      ...form,
                      categories: (form.categories ?? []).map((item) =>
                        item.id === category.id ? { ...item, label: event.target.value } : item,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="وصف الفئة">
                <TextInput
                  value={category.description ?? ""}
                  onChange={(event) =>
                    update((form) => ({
                      ...form,
                      categories: (form.categories ?? []).map((item) =>
                        item.id === category.id ? { ...item, description: event.target.value } : item,
                      ),
                    }))
                  }
                />
              </Field>
              <div className="md:col-span-2">
              <Field label="شرط الظهور" hint="مثل سؤال: ${role} = 'field' أو selected(${services}, 'water')">
                <TextInput
                  dir="ltr"
                  value={category.relevant ?? ""}
                  onChange={(event) =>
                    update((form) => ({
                      ...form,
                      categories: (form.categories ?? []).map((item) =>
                        item.id === category.id ? { ...item, relevant: event.target.value } : item,
                      ),
                    }))
                  }
                />
              </Field>
              </div>
              <div className="md:col-span-2">
                <Button
                  variant="ghost"
                  onClick={() =>
                    update((form) => ({
                      ...form,
                      categories: (form.categories ?? []).filter((item) => item.id !== category.id),
                      questions: form.questions.map((question) =>
                        question.categoryId === category.id ? { ...question, categoryId: undefined } : question,
                      ),
                    }))
                  }
                >
                  <Trash2 className="size-4" />
                  حذف الفئة
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="quiet"
            onClick={() =>
              update((form) => ({
                ...form,
                categories: [
                  ...(form.categories ?? []),
                  {
                    id: newId(),
                    label: `فئة ${String.fromCharCode(65 + (form.categories?.length ?? 0))}`,
                    description: "",
                  },
                ],
              }))
            }
          >
            <Plus className="size-4" />
            فئة
          </Button>
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-4">
          <p className="text-sm font-semibold">تصنيف النقاط من 0 إلى 10</p>
          <p className="text-sm text-pretty text-muted">
            كل سؤال مُقيَّم يأخذ نقطة حسب قربه من الإجابة المرجعية، ثم يُكتب التصنيف تلقائياً في البيانات.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {(draft.scoreBands?.length ? draft.scoreBands : DEFAULT_SCORE_BANDS).map((band, index) => (
              <div key={`${band.label}-${index}`} className="flex items-center gap-2">
                <TextInput
                  dir="ltr"
                  className="w-20"
                  inputMode="decimal"
                  aria-label="حد التصنيف"
                  value={String(band.min)}
                  onChange={(event) => {
                    const bands: ScoreBand[] = [
                      ...(draft.scoreBands?.length ? draft.scoreBands : DEFAULT_SCORE_BANDS),
                    ];
                    const min = Number(event.target.value);
                    bands[index] = { ...bands[index]!, min: Number.isNaN(min) ? 0 : min };
                    update({ scoreBands: bands });
                  }}
                />
                <TextInput
                  aria-label="اسم التصنيف"
                  value={band.label}
                  onChange={(event) => {
                    const bands: ScoreBand[] = [
                      ...(draft.scoreBands?.length ? draft.scoreBands : DEFAULT_SCORE_BANDS),
                    ];
                    bands[index] = { ...bands[index]!, label: event.target.value };
                    update({ scoreBands: bands });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="quiet" onClick={() => void exportXlsx()}>
            <Download className="size-4" />
            تصدير XLSForm
          </Button>
          <Button variant="quiet" onClick={exportCsv}>
            تصدير CSV
          </Button>
          <Button variant="quiet" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" />
            استيراد
          </Button>
          <Button variant="ghost" onClick={() => setPreview((value) => !value)}>
            {preview ? "إخفاء المعاينة" : "معاينة التعبئة"}
          </Button>
          <input
            ref={fileRef}
            className="sr-only"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void importFile(file);
            }}
          />
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <aside className="space-y-3 rounded-lg border border-border bg-surface p-3 lg:col-span-1">
          <p className="px-1 text-sm font-semibold">الأسئلة</p>
          <ul className="space-y-1">
            {draft.questions.map((question, index) => {
              const Icon = TYPE_META[question.type].icon;
              return (
                <li key={question.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveId(question.id)}
                    className={cn(
                      "flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-start text-sm",
                      active?.id === question.id ? "bg-primary text-primary-fg" : "hover:bg-rule",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{question.label}</span>
                  </button>
                  <button
                    type="button"
                    className="grid size-11 place-items-center rounded-lg hover:bg-rule"
                    aria-label="تحريك لأعلى"
                    onClick={() =>
                      update((form) => {
                        if (index === 0) return form;
                        const questions = [...form.questions];
                        const [item] = questions.splice(index, 1);
                        questions.splice(index - 1, 0, item!);
                        return { ...form, questions };
                      })
                    }
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="grid size-11 place-items-center rounded-lg hover:bg-rule"
                    aria-label="تحريك لأسفل"
                    onClick={() =>
                      update((form) => {
                        if (index === form.questions.length - 1) return form;
                        const questions = [...form.questions];
                        const [item] = questions.splice(index, 1);
                        questions.splice(index + 1, 0, item!);
                        return { ...form, questions };
                      })
                    }
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="grid grid-cols-2 gap-2">
            {QUESTION_TYPES.map((type) => {
              const Icon = TYPE_META[type].icon;
              return (
                <button
                  key={type}
                  type="button"
                  className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-bg px-2 text-start text-xs font-semibold hover:border-primary"
                  onClick={() => {
                    const question = freshQuestion(type, draft.questions.length + 1);
                    update((form) => ({ ...form, questions: [...form.questions, question] }));
                    setActiveId(question.id);
                  }}
                >
                  <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {TYPE_META[type].label}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-4 lg:col-span-2">
          {active ? (
            <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold">{TYPE_META[active.type].label}</h2>
                <Button
                  variant="danger"
                  onClick={() =>
                    update((form) => ({
                      ...form,
                      questions: form.questions.filter((question) => question.id !== active.id),
                    }))
                  }
                >
                  <Trash2 className="size-4" />
                  حذف السؤال
                </Button>
              </div>
              <Field label="نص السؤال">
                <TextArea value={active.label} onChange={(event) => patchQuestion(active.id, { label: event.target.value })} />
              </Field>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="اسم الحقل في الملف" hint="أحرف لاتينية، كما في XLSForm">
                  <TextInput
                    dir="ltr"
                    value={active.name}
                    onChange={(event) => patchQuestion(active.id, { name: event.target.value })}
                    onBlur={(event) =>
                      patchQuestion(active.id, {
                        name: sanitizeName(event.target.value, `q${draft.questions.length}`),
                      })
                    }
                  />
                </Field>
                <Field label="تلميح">
                  <TextInput
                    value={active.hint ?? ""}
                    onChange={(event) => patchQuestion(active.id, { hint: event.target.value })}
                  />
                </Field>
              </div>
              {active.type !== "note" ? (
                <Toggle
                  checked={Boolean(active.required)}
                  label="مطلوب"
                  onChange={(required) => patchQuestion(active.id, { required })}
                />
              ) : null}
              {(draft.categories ?? []).length ? (
                <Field label="الفئة" hint="بلا فئة يعني أن السؤال يظهر داخل كل الفئات">
                  <select
                    value={active.categoryId ?? ""}
                    onChange={(event) => patchQuestion(active.id, { categoryId: event.target.value || undefined })}
                    className="h-11 w-full rounded-lg border border-border bg-bg px-3 text-fg"
                  >
                    <option value="">تظهر في كل الفئات</option>
                    {(draft.categories ?? []).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}
              {active.type === "select_one" || active.type === "select_multiple" ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">الخيارات</p>
                  <p className="text-xs text-muted">عمود النقاط من 0 إلى 10. الأقرب للمرجع أو الأعلى نقاطاً هو الأفضل.</p>
                  {(active.choices ?? []).map((choice, index) => (
                    <div key={`${active.id}-${index}`} className="flex flex-wrap items-center gap-2">
                      <TextInput
                        dir="ltr"
                        className="min-w-0 flex-1"
                        value={choice.name}
                        aria-label="اسم الخيار"
                        onChange={(event) => {
                          const nextName = event.target.value;
                          const points = { ...(active.choicePoints ?? {}) };
                          if (choice.name !== nextName && points[choice.name] != null) {
                            points[nextName] = points[choice.name]!;
                            delete points[choice.name];
                          }
                          patchQuestion(active.id, {
                            choicePoints: points,
                            choices: (active.choices ?? []).map((item, itemIndex) =>
                              itemIndex === index ? { ...item, name: nextName } : item,
                            ),
                          });
                        }}
                      />
                      <TextInput
                        className="min-w-0 flex-1"
                        value={choice.label}
                        aria-label="تسمية الخيار"
                        onChange={(event) =>
                          patchQuestion(active.id, {
                            choices: (active.choices ?? []).map((item, itemIndex) =>
                              itemIndex === index ? { ...item, label: event.target.value } : item,
                            ),
                          })
                        }
                      />
                      <TextInput
                        dir="ltr"
                        className="w-20"
                        inputMode="decimal"
                        aria-label="نقاط الخيار من 0 إلى 10"
                        placeholder="0-10"
                        value={active.choicePoints?.[choice.name] ?? ""}
                        onChange={(event) => {
                          const next = { ...(active.choicePoints ?? {}) };
                          if (event.target.value.trim() === "") delete next[choice.name];
                          else next[choice.name] = Math.min(10, Math.max(0, Number(event.target.value) || 0));
                          patchQuestion(active.id, { choicePoints: next });
                        }}
                      />
                      <Button
                        variant="ghost"
                        aria-label="حذف الخيار"
                        onClick={() =>
                          patchQuestion(active.id, {
                            choices: (active.choices ?? []).filter((_, itemIndex) => itemIndex !== index),
                          })
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="quiet"
                    onClick={() =>
                      patchQuestion(active.id, {
                        choices: [...(active.choices ?? []), { name: `c${(active.choices?.length ?? 0) + 1}`, label: "خيار" }],
                      })
                    }
                  >
                    <Plus className="size-4" />
                    خيار
                  </Button>
                </div>
              ) : null}
              <Field label="شرط الظهور" hint="مثال: ${housing_type} = 'tent' أو selected(${services}, 'water')">
                <TextInput
                  dir="ltr"
                  value={active.relevant ?? ""}
                  onChange={(event) => patchQuestion(active.id, { relevant: event.target.value })}
                />
              </Field>
              {active.type !== "note" && active.type !== "select_one" && active.type !== "select_multiple" ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="قيد القيمة" hint="مثال: . >= 1 and . <= 30">
                    <TextInput
                      dir="ltr"
                      value={active.constraint ?? ""}
                      onChange={(event) => patchQuestion(active.id, { constraint: event.target.value })}
                    />
                  </Field>
                  <Field label="رسالة القيد">
                    <TextInput
                      value={active.constraintMessage ?? ""}
                      onChange={(event) => patchQuestion(active.id, { constraintMessage: event.target.value })}
                    />
                  </Field>
                </div>
              ) : null}
              {active.type !== "note" && active.type !== "image" && active.type !== "geopoint" ? (
                <div className="grid gap-3 border-t border-border pt-3 md:grid-cols-2">
                  <Field
                    label="الإجابة المرجعية"
                    hint="للرقم اكتب القيمة المثالية. للاختيار اكتب اسم الخيار، أو ضع نقاطاً لكل خيار."
                  >
                    <TextInput
                      dir="ltr"
                      value={active.scoreExpected ?? ""}
                      onChange={(event) => patchQuestion(active.id, { scoreExpected: event.target.value })}
                    />
                  </Field>
                  {active.type === "integer" || active.type === "decimal" || active.type === "rating" ? (
                    <Field label="مسافة الصفر" hint="فرق الرقم عن المرجع الذي تصبح عنده النقطة 0">
                      <TextInput
                        dir="ltr"
                        inputMode="decimal"
                        value={active.scoreTolerance ?? ""}
                        onChange={(event) => {
                          const raw = event.target.value.trim();
                          const tolerance = Number(raw);
                          patchQuestion(active.id, {
                            scoreTolerance: raw === "" || Number.isNaN(tolerance) ? undefined : tolerance,
                          });
                        }}
                      />
                    </Field>
                  ) : (
                    <p className="self-end text-sm text-pretty text-muted">
                      المطابقة التامة 10. القريب يأخذ نقطة أقل، والبعيد 0. التصنيف يُكتب في البيانات.
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-6 text-muted">
              أضف سؤالاً من القائمة.
            </p>
          )}

          {preview ? (
            <div className="rounded-lg border border-border bg-bg p-3">
              <p className="mb-3 text-sm font-semibold">معاينة — الإرسال هنا تجريبي ولا يُحفظ</p>
              <FormRunner
                form={normalizeForm(draft)}
                submitLabel="تجربة الإرسال"
                onSubmit={async () => {
                  toast.success("المعاينة سليمة. انشر النموذج ثم افتح رابط الجمع لحفظ إجابة حقيقية.");
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
