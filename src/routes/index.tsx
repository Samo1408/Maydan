import { createFileRoute, redirect } from "@tanstack/react-router";
import { Library } from "@/components/maydan/library";
import { getRequestUserAgent, getSnapshot } from "@/lib/maydan/api";
import { isPhoneUserAgent } from "@/lib/maydan/phone";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : await getRequestUserAgent();
    if (!isPhoneUserAgent(ua)) return;
    const snap = await getSnapshot();
    const deployed = snap.forms.filter((form) => form.deployed);
    if (deployed.length === 1) {
      throw redirect({ to: "/c/$formId", params: { formId: deployed[0].id } });
    }
    throw redirect({ to: "/c" });
  },
  component: Library,
});