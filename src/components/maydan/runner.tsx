import { useEffect, useMemo, useState } from "react";
import { Camera, LocateFixed, Star } from "lucide-react";
import { answerCount, isRelevant, validateAnswers } from "@/lib/maydan/logic";
import type { Answers, FormDef } from "@/lib/maydan/types";
import { cn } from "@/lib/cn";
import { Button, TextArea, TextInput } from "./ui";

async function compressImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("image"));
      element.src = url;
    });
    const max = 960;
    const scale = Math.min(1, max / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return "";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.62);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function FormRunner({
  form,
  submitLabel,
  onSubmit,
}: {
  form: FormDef;
  submitLabel: string;
  onSubmit: (answers: Answers, deviceLabel: string) => Promise<void> | void;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [device, setDevice] = useState("جامع البيانات");
  const [pending, setPending] = useState(false);
  const [geoNote, setGeoNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("maydan-device");
    if (saved) setDevice(saved);
  }, []);

  const visible = useMemo(
    () => form.questions.filter((question) => isRelevant(question.relevant, answers)),
    [answers, form.questions],
  );
  const progress = answerCount(form, answers);

  function setAnswer(name: string, value: Answers[string]) {
    setAnswers((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function submit() {
    const nextErrors = validateAnswers(form, answers);
    setErrors(nextErrors);
    const first = form.questions.find((question) => nextErrors[question.name]);
    if (first) {
      document.getElementById(`q-${first.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const clean: Answers = {};
    for (const question of visible) {
      if (question.type === "note") continue;
      const value = answers[question.name];
      if (value != null && !(typeof value === "string" && value.trim() === "") && !(Array.isArray(value) && !value.length)) {
        clean[question.name] = value;
      }
    }
    setPending(true);
    try {
      localStorage.setItem("maydan-device", device.trim() || "جامع البيانات");
      await onSubmit(clean, device.trim() || "جامع البيانات");
      setAnswers({});
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm text-muted">
          <span>الحقول المطلوبة</span>
          <span className="tabular-nums">
            {progress.done}/{progress.total || visible.filter((question) => question.type !== "note").length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-rule">
          <div
            className="h-full bg-primary"
            style={{
              width: `${progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%`,
            }}
          />
        </div>
      </div>

      {visible.map((question, index) => {
        const value = answers[question.name];
        const error = errors[question.name];
        return (
          <section id={`q-${question.id}`} key={question.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-balance text-fg">
                  {question.label}
                  {question.required ? <span className="text-accent"> *</span> : null}
                </h3>
                {question.hint ? <p className="mt-1 text-sm text-pretty text-muted">{question.hint}</p> : null}
              </div>
              <span className="tabular-nums text-xs text-muted">{index + 1}</span>
            </div>
            {question.type === "note" ? null : null}
            {question.type === "text" ? (
              <TextArea
                value={typeof value === "string" ? value : ""}
                onChange={(event) => setAnswer(question.name, event.target.value)}
              />
            ) : null}
            {question.type === "integer" || question.type === "decimal" ? (
              <TextInput
                inputMode={question.type === "integer" ? "numeric" : "decimal"}
                dir="ltr"
                className="text-start"
                value={typeof value === "string" ? value : ""}
                onChange={(event) => setAnswer(question.name, event.target.value)}
              />
            ) : null}
            {question.type === "date" || question.type === "time" ? (
              <TextInput
                type={question.type}
                dir="ltr"
                value={typeof value === "string" ? value : ""}
                onChange={(event) => setAnswer(question.name, event.target.value)}
              />
            ) : null}
            {question.type === "select_one" ? (
              <div className="grid gap-2">
                {(question.choices ?? []).map((choice) => {
                  const active = value === choice.name;
                  return (
                    <label
                      key={choice.name}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2",
                        active ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg text-fg",
                      )}
                    >
                      <input
                        type="radio"
                        className="size-4 accent-current"
                        checked={active}
                        onChange={() => setAnswer(question.name, choice.name)}
                      />
                      {choice.label}
                    </label>
                  );
                })}
              </div>
            ) : null}
            {question.type === "select_multiple" ? (
              <div className="grid gap-2">
                {(question.choices ?? []).map((choice) => {
                  const selected = Array.isArray(value) ? value : [];
                  const active = selected.includes(choice.name);
                  return (
                    <label
                      key={choice.name}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2",
                        active ? "border-primary bg-surface text-fg" : "border-border bg-bg text-fg",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="size-4"
                        checked={active}
                        onChange={() =>
                          setAnswer(
                            question.name,
                            active ? selected.filter((item) => item !== choice.name) : [...selected, choice.name],
                          )
                        }
                      />
                      {choice.label}
                    </label>
                  );
                })}
              </div>
            ) : null}
            {question.type === "acknowledge" ? (
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={value === "OK"}
                  onChange={(event) => setAnswer(question.name, event.target.checked ? "OK" : "")}
                />
                أقرّ بذلك
              </label>
            ) : null}
            {question.type === "rating" ? (
              <div className="flex flex-wrap gap-2">
                {["1", "2", "3", "4", "5"].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setAnswer(question.name, score)}
                    className={cn(
                      "inline-flex size-11 items-center justify-center rounded-lg border font-semibold tabular-nums",
                      value === score
                        ? "border-primary bg-primary text-primary-fg"
                        : "border-border bg-bg text-fg",
                    )}
                  >
                    <Star className="me-1 size-3" aria-hidden="true" />
                    {score}
                  </button>
                ))}
              </div>
            ) : null}
            {question.type === "geopoint" ? (
              <div className="space-y-2">
                <TextInput
                  dir="ltr"
                  placeholder="33.513800 36.276500"
                  value={typeof value === "string" ? value : ""}
                  onChange={(event) => setAnswer(question.name, event.target.value)}
                />
                <Button
                  variant="quiet"
                  onClick={() => {
                    if (!navigator.geolocation) {
                      setGeoNote("هذا المتصفح لا يوفّر الموقع.");
                      return;
                    }
                    setGeoNote("جارٍ تحديد الموقع…");
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const next = `${position.coords.latitude.toFixed(6)} ${position.coords.longitude.toFixed(6)} ${Math.round(position.coords.accuracy)}`;
                        setAnswer(question.name, next);
                        setGeoNote("تم حفظ الإحداثيات على هذا الجهاز.");
                      },
                      () => setGeoNote("تعذّر قراءة الموقع. اكتبه يدوياً."),
                      { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 },
                    );
                  }}
                >
                  <LocateFixed className="size-4" aria-hidden="true" />
                  تحديد موقعي
                </Button>
                {geoNote ? <p className="text-sm text-muted">{geoNote}</p> : null}
              </div>
            ) : null}
            {question.type === "image" ? (
              <div className="space-y-2">
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border bg-bg px-4 text-sm font-semibold">
                  <Camera className="size-4" aria-hidden="true" />
                  التقاط أو اختيار صورة
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (!file) return;
                      void compressImage(file).then((src) => {
                        if (src) setAnswer(question.name, src);
                      });
                    }}
                  />
                </label>
                {typeof value === "string" && value.startsWith("data:image") ? (
                  <img src={value} alt="معاينة المرفق" className="max-h-48 rounded-lg border border-border" />
                ) : null}
              </div>
            ) : null}
            {error ? <p className="mt-2 text-sm font-medium text-accent">{error}</p> : null}
          </section>
        );
      })}

      <section className="rounded-lg border border-border bg-surface p-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">اسم جامع البيانات</span>
          <TextInput
            value={device}
            onChange={(event) => setDevice(event.target.value)}
            maxLength={80}
          />
        </label>
        <Button variant="primary" className="mt-4 w-full" disabled={pending} onClick={() => void submit()}>
          {pending ? "يُرسل…" : submitLabel}
        </Button>
      </section>
    </div>
  );
}
