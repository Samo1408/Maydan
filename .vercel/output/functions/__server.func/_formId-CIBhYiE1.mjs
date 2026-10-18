import { i as __toESM } from "./_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { i as Route$2, o as useMaydan } from "./_ssr/router-Cepilhqt.mjs";
import { t as FormRunner } from "./_ssr/runner-BNuxpO1p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_formId-CIBhYiE1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CollectForm() {
	const { formId } = Route$2.useParams();
	const { snap, addSubmission } = useMaydan();
	const form = snap.forms.find((item) => item.id === formId);
	const [done, setDone] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-screen max-w-lg px-4 py-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/c",
				className: "text-sm font-semibold text-primary",
				children: "كل النماذج"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-xs tracking-widest text-primary",
				children: "MAYDAN"
			})]
		}), !form ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "rounded-lg border border-border bg-surface p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold",
				children: "النموذج غير موجود على هذا الخادم"
			})
		}) : !form.deployed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-border bg-surface p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold",
				children: form.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "هذا النموذج ما زال مسودة. انشره من المكتب ليقبله الجمع الشبكي."
			})]
		}) : done > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-border bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-widest text-primary",
					children: "SENT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-bold text-balance",
					children: "وصلت الإجابة إلى جهاز المكتب"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-pretty text-muted",
					children: "حُفظت محلياً على الخادم الذي فتحته. يمكنك إرسال استمارة أخرى من دون إنترنت."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg",
					onClick: () => setDone(0),
					children: "استمارة جديدة"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-balance",
				children: form.title
			}), form.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-pretty text-muted",
				children: form.description
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormRunner, {
			form,
			submitLabel: "إرسال إلى الجهاز المستضيف",
			onSubmit: async (answers, deviceLabel) => {
				await addSubmission({
					formId: form.id,
					answers,
					deviceLabel,
					source: "lan"
				});
				toast.success("تم الإرسال");
				setDone((value) => value + 1);
			}
		}, done)] })]
	});
}
//#endregion
export { CollectForm as component };
