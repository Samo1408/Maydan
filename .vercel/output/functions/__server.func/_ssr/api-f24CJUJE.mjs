import { n as QUESTION_TYPES } from "./types-CBZYY146.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { c as string, l as union, n as array, o as object, r as boolean, s as record, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-f24CJUJE.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var choiceSchema = object({
	name: string().min(1).max(80),
	label: string().max(200)
});
var questionSchema = object({
	id: string().min(1).max(80),
	type: _enum(QUESTION_TYPES),
	name: string().min(1).max(80),
	label: string().max(500),
	hint: string().max(500).optional(),
	required: boolean().optional(),
	choices: array(choiceSchema).max(60).optional(),
	relevant: string().max(400).optional(),
	constraint: string().max(400).optional(),
	constraintMessage: string().max(300).optional()
});
var formSchema = object({
	id: string().min(1).max(80),
	title: string().max(180),
	description: string().max(1e3),
	version: string().max(40),
	deployed: boolean(),
	questions: array(questionSchema).max(150),
	createdAt: string().max(40),
	updatedAt: string().max(40)
});
var answerSchema = union([string().max(7e5), array(string().max(200)).max(40)]);
var submissionInput = object({
	id: string().min(1).max(80),
	formId: string().min(1).max(80),
	answers: record(string().max(80), answerSchema),
	deviceLabel: string().max(80),
	source: _enum(["desk", "lan"]),
	submittedAt: string().max(40).optional()
});
function parsed(schema, data) {
	const result = schema.safeParse(data);
	if (!result.success) throw new Error("البيانات المرسلة غير صالحة");
	return result.data;
}
var getSnapshot_createServerFn_handler = createServerRpc({
	id: "7a983f7f64f39ab37a67c44480462dcd75fd96aa43334ca9856d26fdb2885868",
	name: "getSnapshot",
	filename: "src/lib/maydan/api.ts"
}, (opts) => getSnapshot.__executeServer(opts));
var getSnapshot = createServerFn({ method: "GET" }).handler(getSnapshot_createServerFn_handler, async () => {
	return (await import("./store.server-BWt0HWaR.mjs")).snapshot();
});
var saveForm_createServerFn_handler = createServerRpc({
	id: "2741a6ba20a57d2bdf5446e15f0e01cfdfd274b1222387910e9baa26bc4a9b4a",
	name: "saveForm",
	filename: "src/lib/maydan/api.ts"
}, (opts) => saveForm.__executeServer(opts));
var saveForm = createServerFn({ method: "POST" }).validator((data) => parsed(formSchema, data)).handler(saveForm_createServerFn_handler, async ({ data }) => {
	return (await import("./store.server-BWt0HWaR.mjs")).upsertForm(data);
});
var deleteForm_createServerFn_handler = createServerRpc({
	id: "00a07d50926e82137748aa87508335b8e6ce226a7d18660b30dea28739667aff",
	name: "deleteForm",
	filename: "src/lib/maydan/api.ts"
}, (opts) => deleteForm.__executeServer(opts));
var deleteForm = createServerFn({ method: "POST" }).validator((data) => parsed(object({ id: string().min(1).max(80) }), data)).handler(deleteForm_createServerFn_handler, async ({ data }) => {
	return (await import("./store.server-BWt0HWaR.mjs")).removeForm(data.id);
});
var addSubmission_createServerFn_handler = createServerRpc({
	id: "6245835115af68d4b3b523c539128c8393e566a4a973bb74269fbca380b0cd8d",
	name: "addSubmission",
	filename: "src/lib/maydan/api.ts"
}, (opts) => addSubmission.__executeServer(opts));
var addSubmission = createServerFn({ method: "POST" }).validator((data) => parsed(submissionInput, data)).handler(addSubmission_createServerFn_handler, async ({ data }) => {
	return (await import("./store.server-BWt0HWaR.mjs")).insertSubmission(data);
});
var deleteSubmission_createServerFn_handler = createServerRpc({
	id: "0d574c555ef2a7ca2344aec1dbc8525d5be898e1fdd38187e48b4c877ac13a14",
	name: "deleteSubmission",
	filename: "src/lib/maydan/api.ts"
}, (opts) => deleteSubmission.__executeServer(opts));
var deleteSubmission = createServerFn({ method: "POST" }).validator((data) => parsed(object({ id: string().min(1).max(80) }), data)).handler(deleteSubmission_createServerFn_handler, async ({ data }) => {
	return (await import("./store.server-BWt0HWaR.mjs")).removeSubmission(data.id);
});
var importSubmissions_createServerFn_handler = createServerRpc({
	id: "94efd03bf1c95ea6ca4db3ac587170a4e9e740fa7736ff04c58582afeeee6f1b",
	name: "importSubmissions",
	filename: "src/lib/maydan/api.ts"
}, (opts) => importSubmissions.__executeServer(opts));
var importSubmissions = createServerFn({ method: "POST" }).validator((data) => parsed(object({
	formId: string().min(1).max(80),
	rows: array(object({
		id: string().min(1).max(80),
		answers: record(string().max(80), answerSchema),
		deviceLabel: string().max(80).optional(),
		submittedAt: string().max(40).optional()
	})).max(500)
}), data)).handler(importSubmissions_createServerFn_handler, async ({ data }) => {
	return (await import("./store.server-BWt0HWaR.mjs")).importRows(data.formId, data.rows);
});
var getSubmission_createServerFn_handler = createServerRpc({
	id: "9e5eb2eadba2f7ae59121dc3b979d27d94092a931fe0fdb2a8eb73e26e26d01f",
	name: "getSubmission",
	filename: "src/lib/maydan/api.ts"
}, (opts) => getSubmission.__executeServer(opts));
var getSubmission = createServerFn({ method: "POST" }).validator((data) => parsed(object({ id: string().min(1).max(80) }), data)).handler(getSubmission_createServerFn_handler, async ({ data }) => {
	return { submission: await (await import("./store.server-BWt0HWaR.mjs")).readSubmission(data.id) };
});
//#endregion
export { addSubmission_createServerFn_handler, deleteForm_createServerFn_handler, deleteSubmission_createServerFn_handler, getSnapshot_createServerFn_handler, getSubmission_createServerFn_handler, importSubmissions_createServerFn_handler, saveForm_createServerFn_handler };
