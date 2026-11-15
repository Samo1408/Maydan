import { i as __toESM } from "../_runtime.mjs";
import { Q as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Camera, d as LocateFixed, o as Star } from "../_libs/lucide-react.mjs";
import { a as cn } from "./router-f6VVsj4x.mjs";
import { c as validateAnswers, o as questionsInScope, r as isRelevant, t as answerCount } from "./logic-B5M4cjnD.mjs";
import { i as TextInput, r as TextArea, t as Button } from "./ui-7WrV9bel.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/runner-DPE-4F9g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function compressImage(file) {
	const url = URL.createObjectURL(file);
	try {
		const image = await new Promise((resolve, reject) => {
			const element = new Image();
			element.onload = () => resolve(element);
			element.onerror = () => reject(/* @__PURE__ */ new Error("image"));
			element.src = url;
		});
		const scale = Math.min(1, 960 / Math.max(image.width, image.height));
		const canvas = document.createElement("canvas");
		canvas.width = Math.max(1, Math.round(image.width * scale));
		canvas.height = Math.max(1, Math.round(image.height * scale));
		const context = canvas.getContext("2d");
		if (!context) return "";
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg", .62);
	} finally {
		URL.revokeObjectURL(url);
	}
}
function FormRunner({ form, submitLabel, onSubmit }) {
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [device, setDevice] = (0, import_react.useState)("جامع البيانات");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [sendError, setSendError] = (0, import_react.useState)("");
	const [geoNote, setGeoNote] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)("");
	const categories = form.categories ?? [];
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("maydan-device");
		if (saved) setDevice(saved);
	}, []);
	const visible = (0, import_react.useMemo)(() => questionsInScope(form, categoryId || void 0).filter((question) => isRelevant(question.relevant, answers)), [
		answers,
		categoryId,
		form
	]);
	const progress = answerCount(form, answers, categoryId || void 0);
	function setAnswer(name, value) {
		setAnswers((current) => ({
			...current,
			[name]: value
		}));
		setErrors((current) => {
			if (!current[name]) return current;
			const next = { ...current };
			delete next[name];
			return next;
		});
	}
	async function submit() {
		const nextErrors = validateAnswers(form, answers, categoryId || void 0);
		setErrors(nextErrors);
		const first = form.questions.find((question) => nextErrors[question.name]);
		if (first) {
			setSendError(nextErrors[first.name] ?? "أكمل الحقول المطلوبة قبل الإرسال");
			document.getElementById(`q-${first.id}`)?.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
			return;
		}
		const clean = {};
		for (const question of visible) {
			if (question.type === "note") continue;
			const value = answers[question.name];
			if (value != null && !(typeof value === "string" && value.trim() === "") && !(Array.isArray(value) && !value.length)) clean[question.name] = value;
		}
		setPending(true);
		setSendError("");
		try {
			localStorage.setItem("maydan-device", device.trim() || "جامع البيانات");
			await onSubmit(clean, device.trim() || "جامع البيانات", categoryId || void 0);
			setAnswers({});
		} catch (error) {
			setSendError(error instanceof Error ? error.message : "لم تصل الإجابة إلى الجهاز المستضيف");
		} finally {
			setPending(false);
		}
	}
	if (categories.length && !categoryId) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-pretty text-muted",
			children: "اختر فئة. أسئلة تلك الفئة فقط هي التي تُفتح وتُرسل."
		}), categories.map((category) => {
			const count = form.questions.filter((question) => question.categoryId === category.id && question.type !== "note").length;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					setCategoryId(category.id);
					setAnswers({});
					setErrors({});
				},
				className: "block w-full rounded-lg border border-border bg-surface p-4 text-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-lg font-bold text-fg",
						children: category.label
					}),
					category.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm text-pretty text-muted",
						children: category.description
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-2 block text-sm font-semibold text-primary tabular-nums",
						children: [count, " سؤالاً"]
					})
				]
			}, category.id);
		})]
	});
	const category = categories.find((item) => item.id === categoryId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm font-semibold text-primary",
				onClick: () => {
					setCategoryId("");
					setAnswers({});
					setErrors({});
				},
				children: "كل الفئات"
			}) : null,
			category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold text-balance",
				children: category.label
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between gap-3 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الحقول المطلوبة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums",
						children: [
							progress.done,
							"/",
							progress.total || visible.filter((question) => question.type !== "note").length
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 overflow-hidden rounded-full bg-rule",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-primary",
						style: { width: `${progress.total ? Math.round(progress.done / progress.total * 100) : 0}%` }
					})
				})]
			}),
			visible.map((question, index) => {
				const value = answers[question.name];
				const error = errors[question.name];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: `q-${question.id}`,
					className: "rounded-lg border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-base font-semibold text-balance text-fg",
								children: [question.label, question.required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent",
									children: " *"
								}) : null]
							}), question.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-pretty text-muted",
								children: question.hint
							}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-xs text-muted",
								children: index + 1
							})]
						}),
						question.type === "note" ? null : null,
						question.type === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: typeof value === "string" ? value : "",
							onChange: (event) => setAnswer(question.name, event.target.value)
						}) : null,
						question.type === "integer" || question.type === "decimal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: question.type === "integer" ? "numeric" : "decimal",
							dir: "ltr",
							className: "text-start",
							value: typeof value === "string" ? value : "",
							onChange: (event) => setAnswer(question.name, event.target.value)
						}) : null,
						question.type === "date" || question.type === "time" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							type: question.type,
							dir: "ltr",
							value: typeof value === "string" ? value : "",
							onChange: (event) => setAnswer(question.name, event.target.value)
						}) : null,
						question.type === "select_one" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2",
							children: (question.choices ?? []).map((choice) => {
								const active = value === choice.name;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2", active ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg text-fg"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										className: "size-4 accent-current",
										checked: active,
										onChange: () => setAnswer(question.name, choice.name)
									}), choice.label]
								}, choice.name);
							})
						}) : null,
						question.type === "select_multiple" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2",
							children: (question.choices ?? []).map((choice) => {
								const selected = Array.isArray(value) ? value : [];
								const active = selected.includes(choice.name);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2", active ? "border-primary bg-surface text-fg" : "border-border bg-bg text-fg"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "size-4",
										checked: active,
										onChange: () => setAnswer(question.name, active ? selected.filter((item) => item !== choice.name) : [...selected, choice.name])
									}), choice.label]
								}, choice.name);
							})
						}) : null,
						question.type === "acknowledge" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "size-4",
								checked: value === "OK",
								onChange: (event) => setAnswer(question.name, event.target.checked ? "OK" : "")
							}), "أقرّ بذلك"]
						}) : null,
						question.type === "rating" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								"1",
								"2",
								"3",
								"4",
								"5"
							].map((score) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setAnswer(question.name, score),
								className: cn("inline-flex size-11 items-center justify-center rounded-lg border font-semibold tabular-nums", value === score ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg text-fg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
									className: "me-1 size-3",
									"aria-hidden": "true"
								}), score]
							}, score))
						}) : null,
						question.type === "geopoint" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									dir: "ltr",
									placeholder: "33.513800 36.276500",
									value: typeof value === "string" ? value : "",
									onChange: (event) => setAnswer(question.name, event.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "quiet",
									onClick: () => {
										if (!navigator.geolocation) {
											setGeoNote("هذا المتصفح لا يوفّر الموقع.");
											return;
										}
										setGeoNote("جارٍ تحديد الموقع…");
										navigator.geolocation.getCurrentPosition((position) => {
											const next = `${position.coords.latitude.toFixed(6)} ${position.coords.longitude.toFixed(6)} ${Math.round(position.coords.accuracy)}`;
											setAnswer(question.name, next);
											setGeoNote("تم حفظ الإحداثيات على هذا الجهاز.");
										}, () => setGeoNote("تعذّر قراءة الموقع. اكتبه يدوياً."), {
											enableHighAccuracy: true,
											timeout: 12e3,
											maximumAge: 15e3
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, {
										className: "size-4",
										"aria-hidden": "true"
									}), "تحديد موقعي"]
								}),
								geoNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: geoNote
								}) : null
							]
						}) : null,
						question.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border bg-bg px-4 text-sm font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
										className: "size-4",
										"aria-hidden": "true"
									}),
									"التقاط أو اختيار صورة",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										capture: "environment",
										className: "sr-only",
										onChange: (event) => {
											const file = event.target.files?.[0];
											event.target.value = "";
											if (!file) return;
											compressImage(file).then((src) => {
												if (src) setAnswer(question.name, src);
											});
										}
									})
								]
							}), typeof value === "string" && value.startsWith("data:image") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: value,
								alt: "معاينة المرفق",
								className: "max-h-48 rounded-lg border border-border"
							}) : null]
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-medium text-accent",
							children: error
						}) : null
					]
				}, question.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-sm font-medium",
							children: "اسم جامع البيانات"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: device,
							onChange: (event) => setDevice(event.target.value),
							maxLength: 80
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						className: "mt-4 w-full",
						disabled: pending,
						onClick: () => void submit(),
						children: pending ? "يُرسل…" : submitLabel
					}),
					sendError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-medium text-accent",
						children: sendError
					}) : null
				]
			})
		]
	});
}
//#endregion
export { FormRunner as t };
