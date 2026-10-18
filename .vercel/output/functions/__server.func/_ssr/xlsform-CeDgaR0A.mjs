import { n as QUESTION_TYPES } from "./types-CBZYY146.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/xlsform-CeDgaR0A.js
function parseCsv(text) {
	const src = text.charCodeAt(0) === 65279 ? text.slice(1) : text;
	const rows = [];
	let row = [];
	let cell = "";
	let quoted = false;
	for (let i = 0; i < src.length; i++) {
		const ch = src[i];
		if (quoted) {
			if (ch === "\"") {
				if (src[i + 1] === "\"") {
					cell += "\"";
					i += 1;
				} else quoted = false;
			} else cell += ch;
			continue;
		}
		if (ch === "\"") {
			quoted = true;
			continue;
		}
		if (ch === ",") {
			row.push(cell);
			cell = "";
			continue;
		}
		if (ch === "\n") {
			row.push(cell);
			rows.push(row);
			row = [];
			cell = "";
			continue;
		}
		if (ch !== "\r") cell += ch;
	}
	if (cell.length || row.length) {
		row.push(cell);
		rows.push(row);
	}
	return rows.filter((item) => item.some((value) => value.trim() !== ""));
}
function toCsv(rows) {
	return `\uFEFF${rows.map((row) => row.map((cell) => /[",\n\r]/.test(cell) ? `"${cell.replace(/"/g, "\"\"")}"` : cell).join(",")).join("\r\n")}`;
}
function cellValue(value) {
	if (value == null) return "";
	if (Array.isArray(value)) return value.join(" ");
	if (value === "__image__" || value.startsWith("data:")) return "yes";
	return value;
}
function submissionsToCsv(form, rows) {
	const questions = form.questions.filter((question) => question.type !== "note");
	return toCsv([[
		"_id",
		"_submitted_at",
		"_device",
		"_source",
		...questions.map((question) => question.name)
	], ...rows.map((row) => [
		row.id,
		row.submittedAt,
		row.deviceLabel,
		row.source,
		...questions.map((question) => cellValue(row.answers[question.name]))
	])]);
}
function submissionsFromCsv(text, form) {
	const matrix = parseCsv(text);
	if (matrix.length < 2) return [];
	const header = matrix[0].map((item) => item.trim());
	const names = new Set(form.questions.map((question) => question.name));
	return matrix.slice(1).map((line) => {
		const answers = {};
		let deviceLabel;
		let submittedAt;
		header.forEach((key, index) => {
			const value = (line[index] ?? "").trim();
			if (!value) return;
			if (key === "_device") deviceLabel = value;
			else if (key === "_submitted_at") submittedAt = value;
			else if (names.has(key)) {
				const question = form.questions.find((item) => item.name === key);
				answers[key] = question?.type === "select_multiple" ? value.split(/\s+/).filter(Boolean) : value;
			}
		});
		return {
			answers,
			deviceLabel,
			submittedAt
		};
	});
}
function looksLikeSurveyCsv(text) {
	const header = (parseCsv(text)[0] ?? []).map((item) => item.trim().toLowerCase());
	return header.includes("type") && header.includes("name") && header.includes("label");
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
}
function downloadText(filename, content, type = "text/csv;charset=utf-8") {
	downloadBlob(new Blob([content], { type }), filename);
}
function fileSlug(title) {
	return title.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 48) || "maydan";
}
async function copyText(value) {
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		return false;
	}
}
function asRows(matrix) {
	if (!matrix.length) return [];
	const header = matrix[0].map((cell) => cell.trim().toLowerCase());
	return matrix.slice(1).map((line) => {
		const row = {};
		header.forEach((key, index) => {
			if (key) row[key] = (line[index] ?? "").trim();
		});
		return row;
	});
}
function yes(value) {
	return [
		"yes",
		"true",
		"1",
		"y",
		"نعم"
	].includes((value ?? "").trim().toLowerCase());
}
function choiceList(raw) {
	if (!raw?.trim()) return [];
	return raw.split("|").map((part) => part.trim()).filter(Boolean).map((part, index) => {
		const splitAt = part.indexOf(":");
		if (splitAt === -1) return {
			name: `c${index + 1}`,
			label: part
		};
		return {
			name: part.slice(0, splitAt).trim() || `c${index + 1}`,
			label: part.slice(splitAt + 1).trim() || part
		};
	});
}
function questionFromRow(row, choices, index) {
	const rawType = (row.type ?? "").trim();
	if (!rawType || rawType.startsWith("begin_") || rawType.startsWith("end_") || rawType === "start" || rawType === "end" || rawType === "today" || rawType === "deviceid") return null;
	const [kind, listName] = rawType.split(/\s+/);
	let type = "text";
	if (kind === "select_one" || kind === "select_multiple") type = kind;
	else if (kind === "range") type = "rating";
	else if (QUESTION_TYPES.includes(kind ?? "")) type = kind;
	else return null;
	const list = listName ? choices.filter((choice) => choice.name.startsWith(`${listName}::`)).map((choice) => ({
		name: choice.name.slice(listName.length + 2),
		label: choice.label
	})) : choiceList(row.choices);
	return {
		id: crypto.randomUUID(),
		type,
		name: row.name || `q${index + 1}`,
		label: row.label || row.name || "سؤال",
		hint: row.hint || void 0,
		required: yes(row.required),
		relevant: row.relevant || void 0,
		constraint: row.constraint || (type === "rating" ? ". >= 1 and . <= 5" : void 0),
		constraintMessage: row.constraint_message || void 0,
		choices: type === "select_one" || type === "select_multiple" ? list : void 0
	};
}
function formFromCsvText(text, base) {
	if (!looksLikeSurveyCsv(text)) throw new Error("ملف CSV ليس تعريف نموذج. يلزم أعمدة type و name و label.");
	const rows = asRows(parseCsv(text));
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const questions = rows.map((row, index) => questionFromRow(row, [], index)).filter((item) => item !== null);
	if (!questions.length) throw new Error("لم يُعثر على أسئلة صالحة في الملف.");
	return {
		id: base?.id || crypto.randomUUID(),
		title: base?.title || rows.find((row) => row.form_title)?.form_title || "نموذج مستورد",
		description: base?.description || "استُورد من CSV.",
		version: base?.version || "1",
		deployed: base?.deployed ?? false,
		questions,
		createdAt: base?.createdAt || now,
		updatedAt: now
	};
}
function sheetMatrix(XLSX, workbook, name) {
	const found = workbook.SheetNames.find((sheet) => sheet.toLowerCase() === name.toLowerCase());
	const sheet = found ? workbook.Sheets[found] : void 0;
	if (!sheet) return [];
	return XLSX.utils.sheet_to_json(sheet, {
		header: 1,
		raw: false,
		defval: ""
	});
}
async function formFromXlsx(buffer, base) {
	const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const workbook = XLSX.read(buffer, { type: "array" });
	const survey = sheetMatrix(XLSX, workbook, "survey");
	const choicesSheet = sheetMatrix(XLSX, workbook, "choices");
	const settings = asRows(sheetMatrix(XLSX, workbook, "settings"))[0];
	const matrix = survey.length ? survey : sheetMatrix(XLSX, workbook, workbook.SheetNames[0] ?? "");
	if (!matrix.length) throw new Error("المصنف فارغ.");
	const header = matrix[0].map((cell) => String(cell).trim().toLowerCase());
	if (!header.includes("type") || !header.includes("name")) throw new Error("ورقة survey يجب أن تحتوي type و name و label.");
	const tagged = asRows(choicesSheet.map((line) => line.map(String))).map((row) => {
		const list = row.list_name || row.list || "";
		const name = row.name || "";
		const label = row.label || name;
		if (!list || !name) return null;
		return {
			name: `${list}::${name}`,
			label
		};
	}).filter((item) => item !== null);
	const questions = asRows(matrix.map((line) => line.map(String))).map((row, index) => questionFromRow(row, tagged, index)).filter((item) => item !== null);
	if (!questions.length) throw new Error("لم يُعثر على أسئلة مدعومة في ملف XLSForm.");
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return {
		id: base?.id || crypto.randomUUID(),
		title: settings?.form_title || base?.title || "نموذج مستورد",
		description: base?.description || "استُورد من XLSForm.",
		version: settings?.version || base?.version || "1",
		deployed: base?.deployed ?? false,
		questions,
		createdAt: base?.createdAt || now,
		updatedAt: now
	};
}
function surveyMatrix(form) {
	return [[
		"type",
		"name",
		"label",
		"hint",
		"required",
		"relevant",
		"constraint",
		"constraint_message",
		"choices"
	], ...form.questions.map((question) => {
		const list = `${question.name}_list`;
		const type = question.type === "select_one" || question.type === "select_multiple" ? `${question.type} ${list}` : question.type === "rating" ? "range" : question.type;
		const inline = question.type === "select_one" || question.type === "select_multiple" ? (question.choices ?? []).map((choice) => `${choice.name}:${choice.label}`).join("|") : "";
		return [
			type,
			question.name,
			question.label,
			question.hint ?? "",
			question.required ? "yes" : "",
			question.relevant ?? "",
			question.constraint ?? "",
			question.constraintMessage ?? "",
			inline
		];
	})];
}
async function formToXlsxBlob(form) {
	const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const survey = surveyMatrix(form).map((row) => row.slice(0, 8));
	const choices = [[
		"list_name",
		"name",
		"label"
	]];
	for (const question of form.questions) {
		if (question.type !== "select_one" && question.type !== "select_multiple") continue;
		for (const choice of question.choices ?? []) choices.push([
			`${question.name}_list`,
			choice.name,
			choice.label
		]);
	}
	const settings = [[
		"form_title",
		"form_id",
		"version"
	], [
		form.title,
		form.id,
		form.version || "1"
	]];
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(survey), "survey");
	XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(choices), "choices");
	XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(settings), "settings");
	const out = XLSX.write(workbook, {
		bookType: "xlsx",
		type: "array"
	});
	return new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
async function submissionsToXlsxBlob(form, rows) {
	const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const questions = form.questions.filter((question) => question.type !== "note");
	const header = [
		"_id",
		"_submitted_at",
		"_device",
		"_source",
		...questions.map((question) => question.name)
	];
	const body = rows.map((row) => [
		row.id,
		row.submittedAt,
		row.deviceLabel,
		row.source,
		...questions.map((question) => {
			const value = row.answers[question.name];
			if (value == null) return "";
			if (Array.isArray(value)) return value.join(" ");
			if (value === "__image__" || value.startsWith("data:")) return "yes";
			return value;
		})
	]);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([header, ...body]), "data");
	const out = XLSX.write(workbook, {
		bookType: "xlsx",
		type: "array"
	});
	return new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
//#endregion
export { formFromCsvText as a, submissionsFromCsv as c, surveyMatrix as d, toCsv as f, fileSlug as i, submissionsToCsv as l, downloadBlob as n, formFromXlsx as o, downloadText as r, formToXlsxBlob as s, copyText as t, submissionsToXlsxBlob as u };
