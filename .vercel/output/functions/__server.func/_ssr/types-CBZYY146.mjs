//#region node_modules/.nitro/vite/services/ssr/assets/types-CBZYY146.js
var QUESTION_TYPES = [
	"text",
	"integer",
	"decimal",
	"select_one",
	"select_multiple",
	"note",
	"date",
	"time",
	"geopoint",
	"image",
	"acknowledge",
	"rating"
];
var IMAGE_SENTINEL = "__image__";
function emptySnapshot() {
	return {
		forms: [],
		submissions: [],
		network: {
			port: 8080,
			addresses: []
		}
	};
}
//#endregion
export { QUESTION_TYPES as n, emptySnapshot as r, IMAGE_SENTINEL as t };
