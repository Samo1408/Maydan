import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  addSubmission,
  deleteForm,
  deleteSubmission,
  getSnapshot,
  importSubmissions,
  saveForm,
} from "./api";
import { idbGet, idbSet } from "./idb";
import { newId } from "./id";
import type { Answers, FormDef, Snapshot, Submission } from "./types";

type ImportRow = { id: string; answers: Answers; deviceLabel?: string; submittedAt?: string };

type Op =
  | { kind: "saveForm"; form: FormDef }
  | { kind: "deleteForm"; id: string }
  | { kind: "deleteSubmission"; id: string }
  | { kind: "addSubmission"; id: string; formId: string; answers: Answers; deviceLabel: string; source: "desk" | "lan"; categoryId?: string }
  | { kind: "importSubmissions"; formId: string; rows: ImportRow[] };

type MaydanApi = {
  snap: Snapshot;
  offline: boolean;
  refresh: () => Promise<void>;
  saveForm: (form: FormDef) => Promise<void>;
  deleteForm: (id: string) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  addSubmission: (input: {
    formId: string;
    answers: Answers;
    deviceLabel: string;
    source: "desk" | "lan";
    categoryId?: string;
  }) => Promise<void>;
  importSubmissions: (
    formId: string,
    rows: { answers: Answers; deviceLabel?: string; submittedAt?: string }[],
  ) => Promise<void>;
};

const MaydanContext = createContext<MaydanApi | null>(null);

function isOfflineError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  const message = error instanceof Error ? error.message : "";
  return /failed to fetch|network|load failed|econn/i.test(message);
}

