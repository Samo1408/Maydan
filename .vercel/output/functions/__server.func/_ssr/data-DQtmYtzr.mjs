import { i as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as Download, i as Trash2, n as Upload } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route, o as useMaydan, s as getSubmission } from "./router-Cepilhqt.mjs";
import { t as Button } from "./ui-C478GlXb.mjs";
import { t as FormRunner } from "./runner-BNuxpO1p.mjs";
import { c as submissionsFromCsv, i as fileSlug, l as submissionsToCsv, n as downloadBlob, r as downloadText, u as submissionsToXlsxBlob } from "./xlsform-CeDgaR0A.mjs";
import { t as formatWhen } from "./format-DUe4hblF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-DQtmYtzr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function labelOf(question, value) {
	if (value == null || value === "") return "—";
	if (value === "__image__" || typeof value === "string" && value.startsWith("data:")) return "صورة مرفقة";
	if (question.type === "acknowledge") return value === "OK" ? "نعم" : "—";
	const names = Array.isArray(value) ? value : String(value).split(/\s+/);
	if (question.choices?.length && (question.type === "select_one" || question.type === "select_multiple")) return names.map((name) => question.choices?.find((choice) => choice.name === name)?.label ?? name).join("، ");
	return Array.isArray(value) ? value.join(" ") : String(value);
}
function SummaryCharts({ questions, rows }) {
	const [charts, setCharts] = (0, import_react.useState)(null);
	const blocks = (0, import_react.useMemo)(() => {
		return questions.filter((question) => question.type === "select_one" || question.type === "select_multiple" || question.type === "rating").slice(0, 4).map((question) => {
			const buckets = /* @__PURE__ */ new Map();
			(question.type === "rating" ? [
				"1",
				"2",
				"3",
				"4",
				"5"
			] : (question.choices ?? []).map((choice) => choice.name)).forEach((key) => buckets.set(key, 0));
			for (const row of rows) {
				const raw = row.answers[question.name];
				const picked = Array.isArray(raw) ? raw : raw ? String(raw).split(/\s+/).filter(Boolean) : [];
				for (const key of picked) buckets.set(key, (buckets.get(key) ?? 0) + 1);
			}
			return {
				id: question.id,
				title: question.label,
				data: [...buckets.entries()].map(([key, count]) => ({
					name: question.choices?.find((choice) => choice.name === key)?.label ?? key,
					count
				}))
			};
		});
	}, [questions, rows]);
	(0, import_react.useEffect)(() => {
		if (charts) return;
		let cancel = false;
		import("../_libs/recharts+[...].mjs").then((n) => n.t).then((mod) => {
			if (!cancel) setCharts(mod);
		});
		return () => {
			cancel = true;
		};
	}, [charts]);
	if (!charts) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 md:grid-cols-2",
		children: blocks.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-surface p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-sm font-semibold",
				children: block.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-sm",
				children: block.data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: item.count
					})]
				}, item.name))
			})]
		}, block.id))
	});
	const { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } = charts;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 md:grid-cols-2",
		children: blocks.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-surface p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-sm font-semibold text-balance",
				children: block.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-52",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: block.data,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								interval: 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								width: 28
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								fill: "var(--color-primary)",
								radius: 4
							})
						]
					})
				})
			})]
		}, block.id))
	});
}
function PhotoSlot({ submissionId, name }) {
	const [src, setSrc] = (0, import_react.useState)("");
	if (src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		className: "mt-2 max-h-48 rounded-lg border border-border"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "mt-1 text-sm font-semibold text-primary",
		onClick: () => {
			getSubmission({ data: { id: submissionId } }).then((result) => {
				const value = result.submission?.answers[name];
				if (typeof value === "string" && value.startsWith("data:")) setSrc(value);
				else toast.message("لا توجد صورة في هذه الإجابة");
			});
		},
		children: "عرض الصورة"
	});
}
function DataView({ formId }) {
	const { snap, deleteSubmission, importSubmissions, addSubmission } = useMaydan();
	const form = snap.forms.find((item) => item.id === formId);
	const fileRef = (0, import_react.useRef)(null);
	const [filling, setFilling] = (0, import_react.useState)(false);
	const rows = snap.submissions.filter((row) => row.formId === formId);
	if (!form) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-bold",
			children: "النموذج غير موجود"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-3 inline-flex font-semibold text-primary",
			children: "المكتبة"
		})]
	});
	const numbers = form.questions.filter((question) => question.type === "integer" || question.type === "decimal");
	async function exportXlsx() {
		downloadBlob(await submissionsToXlsxBlob(form, rows), `${fileSlug(form.title)}-data.xlsx`);
	}
	async function onImport(file) {
		try {
			let text = "";
			if (file.name.toLowerCase().endsWith(".csv")) text = await file.text();
			else {
				const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
				const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
				const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ""];
				text = sheet ? XLSX.utils.sheet_to_csv(sheet) : "";
			}
			const parsed = submissionsFromCsv(text, form);
			if (!parsed.length) {
				toast.error("لم تُقرأ صفوف. تأكد أن العناوين تطابق أسماء الحقول.");
				return;
			}
			await importSubmissions(formId, parsed);
			toast.success(`تم استيراد ${parsed.length} صفاً`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "تعذّر الاستيراد");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/forms/$formId",
						params: { formId },
						className: "text-sm font-semibold text-primary",
						children: "تحرير النموذج"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-bold text-balance",
						children: form.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted tabular-nums",
						children: [rows.length, " إجابة محفوظة على هذا الخادم"]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "quiet",
							onClick: () => downloadText(`${fileSlug(form.title)}-data.csv`, submissionsToCsv(form, rows)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							onClick: () => void exportXlsx(),
							children: "XLSX"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "quiet",
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "استيراد"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: () => setFilling((value) => !value),
							children: filling ? "إغلاق الإدخال" : "إدخال من المكتب"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							className: "sr-only",
							type: "file",
							accept: ".csv,.xlsx,.xls",
							onChange: (event) => {
								const file = event.target.files?.[0];
								event.target.value = "";
								if (file) onImport(file);
							}
						})
					]
				})]
			}),
			numbers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: numbers.map((question) => {
					const values = rows.map((row) => Number(row.answers[question.name])).filter((value) => !Number.isNaN(value));
					const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: question.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-lg font-bold tabular-nums",
							children: [values.length ? avg.toFixed(1) : "—", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ms-2 text-sm font-medium text-muted",
								children: [
									"متوسط · ",
									values.length,
									" قيمة"
								]
							})]
						})]
					}, question.id);
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCharts, {
				questions: form.questions,
				rows
			}),
			filling ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border bg-bg p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormRunner, {
					form,
					submitLabel: "حفظ الإجابة في الدفتر",
					onSubmit: async (answers, deviceLabel) => {
						await addSubmission({
							formId,
							answers,
							deviceLabel,
							source: "desk"
						});
						toast.success("حُفظت الإجابة في دفتر هذا الجهاز");
						setFilling(false);
					}
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-lg border border-dashed border-border bg-surface px-4 py-8 text-center text-muted",
					children: "لا إجابات بعد. أدخل من المكتب أو افتح رابط الجمع من هاتف على الشبكة."
				}) : rows.map((row) => {
					const titleQuestion = form.questions.find((question) => question.type === "text");
					const titleValue = titleQuestion ? labelOf(titleQuestion, row.answers[titleQuestion.name]) : row.deviceLabel;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-bold",
								children: titleValue
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									formatWhen(row.submittedAt),
									" · ",
									row.deviceLabel,
									" · ",
									row.source === "lan" ? "من الشبكة" : "من المكتب"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "danger",
								onClick: () => void deleteSubmission(row.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "حذف"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-3 grid gap-2 sm:grid-cols-2",
							children: form.questions.filter((question) => question.type !== "note").map((question) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-muted",
									children: question.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-sm font-medium text-fg",
									children: labelOf(question, row.answers[question.name])
								}),
								question.type === "image" && (row.answers[question.name] === "__image__" || typeof row.answers[question.name] === "string" && String(row.answers[question.name]).startsWith("data:")) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoSlot, {
									submissionId: row.id,
									name: question.name
								}) : null
							] }, question.id))
						})]
					}, row.id);
				})
			})
		]
	});
}
function DataPage() {
	const { formId } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataView, { formId });
}
//#endregion
export { DataPage as component };
