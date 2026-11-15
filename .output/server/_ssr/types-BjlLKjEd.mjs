//#region node_modules/.nitro/vite/services/ssr/assets/types-BjlLKjEd.js
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
var DEFAULT_SCORE_BANDS = [
	{
		min: 0,
		label: "ضعيف"
	},
	{
		min: 4,
		label: "متوسط"
	},
	{
		min: 7,
		label: "جيد"
	},
	{
		min: 9,
		label: "ممتاز"
	}
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
export { emptySnapshot as i, IMAGE_SENTINEL as n, QUESTION_TYPES as r, DEFAULT_SCORE_BANDS as t };
