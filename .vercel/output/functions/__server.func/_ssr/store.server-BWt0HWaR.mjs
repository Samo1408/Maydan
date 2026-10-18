import { t as IMAGE_SENTINEL } from "./types-CBZYY146.mjs";
import { a as validateAnswers } from "./logic-BZJETgf9.mjs";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
//#region node_modules/.nitro/vite/services/ssr/assets/store.server-BWt0HWaR.js
var filePath = path.join(process.cwd(), "data", "maydan-store.json");
var database = null;
var writeChain = Promise.resolve();
function ago(days, hours = 9) {
	const date = /* @__PURE__ */ new Date();
	date.setDate(date.getDate() - days);
	date.setHours(hours, 15, 0, 0);
	return date.toISOString();
}
function seed() {
	const form = {
		id: "frm-household",
		title: "مسح الأسر السريع",
		description: "نموذج تجريبي بأسلوب KoBo. الإجابات تبقى على هذا الجهاز، والهواتف على نفس الراوتر ترسل إلى هنا من غير إنترنت.",
		version: "1",
		deployed: true,
		createdAt: ago(12, 8),
		updatedAt: ago(1, 11),
		questions: [
			{
				id: "q-intro",
				type: "note",
				name: "intro",
				label: "مسح قصير للحي. لا يُرفع شيء إلى الإنترنت. أكمل الحقول الظاهرة فقط."
			},
			{
				id: "q-consent",
				type: "acknowledge",
				name: "consent",
				label: "أوافق على تسجيل هذه الإجابات على جهاز الفريق المحلي",
				required: true
			},
			{
				id: "q-name",
				type: "text",
				name: "respondent_name",
				label: "اسم المبحوث",
				hint: "الاسم المستخدم داخل الفريق فقط",
				required: true
			},
			{
				id: "q-size",
				type: "integer",
				name: "hh_size",
				label: "عدد أفراد الأسرة",
				required: true,
				constraint: ". >= 1 and . <= 30",
				constraintMessage: "العدد بين 1 و 30"
			},
			{
				id: "q-housing",
				type: "select_one",
				name: "housing_type",
				label: "نوع المسكن",
				required: true,
				choices: [
					{
						name: "apartment",
						label: "شقة"
					},
					{
						name: "house",
						label: "بيت مستقل"
					},
					{
						name: "tent",
						label: "خيمة / مأوى مؤقت"
					},
					{
						name: "collective",
						label: "سكن جماعي"
					}
				]
			},
			{
				id: "q-shelter",
				type: "text",
				name: "shelter_note",
				label: "صف المأوى المؤقت",
				hint: "يظهر فقط عند اختيار الخيمة",
				relevant: "${housing_type} = 'tent'"
			},
			{
				id: "q-services",
				type: "select_multiple",
				name: "services",
				label: "الخدمات المتوفرة اليوم",
				choices: [
					{
						name: "water",
						label: "مياه"
					},
					{
						name: "power",
						label: "كهرباء"
					},
					{
						name: "latrine",
						label: "مرحاض"
					},
					{
						name: "school",
						label: "مدرسة قريبة"
					}
				]
			},
			{
				id: "q-date",
				type: "date",
				name: "visit_date",
				label: "تاريخ الزيارة",
				required: true
			},
			{
				id: "q-water",
				type: "decimal",
				name: "water_liters",
				label: "تقدير المياه باللتر في اليوم",
				constraint: ". >= 0",
				constraintMessage: "لا يمكن أن تكون القيمة سالبة"
			},
			{
				id: "q-score",
				type: "rating",
				name: "access_score",
				label: "سهولة الوصول إلى المسكن",
				hint: "1 صعب جداً — 5 سهل",
				constraint: ". >= 1 and . <= 5"
			},
			{
				id: "q-geo",
				type: "geopoint",
				name: "location",
				label: "موقع الزيارة",
				hint: "يمكن تحديده من الجهاز أو كتابته يدوياً"
			},
			{
				id: "q-photo",
				type: "image",
				name: "facade_photo",
				label: "صورة الواجهة",
				hint: "اختياري. تُحفظ مضغوطة على هذا الخادم فقط"
			}
		]
	};
	const submissions = [
		[
			"هدى كريم",
			"5",
			"apartment",
			"water power school",
			"12",
			"4",
			"33.513200 36.276800 18",
			"فريق الشمال"
		],
		[
			"سامر نوفل",
			"3",
			"house",
			"water power latrine",
			"40",
			"5",
			"33.514100 36.291200 22",
			"فريق الشمال"
		],
		[
			"ليلى حداد",
			"7",
			"tent",
			"water",
			"8",
			"2",
			"33.508400 36.301500 30",
			"فريق الجنوب"
		],
		[
			"مازن عواد",
			"4",
			"collective",
			"power latrine",
			"15",
			"3",
			"33.520200 36.288100 25",
			"فريق الجنوب"
		],
		[
			"ريم صالح",
			"6",
			"apartment",
			"water power latrine school",
			"25",
			"4",
			"33.511800 36.270400 14",
			"مكتب"
		],
		[
			"فادي مرعي",
			"2",
			"tent",
			"latrine",
			"6",
			"1",
			"33.506600 36.305900 40",
			"فريق الجنوب"
		],
		[
			"نور الياس",
			"8",
			"house",
			"water power school",
			"55",
			"5",
			"33.517700 36.281600 16",
			"فريق الشمال"
		],
		[
			"جواد قاسم",
			"1",
			"apartment",
			"power",
			"10",
			"3",
			"33.509900 36.274200 20",
			"مكتب"
		]
	].map((person, index) => {
		const answers = {
			consent: "OK",
			respondent_name: person[0],
			hh_size: person[1],
			housing_type: person[2],
			services: person[3].split(" "),
			visit_date: ago(index % 5, 10).slice(0, 10),
			water_liters: person[4],
			access_score: person[5],
			location: person[6]
		};
		if (person[2] === "tent") answers.shelter_note = index % 2 === 0 ? "خيمة عائلية قرب الطريق الفرعي" : "مأوى بلاستيك يحتاج تثبيتاً";
		return {
			id: `sub-demo-${index + 1}`,
			formId: form.id,
			answers,
			submittedAt: ago(index % 5, 10 + index % 3),
			deviceLabel: person[7],
			source: person[7] === "مكتب" ? "desk" : "lan"
		};
	});
	return {
		forms: [form],
		submissions
	};
}
async function persist(next) {
	const payload = JSON.stringify(next);
	writeChain = writeChain.then(async () => {
		await mkdir(path.dirname(filePath), { recursive: true });
		await writeFile(filePath, payload, "utf8");
	});
	await writeChain;
}
async function load() {
	if (database) return database;
	try {
		const raw = await readFile(filePath, "utf8");
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed.forms) || !Array.isArray(parsed.submissions)) throw new Error("bad store");
		database = parsed;
	} catch (error) {
		if (!(error instanceof Error && "code" in error && error.code === "ENOENT") && database) return database;
		database = seed();
		try {
			await persist(database);
		} catch (writeError) {
			console.error("[maydan] local store is memory-only", writeError);
		}
	}
	return database;
}
function networkInfo() {
	const addresses = [];
	for (const [name, list] of Object.entries(os.networkInterfaces())) for (const item of list ?? []) {
		const family = String(item.family);
		if (item.internal || family !== "IPv4" && family !== "4") continue;
		addresses.push({
			name,
			address: item.address
		});
	}
	return {
		port: Number(process.env.PORT) || 8080,
		addresses
	};
}
function slim(submission) {
	const answers = {};
	for (const [key, value] of Object.entries(submission.answers)) answers[key] = typeof value === "string" && value.startsWith("data:") ? IMAGE_SENTINEL : value;
	return {
		...submission,
		answers
	};
}
function sorted(data) {
	return {
		forms: [...data.forms].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
		submissions: [...data.submissions].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
	};
}
async function snapshot() {
	const data = sorted(await load());
	return {
		forms: data.forms,
		submissions: data.submissions.map(slim),
		network: networkInfo()
	};
}
async function upsertForm(form) {
	const data = await load();
	const next = {
		...form,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const index = data.forms.findIndex((item) => item.id === next.id);
	if (index === -1) data.forms.unshift(next);
	else data.forms[index] = next;
	database = data;
	await persist(data);
	return snapshot();
}
async function removeForm(id) {
	const data = await load();
	data.forms = data.forms.filter((form) => form.id !== id);
	data.submissions = data.submissions.filter((submission) => submission.formId !== id);
	database = data;
	await persist(data);
	return snapshot();
}
async function insertSubmission(input) {
	const data = await load();
	if (data.submissions.some((item) => item.id === input.id)) return snapshot();
	const form = data.forms.find((item) => item.id === input.formId);
	if (!form) throw new Error("النموذج غير موجود");
	if (!form.deployed && input.source === "lan") throw new Error("النموذج غير منشور على الشبكة");
	const errors = validateAnswers(form, input.answers);
	const messages = Object.values(errors);
	if (messages.length) throw new Error(messages[0] ?? "الإجابة غير مكتملة");
	for (const value of Object.values(input.answers)) if (typeof value === "string" && value.length > 7e5) throw new Error("الصورة أكبر من الحد المسموح");
	data.submissions.unshift({
		id: input.id,
		formId: input.formId,
		answers: input.answers,
		deviceLabel: input.deviceLabel.trim().slice(0, 80) || "جهاز",
		source: input.source,
		submittedAt: input.submittedAt || (/* @__PURE__ */ new Date()).toISOString()
	});
	database = data;
	await persist(data);
	return snapshot();
}
async function removeSubmission(id) {
	const data = await load();
	data.submissions = data.submissions.filter((submission) => submission.id !== id);
	database = data;
	await persist(data);
	return snapshot();
}
async function importRows(formId, rows) {
	const data = await load();
	if (!data.forms.find((item) => item.id === formId)) throw new Error("النموذج غير موجود");
	for (const row of rows.slice(0, 500)) {
		if (data.submissions.some((item) => item.id === row.id)) continue;
		data.submissions.unshift({
			id: row.id,
			formId,
			answers: row.answers,
			deviceLabel: row.deviceLabel?.trim().slice(0, 80) || "استيراد",
			source: "desk",
			submittedAt: row.submittedAt || (/* @__PURE__ */ new Date()).toISOString()
		});
	}
	database = data;
	await persist(data);
	return snapshot();
}
async function readSubmission(id) {
	return (await load()).submissions.find((submission) => submission.id === id) ?? null;
}
//#endregion
export { importRows, insertSubmission, readSubmission, removeForm, removeSubmission, snapshot, upsertForm };
