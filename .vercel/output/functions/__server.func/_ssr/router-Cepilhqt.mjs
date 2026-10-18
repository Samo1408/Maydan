import { i as __toESM } from "../_runtime.mjs";
import { n as QUESTION_TYPES, r as emptySnapshot } from "./types-CBZYY146.mjs";
import { C as useRouter, Z as require_react, _ as Outlet, b as createRootRoute, f as Scripts, g as createRouter, m as useRouterState, p as HeadContent, v as lazyRouteComponent, w as require_jsx_runtime, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as number, c as string, i as literal, l as union, n as array, o as object, r as boolean, s as record, t as _enum } from "../_libs/zod.mjs";
import { r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cepilhqt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-accent",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "تعذّر عرض الصفحة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var choiceSchema = object({
	name: string().min(1).max(80),
	label: string().max(200)
});
var questionSchema = object({
	id: string().min(1).max(80),
	type: _enum(QUESTION_TYPES),
	name: string().min(1).max(80),
	label: string().max(500),
	hint: string().max(500).optional(),
	required: boolean().optional(),
	choices: array(choiceSchema).max(60).optional(),
	relevant: string().max(400).optional(),
	constraint: string().max(400).optional(),
	constraintMessage: string().max(300).optional()
});
var formSchema = object({
	id: string().min(1).max(80),
	title: string().max(180),
	description: string().max(1e3),
	version: string().max(40),
	deployed: boolean(),
	questions: array(questionSchema).max(150),
	createdAt: string().max(40),
	updatedAt: string().max(40)
});
var answerSchema = union([string().max(7e5), array(string().max(200)).max(40)]);
var submissionInput = object({
	id: string().min(1).max(80),
	formId: string().min(1).max(80),
	answers: record(string().max(80), answerSchema),
	deviceLabel: string().max(80),
	source: _enum(["desk", "lan"]),
	submittedAt: string().max(40).optional()
});
function parsed(schema, data) {
	const result = schema.safeParse(data);
	if (!result.success) throw new Error("البيانات المرسلة غير صالحة");
	return result.data;
}
var getSnapshot = createServerFn({ method: "GET" }).handler(createSsrRpc("7a983f7f64f39ab37a67c44480462dcd75fd96aa43334ca9856d26fdb2885868"));
var saveForm = createServerFn({ method: "POST" }).validator((data) => parsed(formSchema, data)).handler(createSsrRpc("2741a6ba20a57d2bdf5446e15f0e01cfdfd274b1222387910e9baa26bc4a9b4a"));
var deleteForm = createServerFn({ method: "POST" }).validator((data) => parsed(object({ id: string().min(1).max(80) }), data)).handler(createSsrRpc("00a07d50926e82137748aa87508335b8e6ce226a7d18660b30dea28739667aff"));
var addSubmission = createServerFn({ method: "POST" }).validator((data) => parsed(submissionInput, data)).handler(createSsrRpc("6245835115af68d4b3b523c539128c8393e566a4a973bb74269fbca380b0cd8d"));
var deleteSubmission = createServerFn({ method: "POST" }).validator((data) => parsed(object({ id: string().min(1).max(80) }), data)).handler(createSsrRpc("0d574c555ef2a7ca2344aec1dbc8525d5be898e1fdd38187e48b4c877ac13a14"));
var importSubmissions = createServerFn({ method: "POST" }).validator((data) => parsed(object({
	formId: string().min(1).max(80),
	rows: array(object({
		id: string().min(1).max(80),
		answers: record(string().max(80), answerSchema),
		deviceLabel: string().max(80).optional(),
		submittedAt: string().max(40).optional()
	})).max(500)
}), data)).handler(createSsrRpc("94efd03bf1c95ea6ca4db3ac587170a4e9e740fa7736ff04c58582afeeee6f1b"));
var getSubmission = createServerFn({ method: "POST" }).validator((data) => parsed(object({ id: string().min(1).max(80) }), data)).handler(createSsrRpc("9e5eb2eadba2f7ae59121dc3b979d27d94092a931fe0fdb2a8eb73e26e26d01f"));
var DB_NAME = "maydan";
var STORE = "kv";
function openDb() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
async function idbGet(key) {
	const db = await openDb();
	try {
		return await new Promise((resolve, reject) => {
			const request = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
			request.onsuccess = () => resolve(request.result ?? null);
			request.onerror = () => reject(request.error);
		});
	} finally {
		db.close();
	}
}
async function idbSet(key, value) {
	const db = await openDb();
	try {
		await new Promise((resolve, reject) => {
			const tx = db.transaction(STORE, "readwrite");
			tx.objectStore(STORE).put(value, key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	} finally {
		db.close();
	}
}
var MaydanContext = (0, import_react.createContext)(null);
function isOfflineError(error) {
	if (error instanceof TypeError) return true;
	const message = error instanceof Error ? error.message : "";
	return /failed to fetch|network|load failed|econn/i.test(message);
}
function MaydanProvider({ initial, children }) {
	const [snap, setSnap] = (0, import_react.useState)(initial);
	const [offline, setOffline] = (0, import_react.useState)(false);
	const queue = (0, import_react.useRef)([]);
	const inflight = (0, import_react.useRef)(0);
	const snapRef = (0, import_react.useRef)(snap);
	snapRef.current = snap;
	const tail = (0, import_react.useRef)(Promise.resolve());
	const commit = (0, import_react.useCallback)((next) => {
		snapRef.current = next;
		setSnap(next);
		idbSet("snap", next).catch(() => void 0);
	}, []);
	const applyServer = (0, import_react.useCallback)(async (op) => {
		if (op.kind === "saveForm") return saveForm({ data: op.form });
		if (op.kind === "deleteForm") return deleteForm({ data: { id: op.id } });
		if (op.kind === "deleteSubmission") return deleteSubmission({ data: { id: op.id } });
		if (op.kind === "importSubmissions") return importSubmissions({ data: op });
		return addSubmission({ data: op });
	}, []);
	const optimistic = (0, import_react.useCallback)((op, base) => {
		if (op.kind === "saveForm") {
			const forms = base.forms.some((form) => form.id === op.form.id) ? base.forms.map((form) => form.id === op.form.id ? op.form : form) : [op.form, ...base.forms];
			return {
				...base,
				forms
			};
		}
		if (op.kind === "deleteForm") return {
			...base,
			forms: base.forms.filter((form) => form.id !== op.id),
			submissions: base.submissions.filter((submission) => submission.formId !== op.id)
		};
		if (op.kind === "deleteSubmission") return {
			...base,
			submissions: base.submissions.filter((submission) => submission.id !== op.id)
		};
		if (op.kind === "importSubmissions") {
			const added = op.rows.map((row) => ({
				id: row.id,
				formId: op.formId,
				answers: row.answers,
				submittedAt: row.submittedAt || (/* @__PURE__ */ new Date()).toISOString(),
				deviceLabel: row.deviceLabel || "استيراد",
				source: "desk"
			}));
			return {
				...base,
				submissions: [...added, ...base.submissions]
			};
		}
		return {
			...base,
			submissions: [{
				id: op.id,
				formId: op.formId,
				answers: op.answers,
				submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
				deviceLabel: op.deviceLabel,
				source: op.source
			}, ...base.submissions]
		};
	}, []);
	const refresh = (0, import_react.useCallback)(async () => {
		if (inflight.current > 0) return;
		try {
			if (queue.current.length) {
				const pending = [...queue.current];
				let latest = null;
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
	(0, import_react.useEffect)(() => {
		let cancel = false;
		(async () => {
			const stored = await idbGet("queue").catch(() => null);
			if (cancel) return;
			if (stored?.length) queue.current = stored;
			await refresh();
		})();
		const timer = window.setInterval(() => void refresh(), 5e3);
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
	const run = (0, import_react.useCallback)((op) => {
		const job = tail.current.then(async () => {
			inflight.current += 1;
			commit(optimistic(op, snapRef.current));
			try {
				commit(await applyServer(op));
				setOffline(false);
			} catch (error) {
				if (isOfflineError(error)) {
					queue.current = [...queue.current, op];
					await idbSet("queue", queue.current).catch(() => void 0);
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
		tail.current = job.then(() => void 0, () => void 0);
		return job;
	}, [
		applyServer,
		commit,
		optimistic
	]);
	const api = (0, import_react.useMemo)(() => ({
		snap,
		offline,
		refresh,
		saveForm: (form) => run({
			kind: "saveForm",
			form
		}),
		deleteForm: (id) => run({
			kind: "deleteForm",
			id
		}),
		deleteSubmission: (id) => run({
			kind: "deleteSubmission",
			id
		}),
		addSubmission: (input) => run({
			kind: "addSubmission",
			id: crypto.randomUUID(),
			...input
		}),
		importSubmissions: (formId, rows) => run({
			kind: "importSubmissions",
			formId,
			rows: rows.map((row) => ({
				...row,
				id: crypto.randomUUID()
			}))
		})
	}), [
		offline,
		refresh,
		run,
		snap
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaydanContext.Provider, {
		value: api,
		children
	});
}
function useMaydan() {
	const value = (0, import_react.useContext)(MaydanContext);
	if (!value) throw new Error("useMaydan outside provider");
	return value;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var links = [{
	to: "/",
	label: "المكتبة"
}, {
	to: "/c",
	label: "الجمع"
}];
function Shell({ children }) {
	const path = useRouterState({ select: (state) => state.location.pathname });
	const { offline } = useMaydan();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-11 place-items-center rounded-lg bg-primary font-display text-xl text-primary-fg",
							children: "M"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-xs tracking-widest text-primary",
							children: "MAYDAN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-lg font-bold leading-none text-fg",
							children: "ميدان"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex items-center gap-1",
						children: links.map((link) => {
							const active = link.to === "/" ? path === "/" : path === link.to || path.startsWith(`${link.to}/`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: link.to,
								className: cn("inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold", active ? "bg-primary text-primary-fg" : "text-fg hover:bg-rule"),
								children: link.label
							}, link.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("ms-auto text-sm font-medium", offline ? "text-accent" : "text-primary"),
						children: offline ? "وضع الجهاز فقط" : "الخادم المحلي يعمل"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-6xl px-4 py-6",
			children
		})]
	});
}
var styles_default = "/assets/styles-bFcraOYi.css";
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ميدان — جمع البيانات دون إنترنت" },
			{
				name: "description",
				content: "دفتر نماذج ميداني يعمل دون إنترنت: تصميم النماذج، استيراد وتصدير XLSX وCSV، وجمع الإجابات عبر الشبكة المحلية."
			},
			{
				name: "theme-color",
				content: "#0e6b56"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	loader: async () => {
		try {
			return await getSnapshot();
		} catch (error) {
			console.error(error);
			return emptySnapshot();
		}
	},
	component: RootComponent
});
function RootComponent() {
	const snapshot = Route$5.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootDocument, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaydanProvider, {
		initial: snapshot,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, {})
	}) });
}
function Frame() {
	const path = useRouterState({ select: (state) => state.location.pathname });
	if (path === "/c" || path.startsWith("/c/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
function SafeToaster() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		position: "top-center",
		dir: "rtl",
		richColors: true
	});
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "rtl",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeToaster, {})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$4 = () => import("./routes-TirAaRtC.mjs");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./c-BSa_ug8X.mjs");
var Route$3 = createFileRoute("/c/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("../_formId-CIBhYiE1.mjs");
var Route$2 = createFileRoute("/c/$formId")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("../_formId-B1hdK6M2.mjs");
var Route$1 = createFileRoute("/forms/$formId/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./data-DQtmYtzr.mjs");
var Route = createFileRoute("/forms/$formId/data")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$5
});
var CIndexRoute = Route$3.update({
	id: "/c/",
	path: "/c/",
	getParentRoute: () => Route$5
});
var CFormIdRoute = Route$2.update({
	id: "/c/$formId",
	path: "/c/$formId",
	getParentRoute: () => Route$5
});
var FormsFormIdIndexRoute = Route$1.update({
	id: "/forms/$formId/",
	path: "/forms/$formId/",
	getParentRoute: () => Route$5
});
var rootRouteChildren = {
	IndexRoute,
	CFormIdRoute,
	CIndexRoute,
	FormsFormIdDataRoute: Route.update({
		id: "/forms/$formId/data",
		path: "/forms/$formId/data",
		getParentRoute: () => Route$5
	}),
	FormsFormIdIndexRoute
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent,
		scrollRestoration: true
	});
}
//#endregion
export { cn as a, Route$2 as i, Route as n, useMaydan as o, Route$1 as r, getSubmission as s, router_exports as t };
