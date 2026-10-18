import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as useMaydan } from "./router-Cepilhqt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/c-BSa_ug8X.js
var import_jsx_runtime = require_jsx_runtime();
function CollectIndex() {
	const { snap } = useMaydan();
	const forms = snap.forms.filter((form) => form.deployed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-screen max-w-lg px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xs tracking-widest text-primary",
				children: "MAYDAN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-3xl font-bold",
				children: "النماذج الجاهزة للتعبئة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-pretty text-muted",
				children: "أنت على شبكة الجهاز المستضيف. اختر نموذجاً، أرسله، وتُحفظ الإجابة هناك مباشرة."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: forms.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-lg border border-border bg-surface p-4 text-muted",
					children: "لا يوجد نموذج منشور بعد."
				}) : forms.map((form) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/c/$formId",
					params: { formId: form.id },
					className: "block rounded-lg border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-lg font-bold text-fg",
						children: form.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm text-muted",
						children: form.description || `${form.questions.length} سؤالاً`
					})]
				}) }, form.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-primary",
				children: "فتح مكتب النماذج"
			})
		]
	});
}
//#endregion
export { CollectIndex as component };
