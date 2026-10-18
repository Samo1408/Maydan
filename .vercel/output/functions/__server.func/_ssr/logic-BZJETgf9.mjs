//#region node_modules/.nitro/vite/services/ssr/assets/logic-BZJETgf9.js
function isBlank(value) {
	if (value == null) return true;
	if (Array.isArray(value)) return value.length === 0;
	return String(value).trim() === "";
}
function asText(value) {
	if (Array.isArray(value)) return value.join(" ");
	if (value == null) return "";
	return String(value);
}
function compare(left, op, right) {
	const ln = Number(left);
	const rn = Number(right);
	const numeric = left.trim() !== "" && right.trim() !== "" && !Number.isNaN(ln) && !Number.isNaN(rn);
	if (op === "=") return numeric ? ln === rn : left === right;
	if (op === "!=") return numeric ? ln !== rn : left !== right;
	if (!numeric) return false;
	if (op === ">") return ln > rn;
	if (op === ">=") return ln >= rn;
	if (op === "<") return ln < rn;
	if (op === "<=") return ln <= rn;
	return false;
}
function splitTop(input, keyword) {
	const parts = [];
	let buf = "";
	let quote = null;
	for (let i = 0; i < input.length; i++) {
		const ch = input[i];
		if (quote) {
			buf += ch;
			if (ch === quote) quote = null;
			continue;
		}
		if (ch === "'" || ch === "\"") {
			quote = ch;
			buf += ch;
			continue;
		}
		if (input.slice(i, i + keyword.length).toLowerCase() === keyword) {
			parts.push(buf);
			buf = "";
			i += keyword.length - 1;
			continue;
		}
		buf += ch;
	}
	parts.push(buf);
	return parts;
}
function evalAtom(atom, answers) {
	const selected = atom.match(/^selected\(\s*\$\{([A-Za-z_][A-Za-z0-9_]*)\}\s*,\s*'([^']*)'\s*\)$/i);
	if (selected) {
		const raw = answers[selected[1]];
		return (Array.isArray(raw) ? raw : raw ? raw.split(/\s+/) : []).includes(selected[2]);
	}
	const cmp = atom.match(/^\$\{([A-Za-z_][A-Za-z0-9_]*)\}\s*(!=|>=|<=|=|>|<)\s*(?:'([^']*)'|"([^"]*)"|(-?\d+(?:\.\d+)?))$/);
	if (!cmp) return true;
	const right = cmp[3] ?? cmp[4] ?? cmp[5] ?? "";
	return compare(asText(answers[cmp[1]]), cmp[2], right);
}
function isRelevant(expr, answers) {
	if (!expr?.trim()) return true;
	return splitTop(expr.trim(), " or ").some((part) => {
		return splitTop(part, " and ").map((item) => item.trim()).filter(Boolean).every((atom) => evalAtom(atom, answers));
	});
}
function passesConstraint(expr, value) {
	if (!expr?.trim() || isBlank(value)) return true;
	const current = asText(value);
	return splitTop(expr.trim(), " and ").map((item) => item.trim()).filter(Boolean).every((atom) => {
		const match = atom.match(/^\.\s*(!=|>=|<=|=|>|<)\s*(?:'([^']*)'|"([^"]*)"|(-?\d+(?:\.\d+)?))$/);
		if (!match) return true;
		const right = match[2] ?? match[3] ?? match[4] ?? "";
		return compare(current, match[1], right);
	});
}
function visibleQuestions(form, answers) {
	return form.questions.filter((question) => isRelevant(question.relevant, answers));
}
function validateAnswers(form, answers) {
	const errors = {};
	for (const question of form.questions) {
		if (!isRelevant(question.relevant, answers) || question.type === "note") continue;
		const value = answers[question.name];
		if (question.required && isBlank(value)) {
			errors[question.name] = "هذا الحقل مطلوب";
			continue;
		}
		if (!isBlank(value) && (question.type === "integer" || question.type === "decimal" || question.type === "rating")) {
			const numeric = Number(value);
			if (Number.isNaN(numeric)) {
				errors[question.name] = "أدخل رقماً صالحاً";
				continue;
			}
			if (question.type === "integer" && !Number.isInteger(numeric)) {
				errors[question.name] = "أدخل عدداً صحيحاً";
				continue;
			}
			if (question.type === "rating" && (numeric < 1 || numeric > 5)) {
				errors[question.name] = "التقييم من 1 إلى 5";
				continue;
			}
		}
		if (question.type === "geopoint" && !isBlank(value)) {
			const parts = asText(value).trim().split(/\s+/);
			if (parts.length < 2 || parts.slice(0, 2).some((part) => Number.isNaN(Number(part)))) {
				errors[question.name] = "أدخل خط العرض وخط الطول";
				continue;
			}
		}
		if (!passesConstraint(question.constraint, value)) errors[question.name] = question.constraintMessage?.trim() || "القيمة خارج الشرط المسموح";
	}
	return errors;
}
function sanitizeName(raw, fallback) {
	let name = raw.trim().replace(/\s+/g, "_").replace(/[^A-Za-z0-9_]/g, "");
	if (!name) name = fallback;
	if (!/^[A-Za-z_]/.test(name)) name = `n_${name}`;
	return name.slice(0, 64);
}
function uniqueName(name, used) {
	const base = name || "q";
	let next = base;
	let index = 2;
	while (used.has(next)) next = `${base}_${index++}`;
	used.add(next);
	return next;
}
function normalizeForm(form) {
	const used = /* @__PURE__ */ new Set();
	const questions = form.questions.map((question, index) => {
		const name = uniqueName(sanitizeName(question.name, `q${index + 1}`), used);
		const select = question.type === "select_one" || question.type === "select_multiple";
		const choiceNames = /* @__PURE__ */ new Set();
		const choices = select ? (question.choices ?? []).map((choice, choiceIndex) => ({
			name: uniqueName(sanitizeName(choice.name, `c${choiceIndex + 1}`), choiceNames),
			label: choice.label.trim() || `خيار ${choiceIndex + 1}`
		})) : void 0;
		return {
			...question,
			name,
			label: question.label.trim() || "سؤال بلا عنوان",
			hint: question.hint?.trim() || void 0,
			relevant: question.relevant?.trim() || void 0,
			constraint: question.constraint?.trim() || void 0,
			constraintMessage: question.constraintMessage?.trim() || void 0,
			required: Boolean(question.required) && question.type !== "note",
			choices
		};
	});
	return {
		...form,
		title: form.title.trim() || "نموذج بلا عنوان",
		description: form.description.trim(),
		version: form.version.trim() || "1",
		questions,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function answerCount(form, answers) {
	const required = visibleQuestions(form, answers).filter((question) => question.required && question.type !== "note");
	return {
		done: required.filter((question) => !isBlank(answers[question.name])).length,
		total: required.length
	};
}
//#endregion
export { validateAnswers as a, sanitizeName as i, isRelevant as n, normalizeForm as r, answerCount as t };
