import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Wifi } from "lucide-react";
import { copyText } from "@/lib/maydan/download";
import type { FormDef, NetworkInfo } from "@/lib/maydan/types";
import { Button } from "./ui";

function QrCode({ value }: { value: string }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let cancel = false;
    void import("qrcode").then(async (mod) => {
      const url = await mod.toDataURL(value, {
        margin: 1,
        width: 320,
        color: { dark: "#1c1915", light: "#fffdf8" },
      });
      if (!cancel) setSrc(url);
    });
    return () => {
      cancel = true;
    };
  }, [value]);
  if (!src) return <div className="size-40 rounded-lg bg-rule" aria-hidden="true" />;
  return <img src={src} alt="" className="size-40 rounded-lg border border-border bg-surface" />;
}

export function NetworkCard({ forms, network }: { forms: FormDef[]; network: NetworkInfo }) {
  const deployed = forms.filter((form) => form.deployed);
  const [formId, setFormId] = useState(deployed[0]?.id ?? "");
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!deployed.some((form) => form.id === formId)) setFormId(deployed[0]?.id ?? "");
  }, [deployed, formId]);

  const path = formId ? `/c/${formId}` : "/c";
  const links = useMemo(() => {
    const values = [
      ...network.addresses.map((item) => ({
        label: item.name,
        href: `http://${item.address}:${network.port}${path}`,
      })),
    ];
    if (origin) values.unshift({ label: "هذه الشاشة", href: `${origin}${path}` });
    return values;
  }, [network.addresses, network.port, origin, path]);
  const primary = links[0]?.href ?? path;

  async function copy(href: string) {
    const ok = await copyText(href);
    if (!ok) return;
    setCopied(href);
    window.setTimeout(() => setCopied(""), 1600);
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-start gap-3 border-b border-border bg-ink px-4 py-4 text-primary-fg">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary">
          <Wifi className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-balance">جمع عبر الراوتر فقط</h2>
          <p className="mt-1 text-sm text-pretty text-primary-fg/80">
            ميدان هو الخادم. الهاتف الثاني على نفس الواي فاي يفتح الرابط، يملأ النموذج، وتعود الإجابة إلى هذا الجهاز من غير إنترنت.
          </p>
        </div>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-2">
          <QrCode value={primary} />
          <p className="text-center text-xs text-muted">امسح الرمز من الهاتف</p>
        </div>
        <div className="space-y-3">
          {deployed.length ? (
            <label className="block text-sm font-medium">
              النموذج المنشور
              <select
                value={formId}
                onChange={(event) => setFormId(event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-border bg-bg px-3 text-fg"
              >
                {deployed.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.title}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="rounded-lg bg-bg px-3 py-3 text-sm text-muted">
              انشر نموذجاً من بطاقته ليظهر رابطه هنا. صفحة الجمع تبقى جاهزة.
            </p>
          )}
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href} className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted">{link.label}</p>
                  <p className="truncate text-sm text-fg" dir="ltr">
                    {link.href}
                  </p>
                </div>
                <Button variant="ghost" className="shrink-0 px-3" onClick={() => void copy(link.href)}>
                  {copied === link.href ? <Check className="size-4" /> : <Copy className="size-4" />}
                  نسخ
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {formId ? (
              <Link to="/c/$formId" params={{ formId }} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg">
                فتح نموذج الجمع
              </Link>
            ) : (
              <Link to="/c" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg">
                صفحة الجمع
              </Link>
            )}
          </div>
          <p className="text-xs text-pretty text-muted">
            الرابط على الشبكة المحلية يعمل بـ http لأن الشهادة لا تحتاج إنترنت. الكاميرا والموقع يعملان بثقة على الجهاز الذي يشغّل ميدان؛ بعض المتصفحات تمنعهما على http من الهاتف، وتبقى أسئلة النص والاختيار والتاريخ متاحة.
          </p>
        </div>
      </div>
    </section>
  );
}
