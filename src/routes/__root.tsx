import { useEffect, useState, type ReactNode } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Shell } from "@/components/maydan/shell";
import { MaydanProvider } from "@/lib/maydan/context";
import { getSnapshot } from "@/lib/maydan/api";
import { emptySnapshot } from "@/lib/maydan/types";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ميدان — جمع البيانات دون إنترنت" },
      {
        name: "description",
        content: "دفتر نماذج ميداني يعمل دون إنترنت: تصميم النماذج، استيراد وتصدير XLSX وCSV، وجمع الإجابات عبر الشبكة المحلية.",
      },
      { name: "theme-color", content: "#0e6b56" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  loader: async () => {
    try {
      return await getSnapshot();
    } catch (error) {
      console.error(error);
      return emptySnapshot();
    }
  },
  component: RootComponent,
});

function RootComponent() {
  const snapshot = Route.useLoaderData();
  return (
    <RootDocument>
      <MaydanProvider initial={snapshot}>
        <Frame />
      </MaydanProvider>
    </RootDocument>
  );
}

function Frame() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const collect = path === "/c" || path.startsWith("/c/");
  if (collect) return <Outlet />;
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

function SafeToaster() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return <Toaster position="top-center" dir="rtl" richColors />;
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          {children}
          <SafeToaster />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
