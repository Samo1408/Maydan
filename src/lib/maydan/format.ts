const ZONE = "Asia/Riyadh";

export function formatWhen(iso: string, withTime = true): string {
  const date = new Date(iso.length <= 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    ...(withTime && iso.length > 10 ? { hour: "2-digit", minute: "2-digit" } : {}),
    numberingSystem: "latn",
    timeZone: ZONE,
  }).format(date);
}

export function isSameLocalDay(iso: string, now = new Date()): boolean {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(date) === fmt.format(now);
}
