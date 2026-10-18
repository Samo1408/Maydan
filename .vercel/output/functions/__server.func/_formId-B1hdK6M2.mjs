import { i as __toESM } from "./_runtime.mjs";
import { n as QUESTION_TYPES } from "./_ssr/types-CBZYY146.mjs";
import { i as sanitizeName, r as normalizeForm } from "./_ssr/logic-BZJETgf9.mjs";
import { Z as require_react, w as require_jsx_runtime, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { C as CalendarDays, S as Camera, a as StickyNote, b as ChevronDown, c as Sigma, f as List, g as Download, i as Trash2, l as Plus, m as Hash, n as Upload, o as Star, p as ListChecks, s as SquareCheckBig, u as MapPin, v as Clock, w as AlignLeft, y as ChevronUp } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as cn, o as useMaydan, r as Route$1 } from "./_ssr/router-Cepilhqt.mjs";
import { a as Toggle, i as TextInput, n as Field, r as TextArea, t as Button } from "./_ssr/ui-C478GlXb.mjs";
import { t as FormRunner } from "./_ssr/runner-BNuxpO1p.mjs";
import { a as formFromCsvText, d as surveyMatrix, f as toCsv, i as fileSlug, n as downloadBlob, o as formFromXlsx, r as downloadText, s as formToXlsxBlob } from "./_ssr/xlsform-CeDgaR0A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_formId-B1hdK6M2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPE_META = {
	text: {
		label: "نص",
		icon: AlignLeft
	},
	integer: {
		label: "عدد صحيح",
		icon: Hash
	},
	decimal: {
		label: "عدد عشري",
		icon: Sigma
	},
	select_one: {
		label: "اختيار واحد",
		icon: List
	},
	select_multiple: {
		label: "اختيار متعدد",
		icon: ListChecks
	},
	note: {
		label: "ملاحظة",
		icon: StickyNote
	},
	date: {
		label: "تاريخ",
		icon: CalendarDays
	},
	time: {
		label: "وقت",
		icon: Clock
	},
	geopoint: {
		label: "موقع",
		icon: MapPin
	},
	image: {
		label: "صورة",
		icon: Camera
	},
	acknowledge: {
		label: "إقرار",
		icon: SquareCheckBig
	},
	rating: {
		label: "تقييم",
		icon: Star
	}
};
function freshQuestion(type, index) {
	const base = {
		id: crypto.randomUUID(),
		type,
		name: `q${index}`,
		label: TYPE_META[type].label,
		required: type !== "note" && type !== "image"
	};
	if (type === "select_one" || type === "select_multiple") base.choices = [{
		name: "yes",
		label: "نعم"
	}, {
		name: "no",
		label: "لا"
	}];
	if (type === "rating") base.constraint = ". >= 1 and . <= 5";
	if (type === "note") {
		base.required = false;
		base.label = "ملاحظة تظهر لجامع البيانات ولا تُجمع كإجابة.";
	}
	return base;
}
function Builder({ formId }) {
	const { snap, saveForm, offline } = useMaydan();
	const remote = snap.forms.find((form) => form.id === formId);
	const [draft, setDraft] = (0, import_react.useState)(remote ?? null);
	const [activeId, setActiveId] = (0, import_react.useState)(remote?.questions[0]?.id ?? "");
	const [status, setStatus] = (0, import_react.useState)(offline ? "على الجهاز" : "محفوظ");
	const [preview, setPreview] = (0, import_react.useState)(false);
	const dirty = (0, import_react.useRef)(false);
	const saveRef = (0, import_react.useRef)(saveForm);
	saveRef.current = saveForm;
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!remote) return;
		setDraft((current) => !current || current.id !== remote.id ? remote : current);
		setActiveId((current) => current || remote.questions[0]?.id || "");
	}, [remote]);
	(0, import_react.useEffect)(() => {
		if (!draft || !dirty.current) return;
		const handle = window.setTimeout(() => {
			dirty.current = false;
			const normalized = normalizeForm(draft);
			setStatus("يحفظ…");
			saveRef.current(normalized).then(() => setStatus(offline ? "محفوظ على الجهاز" : "محفوظ على الخادم"));
		}, 700);
		return () => window.clearTimeout(handle);
	}, [draft, offline]);
	function update(patch) {
		dirty.current = true;
		setStatus("تعديل…");
		setDraft((current) => {
			if (!current) return current;
			return typeof patch === "function" ? patch(current) : {
				...current,
				...patch
			};
		});
	}
	if (!draft) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-bold",
			children: "النموذج غير موجود"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-4 inline-flex min-h-11 items-center font-semibold text-primary",
			children: "العودة إلى المكتبة"
		})]
	});
	const active = draft.questions.find((question) => question.id === activeId) ?? draft.questions[0];
	function patchQuestion(id, patch) {
		update((form) => ({
			...form,
			questions: form.questions.map((question) => question.id === id ? {
				...question,
				...patch
			} : question)
		}));
	}
	async function exportXlsx() {
		if (!draft) return;
		const blob = await formToXlsxBlob(normalizeForm(draft));
		downloadBlob(blob, `${fileSlug(draft.title)}.xlsx`);
	}
	function exportCsv() {
		if (!draft) return;
		downloadText(`${fileSlug(draft.title)}-survey.csv`, toCsv(surveyMatrix(normalizeForm(draft))));
	}
	async function importFile(file) {
		if (!draft) return;
		try {
			const next = file.name.toLowerCase().endsWith(".csv") ? formFromCsvText(await file.text(), draft) : await formFromXlsx(await file.arrayBuffer(), draft);
			dirty.current = true;
			setDraft(normalizeForm({
				...next,
				id: draft.id,
				createdAt: draft.createdAt
			}));
			toast.success("استُبدلت أسئلة هذا النموذج بمحتوى الملف");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "تعذّر الاستيراد");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-sm font-semibold text-primary",
						children: "المكتبة"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/forms/$formId/data",
						params: { formId },
						className: "text-sm font-semibold text-primary",
						children: "البيانات"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ms-auto text-sm text-muted",
						children: status
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "عنوان النموذج",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: draft.title,
									onChange: (event) => update({ title: event.target.value })
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:pt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								checked: draft.deployed,
								label: draft.deployed ? "منشور على الشبكة" : "مسودة",
								onChange: (deployed) => update({ deployed })
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "وصف قصير",
							hint: "يظهر في المكتبة وصفحة الجمع",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: draft.description,
								onChange: (event) => update({ description: event.target.value })
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "quiet",
								onClick: () => void exportXlsx(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "تصدير XLSForm"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "quiet",
								onClick: exportCsv,
								children: "تصدير CSV"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "quiet",
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "استيراد"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setPreview((value) => !value),
								children: preview ? "إخفاء المعاينة" : "معاينة التعبئة"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								className: "sr-only",
								type: "file",
								accept: ".xlsx,.xls,.csv",
								onChange: (event) => {
									const file = event.target.files?.[0];
									event.target.value = "";
									if (file) importFile(file);
								}
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-3 rounded-lg border border-border bg-surface p-3 lg:col-span-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-1 text-sm font-semibold",
							children: "الأسئلة"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1",
							children: draft.questions.map((question, index) => {
								const Icon = TYPE_META[question.type].icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setActiveId(question.id),
											className: cn("flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-start text-sm", active?.id === question.id ? "bg-primary text-primary-fg" : "hover:bg-rule"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												className: "size-4 shrink-0",
												"aria-hidden": "true"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: question.label
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "grid size-11 place-items-center rounded-lg hover:bg-rule",
											"aria-label": "تحريك لأعلى",
											onClick: () => update((form) => {
												if (index === 0) return form;
												const questions = [...form.questions];
												const [item] = questions.splice(index, 1);
												questions.splice(index - 1, 0, item);
												return {
													...form,
													questions
												};
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "grid size-11 place-items-center rounded-lg hover:bg-rule",
											"aria-label": "تحريك لأسفل",
											onClick: () => update((form) => {
												if (index === form.questions.length - 1) return form;
												const questions = [...form.questions];
												const [item] = questions.splice(index, 1);
												questions.splice(index + 1, 0, item);
												return {
													...form,
													questions
												};
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
										})
									]
								}, question.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: QUESTION_TYPES.map((type) => {
								const Icon = TYPE_META[type].icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex min-h-11 items-center gap-2 rounded-lg border border-border bg-bg px-2 text-start text-xs font-semibold hover:border-primary",
									onClick: () => {
										const question = freshQuestion(type, draft.questions.length + 1);
										update((form) => ({
											...form,
											questions: [...form.questions, question]
										}));
										setActiveId(question.id);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-4 shrink-0 text-primary",
										"aria-hidden": "true"
									}), TYPE_META[type].label]
								}, type);
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 lg:col-span-2",
					children: [active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 rounded-lg border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold",
									children: TYPE_META[active.type].label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "danger",
									onClick: () => update((form) => ({
										...form,
										questions: form.questions.filter((question) => question.id !== active.id)
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "حذف السؤال"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "نص السؤال",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
									value: active.label,
									onChange: (event) => patchQuestion(active.id, { label: event.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "اسم الحقل في الملف",
									hint: "أحرف لاتينية، كما في XLSForm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										dir: "ltr",
										value: active.name,
										onChange: (event) => patchQuestion(active.id, { name: event.target.value }),
										onBlur: (event) => patchQuestion(active.id, { name: sanitizeName(event.target.value, `q${draft.questions.length}`) })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "تلميح",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: active.hint ?? "",
										onChange: (event) => patchQuestion(active.id, { hint: event.target.value })
									})
								})]
							}),
							active.type !== "note" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								checked: Boolean(active.required),
								label: "مطلوب",
								onChange: (required) => patchQuestion(active.id, { required })
							}) : null,
							active.type === "select_one" || active.type === "select_multiple" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: "الخيارات"
									}),
									(active.choices ?? []).map((choice, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
												dir: "ltr",
												className: "min-w-0 flex-1",
												value: choice.name,
												"aria-label": "اسم الخيار",
												onChange: (event) => patchQuestion(active.id, { choices: (active.choices ?? []).map((item, itemIndex) => itemIndex === index ? {
													...item,
													name: event.target.value
												} : item) })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
												className: "min-w-0 flex-1",
												value: choice.label,
												"aria-label": "تسمية الخيار",
												onChange: (event) => patchQuestion(active.id, { choices: (active.choices ?? []).map((item, itemIndex) => itemIndex === index ? {
													...item,
													label: event.target.value
												} : item) })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												"aria-label": "حذف الخيار",
												onClick: () => patchQuestion(active.id, { choices: (active.choices ?? []).filter((_, itemIndex) => itemIndex !== index) }),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
											})
										]
									}, `${active.id}-${index}`)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "quiet",
										onClick: () => patchQuestion(active.id, { choices: [...active.choices ?? [], {
											name: `c${(active.choices?.length ?? 0) + 1}`,
											label: "خيار"
										}] }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "خيار"]
									})
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "شرط الظهور",
								hint: "مثال: ${housing_type} = 'tent' أو selected(${services}, 'water')",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									dir: "ltr",
									value: active.relevant ?? "",
									onChange: (event) => patchQuestion(active.id, { relevant: event.target.value })
								})
							}),
							active.type !== "note" && active.type !== "select_one" && active.type !== "select_multiple" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "قيد القيمة",
									hint: "مثال: . >= 1 and . <= 30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										dir: "ltr",
										value: active.constraint ?? "",
										onChange: (event) => patchQuestion(active.id, { constraint: event.target.value })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "رسالة القيد",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: active.constraintMessage ?? "",
										onChange: (event) => patchQuestion(active.id, { constraintMessage: event.target.value })
									})
								})]
							}) : null
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg border border-dashed border-border bg-surface p-6 text-muted",
						children: "أضف سؤالاً من القائمة."
					}), preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-bg p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm font-semibold",
							children: "معاينة — الإرسال هنا تجريبي ولا يُحفظ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormRunner, {
							form: normalizeForm(draft),
							submitLabel: "تجربة الإرسال",
							onSubmit: async () => {
								toast.success("المعاينة سليمة. انشر النموذج ثم افتح رابط الجمع لحفظ إجابة حقيقية.");
							}
						})]
					}) : null]
				})]
			})
		]
	});
}
function FormPage() {
	const { formId } = Route$1.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Builder, { formId });
}
//#endregion
export { FormPage as component };