export function MaydanProvider({ initial, children }: { initial: Snapshot; children: ReactNode }) {
  const [snap, setSnap] = useState(initial);
  const [offline, setOffline] = useState(false);
  const queue = useRef<Op[]>([]);
  const inflight = useRef(0);
  const snapRef = useRef(snap);
  snapRef.current = snap;
  const tail = useRef(Promise.resolve());

  const commit = useCallback((next: Snapshot) => {
    snapRef.current = next;
    setSnap(next);
    void idbSet("snap", next).catch(() => undefined);
  }, []);

  const applyServer = useCallback(async (op: Op): Promise<Snapshot> => {
    if (op.kind === "saveForm") return saveForm({ data: op.form });
    if (op.kind === "deleteForm") return deleteForm({ data: { id: op.id } });
    if (op.kind === "deleteSubmission") return deleteSubmission({ data: { id: op.id } });
    if (op.kind === "importSubmissions") return importSubmissions({ data: op });
    const response = await fetch("/api/collect", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        id: op.id,
        formId: op.formId,
        answers: op.answers,
        deviceLabel: op.deviceLabel,
        source: op.source,
        categoryId: op.categoryId,
      }),
    });
    const text = await response.text();
    let payload: { ok?: boolean; message?: string } | null = null;
    try {
      payload = JSON.parse(text) as { ok?: boolean; message?: string };
    } catch {
      payload = null;
    }
    if (payload?.ok === true) return snapRef.current;
    if (payload && payload.ok === false) throw new Error(payload.message || "تعذّر إرسال الإجابة");
    if (response.status === 404) {
      return addSubmission({
        data: {
          id: op.id,
          formId: op.formId,
          answers: op.answers,
          deviceLabel: op.deviceLabel,
          source: op.source,
          categoryId: op.categoryId,
        },
      });
    }
    throw new Error("تعذّر الاتصال بالجهاز المستضيف. تأكد أن نافذة الصادق إخوان مفتوحة وأن الجهازين على نفس الواي فاي.");
  }, []);

  const optimistic = useCallback((op: Op, base: Snapshot): Snapshot => {
    if (op.kind === "saveForm") {
      const forms = base.forms.some((form) => form.id === op.form.id)
        ? base.forms.map((form) => (form.id === op.form.id ? op.form : form))
        : [op.form, ...base.forms];
      return { ...base, forms };
    }
    if (op.kind === "deleteForm") {
      return {
        ...base,
        forms: base.forms.filter((form) => form.id !== op.id),
        submissions: base.submissions.filter((submission) => submission.formId !== op.id),
      };
    }
    if (op.kind === "deleteSubmission") {
      return { ...base, submissions: base.submissions.filter((submission) => submission.id !== op.id) };
    }
    if (op.kind === "importSubmissions") {
      const added: Submission[] = op.rows.map((row) => ({
        id: row.id,
        formId: op.formId,
        answers: row.answers,
        submittedAt: row.submittedAt || new Date().toISOString(),
        deviceLabel: row.deviceLabel || "استيراد",
        source: "desk",
      }));
      return { ...base, submissions: [...added, ...base.submissions] };
    }
    return {
      ...base,
      submissions: [
        {
          id: op.id,
          formId: op.formId,
          answers: op.answers,
          submittedAt: new Date().toISOString(),
          deviceLabel: op.deviceLabel,
          source: op.source,
          categoryId: op.categoryId,
        },
        ...base.submissions,
      ],
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      if (queue.current.length && inflight.current === 0) {
        const pending = [...queue.current];
        let latest: Snapshot | null = null;
        for (const op of pending) latest = await applyServer(op);
        queue.current = [];
        await idbSet("queue", []);
        if (latest) commit(latest);
      }
      const next = await getSnapshot();
      if (queue.current.length === 0) commit(next);
      setOffline(false);
    } catch {
      setOffline(true);
      throw new Error("تعذّر تحديث البيانات");
    }
  }, [applyServer, commit]);

  useEffect(() => {
    let cancel = false;
    void (async () => {
      const stored = await idbGet<Op[]>("queue").catch(() => null);
      if (cancel) return;
      if (stored?.length) queue.current = stored;
      await refresh().catch(() => undefined);
    })();
    const timer = window.setInterval(() => {
      void refresh().catch(() => undefined);
    }, 5000);
    const markOffline = () => setOffline(true);
    const markOnline = () => void refresh().catch(() => undefined);
    window.addEventListener("offline", markOffline);
    window.addEventListener("online", markOnline);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      cancel = true;
      window.clearInterval(timer);
      window.removeEventListener("offline", markOffline);
      window.removeEventListener("online", markOnline);
    };
  }, [refresh]);

  const run = useCallback(
    (op: Op) => {
      const job = tail.current.then(async () => {
        inflight.current += 1;
        commit(optimistic(op, snapRef.current));
        try {
          commit(await applyServer(op));
          setOffline(false);
        } catch (error) {
          if (isOfflineError(error)) {
            if (op.kind === "addSubmission" && op.source === "lan") {
              toast.error("لم تصل الإجابة إلى الجهاز المستضيف. أبقِ نافذة الصادق إخوان مفتوحة والجهازين على نفس الواي فاي، ثم أعد الإرسال.");
              try {
                commit(await getSnapshot());
              } catch {
                setOffline(true);
              }
              throw error;
            }
            queue.current = [...queue.current, op];
            await idbSet("queue", queue.current).catch(() => undefined);
            setOffline(true);
            toast.error("انقطع الخادم المحلي. بقي العمل على هذا الجهاز وسيُرسل عند عودة الشبكة.");
          } else {
            const message = error instanceof Error ? error.message : "تعذّر الحفظ";
            toast.error(message);
            try {
              commit(await getSnapshot());
            } catch {
              setOffline(true);
            }
          }
          throw error;
        } finally {
          inflight.current -= 1;
        }
      });
      tail.current = job.then(
        () => undefined,
        () => undefined,
      );
      return job;
    },
    [applyServer, commit, optimistic],
  );

  const api = useMemo<MaydanApi>(
    () => ({
      snap,
      offline,
      refresh,
      saveForm: (form) => run({ kind: "saveForm", form }),
      deleteForm: (id) => run({ kind: "deleteForm", id }),
      deleteSubmission: (id) => run({ kind: "deleteSubmission", id }),
      addSubmission: (input) => run({ kind: "addSubmission", id: newId(), ...input }),
      importSubmissions: (formId, rows) =>
        run({
          kind: "importSubmissions",
          formId,
          rows: rows.map((row) => ({ ...row, id: newId() })),
        }),
    }),
    [offline, refresh, run, snap],
  );

  return <MaydanContext.Provider value={api}>{children}</MaydanContext.Provider>;
}

export function useMaydan(): MaydanApi {
  const value = useContext(MaydanContext);
  if (!value) throw new Error("useMaydan outside provider");
  return value;
}
