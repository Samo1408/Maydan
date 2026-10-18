import { i as __toESM } from "../_runtime.mjs";
import { r as normalizeForm } from "./logic-BZJETgf9.mjs";
import { S as useNavigate, Z as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Copy, h as FileSpreadsheet, i as Trash2, l as Plus, n as Upload, t as Wifi, x as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useMaydan } from "./router-Cepilhqt.mjs";
import { t as Button } from "./ui-C478GlXb.mjs";
import { a as formFromCsvText, o as formFromXlsx, t as copyText } from "./xlsform-CeDgaR0A.mjs";
import { n as isSameLocalDay } from "./format-DUe4hblF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-TirAaRtC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QrCode({ value }) {
	const [src, setSrc] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let cancel = false;
		import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())).then(async (mod) => {
			const url = await mod.toDataURL(value, {
				margin: 1,
				width: 320,
				color: {
					dark: "#1c1915",
					light: "#fffdf8"
				}
			});
			if (!cancel) setSrc(url);
		});
		return () => {
			cancel = true;
		};
	}, [value]);
	if (!src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "size-40 rounded-lg bg-rule",
		"aria-hidden": "true"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		className: "size-40 rounded-lg border border-border bg-surface"
	});
}
function NetworkCard({ forms, network }) {
	const deployed = forms.filter((form) => form.deployed);
	const [formId, setFormId] = (0, import_react.useState)(deployed[0]?.id ?? "");
	const [origin, setOrigin] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setOrigin(window.location.origin);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!deployed.some((form) => form.id === formId)) setFormId(deployed[0]?.id ?? "");
	}, [deployed, formId]);
	const path = formId ? `/c/${formId}` : "/c";
	const links = (0, import_react.useMemo)(() => {
		const values = [...network.addresses.map((item) => ({
			label: item.name,
			href: `http://${item.address}:${network.port}${path}`
		}))];
		if (origin) values.unshift({
			label: "هذه الشاشة",
			href: `${origin}${path}`
		});
		return values;
	}, [
		network.addresses,
		network.port,
		origin,
		path
	]);
	const primary = links[0]?.href ?? path;
	async function copy(href) {
		if (!await copyText(href)) return;
		setCopied(href);
		window.setTimeout(() => setCopied(""), 1600);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden rounded-lg border border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3 border-b border-border bg-ink px-4 py-4 text-primary-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-11 shrink-0 place-items-center rounded-lg bg-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, {
					className: "size-5",
					"aria-hidden": "true"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold text-balance",
				children: "جمع عبر الراوتر فقط"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-pretty text-primary-fg/80",
				children: "ميدان هو الخادم. الهاتف الثاني على نفس الواي فاي يفتح الرابط، يملأ النموذج، وتعود الإجابة إلى هذا الجهاز من غير إنترنت."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 p-4 lg:grid-cols-[auto_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { value: primary }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted",
					children: "امسح الرمز من الهاتف"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					deployed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-medium",
						children: ["النموذج المنشور", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: formId,
							onChange: (event) => setFormId(event.target.value),
							className: "mt-1 h-11 w-full rounded-lg border border-border bg-bg px-3 text-fg",
							children: deployed.map((form) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: form.id,
								children: form.title
							}, form.id))
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg bg-bg px-3 py-3 text-sm text-muted",
						children: "انشر نموذجاً من بطاقته ليظهر رابطه هنا. صفحة الجمع تبقى جاهزة."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: link.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-fg",
									dir: "ltr",
									children: link.href
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "shrink-0 px-3",
								onClick: () => void copy(link.href),
								children: [copied === link.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "نسخ"]
							})]
						}, link.href))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: formId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/c/$formId",
							params: { formId },
							className: "inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg",
							children: "فتح نموذج الجمع"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/c",
							className: "inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg",
							children: "صفحة الجمع"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-pretty text-muted",
						children: "الرابط على الشبكة المحلية يعمل بـ http لأن الشهادة لا تحتاج إنترنت. الكاميرا والموقع يعملان بثقة على الجهاز الذي يشغّل ميدان؛ بعض المتصفحات تمنعهما على http من الهاتف، وتبقى أسئلة النص والاختيار والتاريخ متاحة."
					})
				]
			})]
		})]
	});
}
function blankForm() {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return {
		id: crypto.randomUUID(),
		title: "نموذج جديد",
		description: "",
		version: "1",
		deployed: false,
		createdAt: now,
		updatedAt: now,
		questions: [{
			id: crypto.randomUUID(),
			type: "note",
			name: "intro",
			label: "تعليمات قصيرة لجامع البيانات قبل بدء الأسئلة."
		}, {
			id: crypto.randomUUID(),
			type: "text",
			name: "respondent_name",
			label: "الاسم",
			required: true
		}]
	};
}
function Library() {
	const { snap, saveForm, deleteForm } = useMaydan();
	const navigate = useNavigate();
	const fileRef = (0, import_react.useRef)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const today = snap.submissions.filter((row) => isSameLocalDay(row.submittedAt)).length;
	const deployed = snap.forms.filter((form) => form.deployed).length;
	async function createForm() {
		const form = normalizeForm(blankForm());
		await saveForm(form);
		await navigate({
			to: "/forms/$formId",
			params: { formId: form.id }
		});
	}
	async function importFile(file) {
		try {
			const base = {
				id: crypto.randomUUID(),
				deployed: false,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			const form = file.name.toLowerCase().endsWith(".csv") ? formFromCsvText(await file.text(), base) : await formFromXlsx(await file.arrayBuffer(), base);
			const next = normalizeForm(form);
			await saveForm(next);
			toast.success("تم استيراد النموذج");
			await navigate({
				to: "/forms/$formId",
				params: { formId: next.id }
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "تعذّر الاستيراد");
		}
	}
	const stats = [
		{
			label: "النماذج",
			value: snap.forms.length
		},
		{
			label: "منشورة على الشبكة",
			value: deployed
		},
		{
			label: "كل الإجابات",
			value: snap.submissions.length
		},
		{
			label: "اليوم",
			value: today
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-lg border border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-y-0 start-0 w-2 bg-primary",
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-4 px-5 py-5 ps-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xs tracking-widest text-primary",
								children: "FIELD LEDGER"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-3xl font-bold text-balance text-fg",
								children: "دفتر النماذج الميداني"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-pretty text-muted",
								children: "ابنِ النموذج، استورد XLSForm أو CSV، ثم انشره على عنوان جهازك. أي هاتف على نفس الراوتر يعبّئ ويرسل، والبيانات لا تغادر الشبكة."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "primary",
								onClick: () => void createForm(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-4",
									"aria-hidden": "true"
								}), "نموذج جديد"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "quiet",
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
									className: "size-4",
									"aria-hidden": "true"
								}), "استيراد"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: ".xlsx,.xls,.csv",
								className: "sr-only",
								onChange: (event) => {
									const file = event.target.files?.[0];
									event.target.value = "";
									if (file) importFile(file);
								}
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: stat.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-2xl font-bold tabular-nums text-fg",
						children: stat.value
					})]
				}, stat.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetworkCard, {
				forms: snap.forms,
				network: snap.network
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					children: "النماذج"
				}), snap.forms.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-dashed border-border bg-surface px-4 py-8 text-center text-muted",
					children: "لا نماذج بعد. أنشئ واحداً أو استورد ملف XLSForm."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3",
					children: snap.forms.map((form) => {
						const count = snap.submissions.filter((row) => row.formId === form.id).length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-lg border border-border bg-surface p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold text-fg",
										children: form.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: form.deployed ? "rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-fg" : "rounded-full bg-rule px-2 py-1 text-xs font-semibold text-muted",
										children: form.deployed ? "منشور" : "مسودة"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-pretty text-muted",
									children: [
										form.description || "بلا وصف",
										" · ",
										form.questions.length,
										" سؤالاً · ",
										count,
										" إجابة"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/forms/$formId",
											params: { formId: form.id },
											className: "inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold",
											children: "تحرير"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/forms/$formId/data",
											params: { formId: form.id },
											className: "inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, {
												className: "me-2 size-4",
												"aria-hidden": "true"
											}), "البيانات"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "danger",
											onClick: () => {
												if (pendingDelete !== form.id) {
													setPendingDelete(form.id);
													return;
												}
												setPendingDelete(null);
												deleteForm(form.id);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
												className: "size-4",
												"aria-hidden": "true"
											}), pendingDelete === form.id ? "تأكيد الحذف" : "حذف"]
										})
									]
								})]
							})
						}, form.id);
					})
				})]
			})
		]
	});
}
var SplitComponent = Library;
//#endregion
export { SplitComponent as component };
