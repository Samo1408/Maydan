import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as cn } from "./router-Cepilhqt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-C478GlXb.js
var import_jsx_runtime = require_jsx_runtime();
var buttonStyles = {
	primary: "bg-primary text-primary-fg hover:opacity-90",
	quiet: "border border-border bg-surface text-fg hover:bg-rule",
	ghost: "bg-transparent text-fg hover:bg-rule",
	danger: "border border-border bg-surface text-accent hover:bg-accent hover:text-accent-fg"
};
function Button({ variant = "quiet", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50", buttonStyles[variant], className),
		...props
	});
}
function TextInput({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-lg border border-border bg-surface px-3 text-base text-fg outline-none placeholder:text-muted focus:border-primary", className),
		...props
	});
}
function TextArea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-fg outline-none placeholder:text-muted focus:border-primary", className),
		...props
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 block text-sm font-medium text-fg",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function Toggle({ checked, onChange, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		onClick: () => onChange(!checked),
		className: "inline-flex min-h-11 items-center gap-3 rounded-lg px-1 text-sm font-semibold text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("relative h-7 w-12 rounded-full", checked ? "bg-primary" : "bg-border"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-0.5 size-6 rounded-full bg-surface shadow-sm", checked ? "start-5" : "start-0.5") })
		}), label]
	});
}
//#endregion
export { Toggle as a, TextInput as i, Field as n, TextArea as r, Button as t };
