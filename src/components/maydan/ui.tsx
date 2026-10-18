import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonStyles = {
  primary: "bg-primary text-primary-fg hover:opacity-90",
  quiet: "border border-border bg-surface text-fg hover:bg-rule",
  ghost: "bg-transparent text-fg hover:bg-rule",
  danger: "border border-border bg-surface text-accent hover:bg-accent hover:text-accent-fg",
} as const;

export function Button({
  variant = "quiet",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonStyles }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
        buttonStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-border bg-surface px-3 text-base text-fg outline-none placeholder:text-muted focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-fg outline-none placeholder:text-muted focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-fg">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex min-h-11 items-center gap-3 rounded-lg px-1 text-sm font-semibold text-fg"
    >
      <span className={cn("relative h-7 w-12 rounded-full", checked ? "bg-primary" : "bg-border")}>
        <span
          className={cn(
            "absolute top-0.5 size-6 rounded-full bg-surface shadow-sm",
            checked ? "start-5" : "start-0.5",
          )}
        />
      </span>
      {label}
    </button>
  );
}
