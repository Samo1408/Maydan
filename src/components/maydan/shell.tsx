import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useMaydan } from "@/lib/maydan/context";
import { cn } from "@/lib/cn";

const links = [
  { to: "/", label: "المكتبة" },
  { to: "/c", label: "الجمع" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const { offline } = useMaydan();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-primary font-display text-xl text-primary-fg">
              M
            </span>
            <span>
              <span className="block font-display text-xs tracking-widest text-primary">MAYDAN</span>
              <span className="block text-lg font-bold leading-none text-fg">ميدان</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const active = link.to === "/" ? path === "/" : path === link.to || path.startsWith(`${link.to}/`);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold",
                    active ? "bg-primary text-primary-fg" : "text-fg hover:bg-rule",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <p className={cn("ms-auto text-sm font-medium", offline ? "text-accent" : "text-primary")}>
            {offline ? "وضع الجهاز فقط" : "الخادم المحلي يعمل"}
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
