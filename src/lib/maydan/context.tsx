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
} from "@/lib/maydan/api";
import { idbGet, idbSet } from "./idb";
import type { Answers, FormDef, Snapshot, Submission } from "./types";

type ImportRow = { id: string; answers: Answers; deviceLabel?: string; submittedAt?: string };

type Op =
  | { kind: "saveForm"; form: FormDef }
  | { kind: "deleteForm"; id: string }
  | { kind: "deleteSubmission"; id: string }
  | { kind: "addSubmission"; id: string; formId: string; answers: Answers; deviceLabel: string; source: "desk" | "lan" }
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
    return addSubmission({ data: op });
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
        },
        ...base.submissions,
      ],
    };
  }, []);

  const refresh = useCallback(async () => {
    if (inflight.current > 0) return;
    try {
      if (queue.current.length) {
        const pending = [...queue.current];
        let latest: Snapshot | null = null;
        for (const op of pending) latest = await applyServer(op);
        queue.current = [];
        await idbSet("queue", []);
        if (latest) commit(latest);
      }
      const next = await getSnapshot();
      if (inflight.current === 0 && queue.current.length === 0) commit(next);
      setOffline(false);
    } catch {
      setOffline(true);
    }
  }, [applyServer, commit]);

  useEffect(() => {
    let cancel = false;
    void (async () => {
      const stored = await idbGet<Op[]>("queue").catch(() => null);
      if (cancel) return;
      if (stored?.length) queue.current = stored;
      await refresh();
    })();
    const timer = window.setInterval(() => void refresh(), 5000);
    const markOffline = () => setOffline(true);
    const markOnline = () => void refresh();
    window.addEventListener("offline", markOffline);
    window.addEventListener("online", markOnline);
    return () => {
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
      addSubmission: (input) => run({ kind: "addSubmission", id: crypto.randomUUID(), ...input }),
      importSubmissions: (formId, rows) =>
        run({
          kind: "importSubmissions",
          formId,
          rows: rows.map((row) => ({ ...row, id: crypto.randomUUID() })),
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
