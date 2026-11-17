import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ClipboardList, Library, LogOut, Moon, RefreshCw, Sun } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/auth/client";
import { useMaydan } from "@/lib/maydan/context";
import { cn } from "@/lib/cn";

const THEME_KEY = "alsadek-theme";

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);
  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    if (next === "dark") document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    localStorage.setItem(THEME_KEY, next);
    setDark(next === "dark");
  }
  return { dark, toggle };
}

const links = [
  { to: "/", label: "المكتبة", icon: Library },
  { to: "/c", label: "الجمع", icon: ClipboardList },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const { offline, refresh } = useMaydan();
  const { dark, toggle } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  async function updateNow() {
    setRefreshing(true);
    try {
      await refresh();
      toast.success("تم تحديث البيانات");
    } catch {
      toast.error("تعذّر التحديث. أعد فتح الصفحة إذا استمر ذلك.");
    } finally {
      setRefreshing(false);
    }
  }

  async function logout() {
    try {
      await signOut("/");
    } catch {
      window.location.href = "/";
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-[4.75rem_minmax(0,1fr)]">
      <aside className="sticky top-0 z-30 flex h-screen flex-col gap-2 border-e border-border bg-surface px-1.5 py-3">
        <Link to="/" className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-fg" title="الشيخ إخوان">
          ص
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((link) => {
            const active = link.to === "/" ? path === "/" : path === link.to || path.startsWith(`${link.to}/`);
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                title={link.label}
                className={cn(
                  "inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold",
                  active ? "bg-primary text-primary-fg" : "text-fg hover:bg-rule",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            title="تحديث"
            onClick={() => void updateNow()}
            disabled={refreshing}
            className="inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-fg hover:bg-rule disabled:opacity-50"
          >
            <RefreshCw className={cn("size-5", refreshing && "animate-spin")} aria-hidden="true" />
            تحديث
          </button>
          <button
            type="button"
            title="تسجيل خروج"
            onClick={() => void logout()}
            className="inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-fg hover:bg-rule"
          >
            <LogOut className="size-5" aria-hidden="true" />
            خروج
          </button>
        </nav>
        <button
          type="button"
          title={dark ? "الوضع الفاتح" : "الوضع الداكن"}
          onClick={toggle}
          className="inline-flex min-h-11 min-w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-fg hover:bg-rule"
        >
          {dark ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
          الثيم
        </button>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-border bg-surface/95">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <div>
              <span className="block font-display text-xs tracking-widest text-primary">ALSADEK-FORMS</span>
              <span className="block text-lg font-bold leading-none text-fg">الشيخ إخوان</span>
            </div>
            <p className={cn("text-sm font-medium", offline ? "text-accent" : "text-primary")}>
              {offline ? "وضع الجهاز فقط" : "الخادم المحلي يعمل"}
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
