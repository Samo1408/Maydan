globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as serve, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, s as NodeResponse, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { c as string, l as union, n as array, o as object, s as record, t as _enum } from "./_libs/zod.mjs";
import { existsSync, promises, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path, { dirname, join, resolve } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"11d-8NtLlMAF5Fmnj0wxdJqRaueDTlQ\"",
		"mtime": "2026-11-02T19:04:21.356Z",
		"size": 285,
		"path": "../public/favicon.svg"
	},
	"/og.jpg": {
		"type": "image/jpeg",
		"etag": "\"1acb4-1UILvKj1YfTNRisKmyDAtJXdSbQ\"",
		"mtime": "2026-11-02T19:04:21.356Z",
		"size": 109748,
		"path": "../public/og.jpg"
	},
	"/__grok/icon-180.png": {
		"type": "image/png",
		"etag": "\"834-Xk8vfS0DTFn7ggtkfEduWTcNWGE\"",
		"mtime": "2026-11-02T19:04:21.356Z",
		"size": 2100,
		"path": "../public/__grok/icon-180.png"
	},
	"/assets/_formId-BSo645Lr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a0f-/h6rVGHH4ZXmV2wIoeFyuRTbLcU\"",
		"mtime": "2026-11-02T19:04:20.836Z",
		"size": 2575,
		"path": "../public/assets/_formId-BSo645Lr.js"
	},
	"/assets/_formId-BjejfhWV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"44c9-8QR0cxuj9BiI8YgC6IkY/muRnDM\"",
		"mtime": "2026-11-02T19:04:20.836Z",
		"size": 17609,
		"path": "../public/assets/_formId-BjejfhWV.js"
	},
	"/assets/browser-CCrYwriZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5bb3-vQobgbK0M3mwnxRN6otWRMBezxc\"",
		"mtime": "2026-11-02T19:04:20.836Z",
		"size": 23475,
		"path": "../public/assets/browser-CCrYwriZ.js"
	},
	"/assets/c-D_qWeuUX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"575-2LeHgmjqJoFZ5BhUycCknvIMby0\"",
		"mtime": "2026-11-02T19:04:20.836Z",
		"size": 1397,
		"path": "../public/assets/c-D_qWeuUX.js"
	},
	"/assets/context-DZAHYMiB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16b14-MmB6UzjwRAmrB843NIm2ocMjZfA\"",
		"mtime": "2026-11-02T19:04:20.836Z",
		"size": 92948,
		"path": "../public/assets/context-DZAHYMiB.js"
	},
	"/assets/clsx-DB0hHKMi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"171-ECuaYbqpb4owKgP3JEL6PnaLhH4\"",
		"mtime": "2026-11-02T19:04:20.836Z",
		"size": 369,
		"path": "../public/assets/clsx-DB0hHKMi.js"
	},
	"/assets/data-DnyFdWFl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22de-lqnC5aFR8qOvrXVpY3LKgIcwWiU\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 8926,
		"path": "../public/assets/data-DnyFdWFl.js"
	},
	"/assets/download-Chf7HelJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"104-dJJUUo4NMP/4CzDLzHY72oiDp3Q\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 260,
		"path": "../public/assets/download-Chf7HelJ.js"
	},
	"/assets/es6-DMCjxFge.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"799d0-c1aI63YkYyx74un874dPQOShKdc\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 498128,
		"path": "../public/assets/es6-DMCjxFge.js"
	},
	"/assets/format-DcTrQUi4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f8-teseaVXdDaKysUzcbuSGmQkypyI\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 504,
		"path": "../public/assets/format-DcTrQUi4.js"
	},
	"/assets/fraunces-latin-600-normal-BFCDtZfi.woff2": {
		"type": "font/woff2",
		"etag": "\"46b0-EWgqBVTgOYn/fs440RNypoA1Eo0\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 18096,
		"path": "../public/assets/fraunces-latin-600-normal-BFCDtZfi.woff2"
	},
	"/assets/fraunces-latin-600-normal-DL5QCzvS.woff": {
		"type": "font/woff",
		"etag": "\"57f0-pCvVnfagOy195pE6aXIOqixoqlo\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 22512,
		"path": "../public/assets/fraunces-latin-600-normal-DL5QCzvS.woff"
	},
	"/assets/fraunces-latin-ext-600-normal-B0Dy4lqi.woff": {
		"type": "font/woff",
		"etag": "\"575c-0mtw4Si/GjTdDQmdm45+Wp3d/Rs\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 22364,
		"path": "../public/assets/fraunces-latin-ext-600-normal-B0Dy4lqi.woff"
	},
	"/assets/fraunces-latin-ext-600-normal-BtzmzP0X.woff2": {
		"type": "font/woff2",
		"etag": "\"43b8-mb2setCD6mGb34gXAtSmmu4YBck\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 17336,
		"path": "../public/assets/fraunces-latin-ext-600-normal-BtzmzP0X.woff2"
	},
	"/assets/fraunces-vietnamese-600-normal-BjlAJixd.woff2": {
		"type": "font/woff2",
		"etag": "\"188c-szonOWk7UwGVWV1mW/2Xf2mx21w\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 6284,
		"path": "../public/assets/fraunces-vietnamese-600-normal-BjlAJixd.woff2"
	},
	"/assets/fraunces-vietnamese-600-normal-DlAl5EAR.woff": {
		"type": "font/woff",
		"etag": "\"1efc-Xea8ESjh61gztYWoOPHCkJUb9Dc\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 7932,
		"path": "../public/assets/fraunces-vietnamese-600-normal-DlAl5EAR.woff"
	},
	"/assets/ibm-plex-sans-arabic-arabic-400-normal-CyU-ddYS.woff2": {
		"type": "font/woff2",
		"etag": "\"a760-qc79yuVGdiEf5CknV05MAToa9Tg\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 42848,
		"path": "../public/assets/ibm-plex-sans-arabic-arabic-400-normal-CyU-ddYS.woff2"
	},
	"/assets/ibm-plex-sans-arabic-arabic-400-normal-EA1o-u_Q.woff": {
		"type": "font/woff",
		"etag": "\"ac68-PYHeOt9kVOx1Z39lMxFLxgTp+sI\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 44136,
		"path": "../public/assets/ibm-plex-sans-arabic-arabic-400-normal-EA1o-u_Q.woff"
	},
	"/assets/ibm-plex-sans-arabic-arabic-500-normal-C4MQITzh.woff2": {
		"type": "font/woff2",
		"etag": "\"b0f0-McuXkrH5gUmNoh1sPeVnFCxrKh4\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 45296,
		"path": "../public/assets/ibm-plex-sans-arabic-arabic-500-normal-C4MQITzh.woff2"
	},
	"/assets/ibm-plex-sans-arabic-arabic-500-normal-DPXcppbm.woff": {
		"type": "font/woff",
		"etag": "\"b74c-b2T4FOWCziKDmZakhZwBObvTodk\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 46924,
		"path": "../public/assets/ibm-plex-sans-arabic-arabic-500-normal-DPXcppbm.woff"
	},
	"/assets/ibm-plex-sans-arabic-arabic-600-normal-0pRdybE_.woff2": {
		"type": "font/woff2",
		"etag": "\"b278-nlwBnY1umsuT9p502f9asPtJlE8\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 45688,
		"path": "../public/assets/ibm-plex-sans-arabic-arabic-600-normal-0pRdybE_.woff2"
	},
	"/assets/ibm-plex-sans-arabic-arabic-600-normal-MJZ0liF5.woff": {
		"type": "font/woff",
		"etag": "\"b6bc-e/VJmHrEK/fsBU6l5aycmAC8jqU\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 46780,
		"path": "../public/assets/ibm-plex-sans-arabic-arabic-600-normal-MJZ0liF5.woff"
	},
	"/assets/ibm-plex-sans-arabic-arabic-700-normal-9rXc6cUL.woff": {
		"type": "font/woff",
		"etag": "\"ad4c-BTFP9si7fMNFn9NpJBpsAamVIwI\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 44364,
		"path": "../public/assets/ibm-plex-sans-arabic-arabic-700-normal-9rXc6cUL.woff"
	},
	"/assets/ibm-plex-sans-arabic-arabic-700-normal-DrtBj6UE.woff2": {
		"type": "font/woff2",
		"etag": "\"acf8-J3ZduvJP84++aWrMS7GDuwKRAmQ\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 44280,
		"path": "../public/assets/ibm-plex-sans-arabic-arabic-700-normal-DrtBj6UE.woff2"
	},
	"/assets/ibm-plex-sans-arabic-latin-400-normal-Bo5KPYvw.woff2": {
		"type": "font/woff2",
		"etag": "\"4adc-ZTv9UkqkZ0Iy6FoVrNLpFKnzML0\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 19164,
		"path": "../public/assets/ibm-plex-sans-arabic-latin-400-normal-Bo5KPYvw.woff2"
	},
	"/assets/ibm-plex-sans-arabic-latin-400-normal-CFZh1unN.woff": {
		"type": "font/woff",
		"etag": "\"4468-mGe3NIa6smkGyhEpubI5OMj50vU\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 17512,
		"path": "../public/assets/ibm-plex-sans-arabic-latin-400-normal-CFZh1unN.woff"
	},
	"/assets/ibm-plex-sans-arabic-latin-500-normal-BletK1Hp.woff": {
		"type": "font/woff",
		"etag": "\"48d0-X6g35MHacnjWdY6Dcgd2vCdOodg\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 18640,
		"path": "../public/assets/ibm-plex-sans-arabic-latin-500-normal-BletK1Hp.woff"
	},
	"/assets/ibm-plex-sans-arabic-latin-500-normal-Cd6jVIg7.woff2": {
		"type": "font/woff2",
		"etag": "\"4e78-xVtLG1tdV9LCkcbiPLI3DaUUItw\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 20088,
		"path": "../public/assets/ibm-plex-sans-arabic-latin-500-normal-Cd6jVIg7.woff2"
	},
	"/assets/ibm-plex-sans-arabic-latin-600-normal-Dk5eISD_.woff": {
		"type": "font/woff",
		"etag": "\"49c0-Fd9gW4muKT9MZ5Di8R57SXDw4gc\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 18880,
		"path": "../public/assets/ibm-plex-sans-arabic-latin-600-normal-Dk5eISD_.woff"
	},
	"/assets/ibm-plex-sans-arabic-latin-600-normal-KrqB56Mw.woff2": {
		"type": "font/woff2",
		"etag": "\"5014-7hYPU7/oWFJwrc3pxoZAVGdfSFY\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 20500,
		"path": "../public/assets/ibm-plex-sans-arabic-latin-600-normal-KrqB56Mw.woff2"
	},
	"/assets/ibm-plex-sans-arabic-latin-700-normal-BzSf6GNr.woff2": {
		"type": "font/woff2",
		"etag": "\"4c30-ngAuZW/4ut4LpubA3GtybeHZAYI\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 19504,
		"path": "../public/assets/ibm-plex-sans-arabic-latin-700-normal-BzSf6GNr.woff2"
	},
	"/assets/ibm-plex-sans-arabic-latin-700-normal-Cl4F7CZR.woff": {
		"type": "font/woff",
		"etag": "\"4574-9nSMZTmdDSFfA8X+xU6yZODMimw\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 17780,
		"path": "../public/assets/ibm-plex-sans-arabic-latin-700-normal-Cl4F7CZR.woff"
	},
	"/assets/index-D1CJcymr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b06f-6icf2t3DhUvVvVE9xZ3tkQkuBZk\"",
		"mtime": "2026-11-02T19:04:20.836Z",
		"size": 372847,
		"path": "../public/assets/index-D1CJcymr.js"
	},
	"/assets/lazyRouteComponent-LFy4JQzM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fce-dRieaugmHKV6Uqu5t7GXKyY+dMw\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 4046,
		"path": "../public/assets/lazyRouteComponent-LFy4JQzM.js"
	},
	"/assets/plus-BZfh18Qd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-YlU33u9we9sa57G375QuPFN5yuo\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 151,
		"path": "../public/assets/plus-BZfh18Qd.js"
	},
	"/assets/preload-helper-BGPLMnZq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"773f-Dbfv0q2yvbjViQ297w6dZBltSEM\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 30527,
		"path": "../public/assets/preload-helper-BGPLMnZq.js"
	},
	"/assets/react-Cvdyeg_0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ec4-eLtM6efiNX+LTEtDjgNa6adlfSE\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 7876,
		"path": "../public/assets/react-Cvdyeg_0.js"
	},
	"/assets/rolldown-runtime-hePW80VL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-fA8td6k29UVF6JoPfhOPkceTK1M\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 716,
		"path": "../public/assets/rolldown-runtime-hePW80VL.js"
	},
	"/assets/routes-DPsr5rUN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29cc-boSPTa2EDTXF5Mk6p5Db8rKYP0Y\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 10700,
		"path": "../public/assets/routes-DPsr5rUN.js"
	},
	"/assets/runner-DNC75WzY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"257e-3iXj2A+pkiOIcWR0QXxM0+aMGxk\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 9598,
		"path": "../public/assets/runner-DNC75WzY.js"
	},
	"/assets/styles-73EbORcT.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"8078-ii8RZ66/HSS+pmQ4NzLVJBnjUMM\"",
		"mtime": "2026-11-02T19:04:20.844Z",
		"size": 32888,
		"path": "../public/assets/styles-73EbORcT.css"
	},
	"/assets/ui-CxRMHST4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f65-tHQQx5KGLn8cWVImK3FcFwJi82U\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 8037,
		"path": "../public/assets/ui-CxRMHST4.js"
	},
	"/assets/xlsform-60y11sHZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2582-EJYsv9hhlzRQlFq3L5nS78O6Aso\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 9602,
		"path": "../public/assets/xlsform-60y11sHZ.js"
	},
	"/assets/xlsx-t2wy1lCT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67757-+Pa+oo2su53+3eOlDkQD6Gc8q54\"",
		"mtime": "2026-11-02T19:04:20.840Z",
		"size": 423767,
		"path": "../public/assets/xlsx-t2wy1lCT.js"
	},
	"/__grok/install/styles.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1a3d-VUsWOMAheo1/P30EqU5qaIkyvIQ\"",
		"mtime": "2026-11-02T19:04:21.356Z",
		"size": 6717,
		"path": "../public/__grok/install/styles.css"
	},
	"/__grok/install/assets/homescreen/glass-puzzle.svg": {
		"type": "image/svg+xml",
		"etag": "\"713-AP2wG8KChAGjse1Fn+f/+vDN+sQ\"",
		"mtime": "2026-11-02T19:04:21.356Z",
		"size": 1811,
		"path": "../public/__grok/install/assets/homescreen/glass-puzzle.svg"
	},
	"/__grok/install/assets/homescreen/glass-share.svg": {
		"type": "image/svg+xml",
		"etag": "\"954-jb3ATcKjqgMOYrA/4w1v21j0Jvg\"",
		"mtime": "2026-11-02T19:04:21.356Z",
		"size": 2388,
		"path": "../public/__grok/install/assets/homescreen/glass-share.svg"
	},
	"/__grok/install/assets/homescreen/logo-grok.svg": {
		"type": "image/svg+xml",
		"etag": "\"423-5mXO+yh9KW40jM3to5JlWPhxNK8\"",
		"mtime": "2026-11-02T19:04:21.356Z",
		"size": 1059,
		"path": "../public/__grok/install/assets/homescreen/logo-grok.svg"
	},
	"/__grok/install/assets/homescreen/ob-ipad.png": {
		"type": "image/png",
		"etag": "\"18dd3-wlRwrpmBImStuiu+4poVz7ANin4\"",
		"mtime": "2026-11-02T19:04:21.356Z",
		"size": 101843,
		"path": "../public/__grok/install/assets/homescreen/ob-ipad.png"
	},
	"/__grok/install/assets/homescreen/ob-phone.png": {
		"type": "image/png",
		"etag": "\"194bc-oZradWHIHO68q2glHU0Gk5ttpWA\"",
		"mtime": "2026-11-02T19:04:21.356Z",
		"size": 103612,
		"path": "../public/__grok/install/assets/homescreen/ob-phone.png"
	},
	"/__grok/install/assets/homescreen/plus.svg": {
		"type": "image/svg+xml",
		"etag": "\"961-sSBPunx/13vbMNAlPxb7UeO3l3A\"",
		"mtime": "2026-11-02T19:04:21.356Z",
		"size": 2401,
		"path": "../public/__grok/install/assets/homescreen/plus.svg"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region src/lib/maydan/collect.ts
var answerSchema = union([string().max(7e5), array(string().max(200)).max(40)]);
var collectBodySchema = object({
	id: string().min(1).max(80),
	formId: string().min(1).max(80),
	answers: record(string().max(80), answerSchema),
	deviceLabel: string().max(80),
	source: _enum(["desk", "lan"]),
	submittedAt: string().max(40).optional(),
	categoryId: string().max(80).optional()
});
//#endregion
//#region src/lib/maydan/types.ts
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
//#endregion
//#region src/lib/maydan/logic.ts
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
function questionsInScope(form, categoryId) {
	if (!categoryId || !form.categories?.length) return form.questions;
	return form.questions.filter((question) => !question.categoryId || question.categoryId === categoryId);
}
function validateAnswers(form, answers, categoryId) {
	const errors = {};
	for (const question of questionsInScope(form, categoryId)) {
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
//#endregion
//#region src/lib/maydan/store.server.ts
var filePath = path.join(process.cwd(), "data", "maydan-store.json");
var database = null;
var writeChain = Promise.resolve();
var HOUSEHOLD_CATEGORIES = [
	{
		id: "cat-family",
		label: "أ · الأسرة",
		description: "الموافقة، عدد الأفراد، ونوع المسكن."
	},
	{
		id: "cat-services",
		label: "ب · الخدمات",
		description: "المياه والخدمات المتوفرة اليوم."
	},
	{
		id: "cat-visit",
		label: "ج · الزيارة",
		description: "تاريخ الزيارة، الوصول، والموقع."
	}
];
var HOUSEHOLD_QUESTION_META = {
	consent: { categoryId: "cat-family" },
	respondent_name: { categoryId: "cat-family" },
	hh_size: {
		categoryId: "cat-family",
		scoreExpected: "5",
		scoreTolerance: 5
	},
	housing_type: {
		categoryId: "cat-family",
		choicePoints: {
			apartment: 8,
			house: 10,
			tent: 2,
			collective: 5
		}
	},
	shelter_note: { categoryId: "cat-family" },
	services: {
		categoryId: "cat-services",
		choicePoints: {
			water: 10,
			power: 8,
			latrine: 7,
			school: 6
		}
	},
	water_liters: {
		categoryId: "cat-services",
		scoreExpected: "20",
		scoreTolerance: 20
	},
	visit_date: { categoryId: "cat-visit" },
	access_score: {
		categoryId: "cat-visit",
		scoreExpected: "5",
		scoreTolerance: 4
	},
	location: { categoryId: "cat-visit" },
	facade_photo: { categoryId: "cat-visit" }
};
function applyHouseholdDemo(form) {
	return {
		...form,
		categories: HOUSEHOLD_CATEGORIES.map((item) => ({ ...item })),
		scoreBands: DEFAULT_SCORE_BANDS.map((item) => ({ ...item })),
		questions: form.questions.map((question) => {
			const extra = HOUSEHOLD_QUESTION_META[question.name];
			return extra ? {
				...question,
				...extra
			} : question;
		})
	};
}
function ago(days, hours = 9) {
	const date = /* @__PURE__ */ new Date();
	date.setDate(date.getDate() - days);
	date.setHours(hours, 15, 0, 0);
	return date.toISOString();
}
function seed() {
	const form = applyHouseholdDemo({
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
	});
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
function upgrade(data) {
	const form = data.forms.find((item) => item.id === "frm-household");
	if (!form || form.categories?.length) return false;
	const next = applyHouseholdDemo(form);
	form.categories = next.categories;
	form.scoreBands = next.scoreBands;
	form.questions = next.questions;
	return true;
}
async function load() {
	if (database) return database;
	try {
		const raw = await readFile(filePath, "utf8");
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed.forms) || !Array.isArray(parsed.submissions)) throw new Error("bad store");
		const changed = upgrade(parsed);
		database = parsed;
		if (changed) await persist(parsed);
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
async function insertSubmission(input) {
	const data = await load();
	if (data.submissions.some((item) => item.id === input.id)) return snapshot();
	const form = data.forms.find((item) => item.id === input.formId);
	if (!form) throw new Error("النموذج غير موجود");
	if (!form.deployed && input.source === "lan") throw new Error("النموذج غير منشور على الشبكة");
	if (input.categoryId && !form.categories?.some((category) => category.id === input.categoryId)) throw new Error("الفئة غير موجودة في هذا النموذج");
	const errors = validateAnswers(form, input.answers, input.categoryId);
	const messages = Object.values(errors);
	if (messages.length) throw new Error(messages[0] ?? "الإجابة غير مكتملة");
	for (const value of Object.values(input.answers)) if (typeof value === "string" && value.length > 7e5) throw new Error("الصورة أكبر من الحد المسموح");
	data.submissions.unshift({
		id: input.id,
		formId: input.formId,
		answers: input.answers,
		deviceLabel: input.deviceLabel.trim().slice(0, 80) || "جهاز",
		source: input.source,
		submittedAt: input.submittedAt || (/* @__PURE__ */ new Date()).toISOString(),
		categoryId: input.categoryId
	});
	database = data;
	await persist(data);
	return snapshot();
}
//#endregion
//#region server/middleware/collect.ts
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store"
		}
	});
}
/** Plain JSON intake. Phones on the LAN do not use the server-function channel. */
async function collectMiddleware(event, next) {
	if (String(event.req?.method ?? "GET").toUpperCase() !== "POST" || event.url?.pathname !== "/api/collect") return next();
	try {
		const raw = typeof event.req?.json === "function" ? await event.req.json() : null;
		const parsed = collectBodySchema.safeParse(raw);
		if (!parsed.success) return json({
			ok: false,
			message: "البيانات المرسلة غير صالحة"
		}, 400);
		await insertSubmission(parsed.data);
		console.log(`MAYDAN saved ${parsed.data.id} form=${parsed.data.formId} source=${parsed.data.source}`);
		return json({ ok: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : "تعذّر حفظ الإجابة";
		console.error(`MAYDAN save failed: ${message}`);
		return json({
			ok: false,
			message
		}, 400);
	}
}
//#endregion
//#region scripts/install-page.html?raw
var install_page_default = "<!DOCTYPE html>\n<html lang=\"en\" class=\"device-desktop\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1, viewport-fit=cover\"\n    />\n    <meta name=\"color-scheme\" content=\"dark\" />\n    <meta name=\"theme-color\" content=\"#000000\" />\n    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\" />\n    <meta name=\"apple-mobile-web-app-title\" content=\"{{APP_NAME}}\" />\n    <title>Add {{APP_NAME}} to your Home Screen</title>\n    <link rel=\"manifest\" href=\"/__grok/manifest.webmanifest\" />\n    <link rel=\"apple-touch-icon\" href=\"/__grok/icon-180.png\" />\n    <link rel=\"stylesheet\" href=\"/__grok/install/styles.css\" />\n    <script>\n      (function () {\n        var ua = navigator.userAgent || \"\";\n        var touch = navigator.maxTouchPoints || 0;\n        var isiPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && touch > 1);\n        var isiPhone = /iPhone|iPod/.test(ua);\n        var isIOS = isiPhone || isiPad;\n        var isAndroid = /Android/i.test(ua);\n        var isAndroidPhone = isAndroid && /Mobile/i.test(ua);\n        var isAndroidTablet = isAndroid && !/Mobile/i.test(ua);\n        var minSide = Math.min(screen.width || 0, screen.height || 0);\n        var maxSide = Math.max(screen.width || 0, screen.height || 0);\n\n        var type = \"desktop\";\n        if (isiPhone) type = \"phone\";\n        else if (isiPad || isAndroidTablet) type = \"tablet\";\n        else if (isAndroidPhone) type = \"phone\";\n        else if (touch > 0 && minSide > 0 && minSide <= 500) type = \"phone\";\n        else if (touch > 0 && minSide > 500 && maxSide <= 1400) type = \"tablet\";\n\n        var iosMajor = null;\n        var osToken = null;\n        var safariToken = null;\n        var iphoneOs = ua.match(/iPhone OS (\\d+)[._]/);\n        var ipadOs = ua.match(/CPU OS (\\d+)[._](\\d+) like Mac OS X/);\n        var safariVer = ua.match(/Version\\/(\\d+)[._]/);\n        if (iphoneOs) osToken = parseInt(iphoneOs[1], 10);\n        else if (ipadOs) osToken = parseInt(ipadOs[1], 10);\n        if (isIOS && safariVer) safariToken = parseInt(safariVer[1], 10);\n        if (osToken != null || safariToken != null) {\n          iosMajor = Math.max(osToken || 0, safariToken || 0);\n        }\n\n        var root = document.documentElement;\n        var classes = [\"device-\" + type];\n        if (iosMajor != null) {\n          root.dataset.ios = String(iosMajor);\n          classes.push(iosMajor >= 27 ? \"ios-27-plus\" : \"ios-below-27\");\n        }\n        root.className = classes.join(\" \");\n      })();\n    <\/script>\n  </head>\n  <body>\n    <div class=\"page\">\n      <header class=\"powered\" aria-label=\"Powered by Grok\">\n        <span class=\"powered-by\">Powered by</span>\n        <span class=\"powered-brand\">\n          <img\n            class=\"grok-logo\"\n            src=\"/__grok/install/assets/homescreen/logo-grok.svg\"\n            width=\"14\"\n            height=\"14\"\n            alt=\"\"\n          />\n          <span class=\"powered-grok\">Grok</span>\n        </span>\n      </header>\n\n      <main class=\"content\">\n        <div class=\"ob\" aria-hidden=\"true\">\n          <img\n            class=\"ob-img ob-phone\"\n            src=\"/__grok/install/assets/homescreen/ob-phone.png\"\n            width=\"338\"\n            height=\"294\"\n            alt=\"\"\n          />\n          <img\n            class=\"ob-img ob-ipad\"\n            src=\"/__grok/install/assets/homescreen/ob-ipad.png\"\n            width=\"634\"\n            height=\"294\"\n            alt=\"\"\n          />\n        </div>\n\n        <section class=\"copy\">\n          <h1>Add {{APP_NAME}} to your&nbsp;Home&nbsp;Screen</h1>\n\n          <div class=\"steps\">\n            <p class=\"step step-tap step-ios27\">\n              <span class=\"muted\">Tap</span>\n              <span class=\"glass glass--icon\" aria-hidden=\"true\">\n                <img src=\"/__grok/install/assets/homescreen/glass-puzzle.svg\" width=\"24\" height=\"24\" alt=\"\" />\n              </span>\n              <span class=\"muted loc loc-phone\">in the bottom bar, then</span>\n              <span class=\"muted loc loc-ipad\">in the tool bar, then</span>\n              <span class=\"glass glass--icon\" aria-hidden=\"true\">\n                <img src=\"/__grok/install/assets/homescreen/glass-share.svg\" width=\"24\" height=\"24\" alt=\"\" />\n              </span>\n            </p>\n\n            <p class=\"step step-tap step-ios-legacy\">\n              <span class=\"muted\">Tap</span>\n              <span class=\"glass glass--icon\" aria-hidden=\"true\">\n                <img src=\"/__grok/install/assets/homescreen/glass-share.svg\" width=\"24\" height=\"24\" alt=\"\" />\n              </span>\n              <span class=\"muted loc loc-phone\">in the bottom bar</span>\n              <span class=\"muted loc loc-ipad\">in the tool bar</span>\n            </p>\n\n            <p class=\"step step-select\">\n              <span class=\"muted\">Select</span>\n              <span class=\"add-label\">\n                <img\n                  class=\"plus-icon\"\n                  src=\"/__grok/install/assets/homescreen/plus.svg\"\n                  width=\"16\"\n                  height=\"16\"\n                  alt=\"\"\n                />\n                <span class=\"add-text\">Add to Home Screen</span>\n              </span>\n            </p>\n          </div>\n        </section>\n      </main>\n\n      <main class=\"content content-desktop\">\n        <section class=\"copy\">\n          <h1>Open this link on your iPhone&nbsp;or&nbsp;iPad</h1>\n          <p class=\"desktop-note\">\n            This page shows how to add {{APP_NAME}} to an iOS Home Screen.\n          </p>\n          <a class=\"desktop-open\" href=\"{{APP_URL}}\">Open {{APP_NAME}}</a>\n        </section>\n      </main>\n    </div>\n  </body>\n</html>\n";
//#endregion
//#region \0virtual:grok-og-identity
var grokOgIdentity = { "site": {
	"title": "ميدان",
	"card": "custom",
	"description": "Offline local-network data collection",
	"image": "/og.jpg"
} };
//#endregion
//#region scripts/grok-pwa-shared.mjs
/**
* Single source of truth for platform head chrome (PWA, extensions.js, OG),
* shared by the Vite plugin and Nitro middleware. Plain ESM so `node --test`
* and the Nitro bundler can both consume it.
*/
var DEFAULT_APP_NAME = "Grok App";
var OG_SITE_REL_PATH = "src/lib/og/site.json";
var SHARE_META_KEYS = /* @__PURE__ */ new Set([
	"og:title",
	"og:description",
	"og:image",
	"og:image:width",
	"og:image:height",
	"og:type",
	"og:url",
	"og:site_name",
	"twitter:card",
	"twitter:title",
	"twitter:image",
	"twitter:description",
	"x:game:image",
	"x:game:image:width",
	"x:game:image:height"
]);
function escapeHtml(value) {
	return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
/** Inverse of escapeHtml. Decode &amp; last so a single pass undoes one encode. */
function unescapeHtml(value) {
	return String(value).replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", "\"").replaceAll("&#39;", "'").replaceAll("&amp;", "&");
}
/** 6-digit hex for the og.grok.me placeholder, or "" if site.color is missing/invalid. */
function placeholderCardColor(site = {}) {
	const raw = String(site.color ?? "").trim();
	const hex = raw.startsWith("#") ? raw.slice(1) : raw;
	return /^[0-9a-fA-F]{6}$/.test(hex) ? hex : "";
}
/**
* "wild-race.grok.me" → "Wild Race". Only published app hosts encode the
* display name in the first label. Preview / guest hosts are image origins
* only — slugifying them produced internal names like "Hds Abc 3000 Xy".
*/
function appNameFromHost(hostHeader) {
	const host = String(hostHeader ?? "").split(",")[0].trim().split(":")[0].toLowerCase();
	if (!host.endsWith(".grok.me")) return DEFAULT_APP_NAME;
	const slug = host.split(".")[0] ?? "";
	if (!slug || slug === "www" || !/^[a-z0-9-]{1,63}$/.test(slug)) return DEFAULT_APP_NAME;
	return slug.split("-").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") || "Grok App";
}
/** True for Vercel system domains. Envoy rewrites origin Host to these; they SSO-protect `/og.jpg`. */
function isVercelSystemHost(host) {
	return host === "vercel.app" || host.endsWith(".vercel.app") || host === "vercel.com" || host.endsWith(".vercel.com");
}
/** Hostname suitable for absolute og:image URLs. Preview guests (X-Forwarded-Host) are allowed. */
function publicAppHost(hostHeader) {
	const host = String(hostHeader ?? "").split(",")[0].trim().split(":")[0].toLowerCase();
	if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
	if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
	if (isVercelSystemHost(host)) return "";
	return host;
}
/**
* Published apps always use `VITE_PUBLIC_HOSTNAME` (the grok.me host the
* deployer injects). Live preview has no such env, so fall back to the
* request host / X-Forwarded-Host. Never prefer request Host on a published
* app — Envoy rewrites it to `*.vercel.app`.
*/
function resolvePublicHost(hostHeader) {
	return publicAppHost(process.env?.VITE_PUBLIC_HOSTNAME) || publicAppHost(hostHeader);
}
function isInstallQuery(url) {
	const query = String(url ?? "").split("?", 2)[1] ?? "";
	const params = new URLSearchParams(query);
	const install = params.get("install");
	const platform = (params.get("platform") ?? "").toLowerCase();
	return (install === "1" || install === "true") && platform === "ios";
}
/** Paths that can carry an app document (vs assets / API / internals). */
function isDocumentPath(pathname) {
	const path = String(pathname ?? "");
	return !path.startsWith("/__grok/") && !path.startsWith("/api/") && !path.startsWith("/@") && !path.startsWith("/node_modules") && !/\.[a-z0-9]+$/i.test(path);
}
function acceptsHtml(accept) {
	const value = String(accept ?? "");
	return value === "" || value.includes("text/html") || value.includes("*/*");
}
/** The same URL without the install-tutorial params (used as the app link). */
function stripInstallParams(url) {
	const [path = "/", query = ""] = String(url ?? "/").split("?", 2);
	const params = new URLSearchParams(query);
	params.delete("install");
	params.delete("platform");
	const rest = params.toString();
	return rest ? `${path}?${rest}` : path;
}
function renderInstallPageHtml(template, { host, url } = {}) {
	return String(template).replaceAll("{{APP_NAME}}", escapeHtml(appNameFromHost(host))).replaceAll("{{APP_URL}}", escapeHtml(stripInstallParams(url)));
}
function renderWebManifest(hostHeader) {
	const name = appNameFromHost(hostHeader);
	return JSON.stringify({
		name,
		short_name: name,
		id: "/",
		start_url: "/",
		scope: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#000000",
		icons: [{
			src: "/__grok/icon-180.png",
			sizes: "180x180",
			type: "image/png"
		}]
	}, null, 2);
}
function grokPwaHeadTags(appName = DEFAULT_APP_NAME) {
	return [
		["manifest", "<link rel=\"manifest\" href=\"/__grok/manifest.webmanifest\">"],
		["apple-touch-icon", "<link rel=\"apple-touch-icon\" href=\"/__grok/icon-180.png\">"],
		["apple-mobile-web-app-title", `<meta name="apple-mobile-web-app-title" content="${escapeHtml(appName)}">`],
		["apple-mobile-web-app-status-bar-style", "<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">"],
		["theme-color", "<meta name=\"theme-color\" content=\"#000000\">"]
	];
}
var GROK_EXTENSIONS_SCRIPT_SRC = "https://grok.com/grok-app-builder/extensions.js";
function readGrokProjectId() {
	const fromProcess = typeof process !== "undefined" ? process.env?.VITE_PROJECT_ID : "";
	return String(fromProcess ?? "").trim();
}
function readGrokExtensionsEnabled() {
	const fromProcess = typeof process !== "undefined" ? process.env?.VITE_GROK_EXTENSIONS : "";
	return String(fromProcess ?? "").trim() !== "0";
}
function readXCreator() {
	const fromProcess = typeof process !== "undefined" ? process.env?.X_CREATOR : "";
	return String(fromProcess ?? "").trim();
}
function readXCreatorId() {
	const fromProcess = typeof process !== "undefined" ? process.env?.X_CREATOR_ID : "";
	return String(fromProcess ?? "").trim();
}
function grokXCreatorHeadTags(creator = readXCreator(), creatorId = readXCreatorId()) {
	const name = String(creator ?? "").trim();
	const id = String(creatorId ?? "").trim();
	if (!name || !id) return [];
	return [`<meta property="x:creator" content="${escapeHtml(name)}">`, `<meta property="x:creator:id" content="${escapeHtml(id)}">`];
}
/** Platform "Created with Grok" banner — injected into every HTML document. */
function grokExtensionsHeadTags(projectId = readGrokProjectId()) {
	const id = escapeHtml(projectId);
	const tags = [];
	if (projectId) tags.push(`<meta name="grok-project-id" content="${id}">`);
	if (!readGrokExtensionsEnabled()) return tags;
	tags.push(`<script src="${GROK_EXTENSIONS_SCRIPT_SRC}"${projectId ? ` data-project-id="${id}"` : ""} defer><\/script>`);
	return tags;
}
function readOgSite(cwd = process.cwd()) {
	try {
		const raw = readFileSync(join(cwd, OG_SITE_REL_PATH), "utf8");
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
/** Public path of an on-disk share card, or "" if neither file exists. */
function ogCardPublicPath(cwd = process.cwd()) {
	if (existsSync(join(cwd, "public/og.jpg"))) return "/og.jpg";
	if (existsSync(join(cwd, "public/og.png"))) return "/og.png";
	return "";
}
function detectCustomOgCard(cwd = process.cwd(), site = {}) {
	if (ogCardPublicPath(cwd)) return true;
	return siteHasCustomCard(site) || Boolean(String(site.image ?? "").trim());
}
/** Snapshot for Vite/Nitro to bake into the server bundle (Vercel has no workspace FS). */
function snapshotOgIdentity(cwd = process.cwd()) {
	const site = { ...readOgSite(cwd) };
	const disk = ogCardPublicPath(cwd);
	if (disk) {
		site.card = "custom";
		site.image = disk;
	} else {
		if (siteHasCustomCard(site)) delete site.card;
		if (site.image) delete site.image;
	}
	if (existsSync(join(cwd, "public/x-banner.jpg"))) site.banner = site.banner || "/x-banner.jpg";
	return { site };
}
function ogServiceUrl() {
	return (String(process.env?.VITE_OG_SERVICE_URL ?? "").trim() || "https://og.grok.me").replace(/\/+$/, "");
}
function titleFromDocument(html) {
	const match = String(html ?? "").match(/<title\b[^>]*>([^<]*)<\/title>/i);
	return match ? unescapeHtml(match[1]).trim() : "";
}
function resolveOgTitle(site = {}, appName = DEFAULT_APP_NAME, host = "", documentTitle = "") {
	const fromSite = String(site.title ?? "").trim();
	if (fromSite) return fromSite;
	const fromDoc = String(documentTitle ?? "").trim();
	if (fromDoc) return fromDoc;
	const fromHost = appNameFromHost(host);
	if (fromHost && fromHost !== "Grok App") return fromHost;
	return String(appName ?? "").trim() || "Grok App";
}
function siteHasCustomCard(site = {}) {
	return String(site.card ?? "").toLowerCase() === "custom";
}
/**
* Preview: public/og.jpg|png on disk.
* Vercel: the bake (`card=custom` / `image`) because the function cannot stat public/.
* Otherwise empty — caller emits the og.grok.me placeholder.
*/
function resolveOgCardAsset(site = {}, cwd = process.cwd()) {
	return ogCardPublicPath(cwd) || (detectCustomOgCard(cwd, site) ? String(site.image ?? "").trim() || "/og.jpg" : "");
}
/** Stamp `card=custom` when public/og.jpg or public/og.png is on disk. */
function applyCustomCardFromFs(site, cwd) {
	const disk = ogCardPublicPath(cwd);
	if (!disk) return site;
	return {
		...site,
		card: "custom",
		image: disk
	};
}
function grokOgHeadTags({ host = "", appName = DEFAULT_APP_NAME, site = {}, documentTitle = "", cwd = process.cwd() } = {}) {
	const title = resolveOgTitle(site, appName, host, documentTitle);
	const publicHost = resolvePublicHost(host);
	const tags = [`<meta name="twitter:card" content="summary_large_image">`, `<meta property="og:title" content="${escapeHtml(title)}">`];
	const description = String(site.description ?? "").trim();
	if (description) tags.push(`<meta property="og:description" content="${escapeHtml(description)}">`);
	if (String(site.type ?? "").toLowerCase() === "x:game") tags.push(`<meta property="og:type" content="x:game">`);
	if (publicHost) {
		const asset = resolveOgCardAsset(site, cwd);
		const custom = Boolean(asset);
		let image = custom ? `https://${publicHost}${asset.startsWith("/") ? asset : `/${asset}`}` : `${ogServiceUrl()}/v1/card.png?host=${encodeURIComponent(publicHost)}&title=${encodeURIComponent(title)}`;
		const color = !custom ? placeholderCardColor(site) : "";
		if (color) image += `&color=${encodeURIComponent(color)}`;
		tags.push(`<meta property="og:image" content="${escapeHtml(image)}">`);
		tags.push(`<meta property="og:image:width" content="1200">`);
		tags.push(`<meta property="og:image:height" content="630">`);
		const banner = String(site.banner ?? "").trim();
		if (banner) {
			const bannerUrl = `https://${publicHost}${banner.startsWith("/") ? banner : `/${banner}`}`;
			tags.push(`<meta property="x:game:image" content="${escapeHtml(bannerUrl)}">`);
			tags.push(`<meta property="x:game:image:width" content="1200">`);
			tags.push(`<meta property="x:game:image:height" content="264">`);
		}
	}
	return tags;
}
function stripGrokExtensionsScript(html) {
	return String(html).replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*\/grok-app-builder\/extensions\.js[^"']*["'][^>]*>\s*<\/script>/gi, "");
}
function stripShareMetaTags(html) {
	return String(html).replace(/<meta\b[^>]*>/gi, (tag) => {
		const attrs = [...tag.matchAll(/\b(?:property|name)\s*=\s*["']([^"']+)["']/gi)];
		for (const match of attrs) if (SHARE_META_KEYS.has(String(match[1]).toLowerCase())) return "";
		return tag;
	});
}
function insertAfterHeadOpen(html, snippet) {
	if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, (open) => `${open}${snippet}`);
	if (/<html\b[^>]*>/i.test(html)) return html.replace(/<html\b[^>]*>/i, (open) => `${open}<head>${snippet}</head>`);
	return `<!doctype html><html><head>${snippet}</head>${html}`;
}
function insertBeforeHeadClose(html, snippet) {
	if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${snippet}</head>`);
	return insertAfterHeadOpen(html, snippet);
}
function normalizeHeadContext(ctx = {}) {
	const cwd = ctx.cwd ?? process.cwd();
	const site = applyCustomCardFromFs(ctx.site !== void 0 ? ctx.site : snapshotOgIdentity(cwd).site, cwd);
	return {
		appName: resolveOgTitle(site, ctx.appName ?? "Grok App", ctx.host ?? ""),
		projectId: ctx.projectId ?? readGrokProjectId(),
		creator: ctx.creator ?? readXCreator(),
		creatorId: ctx.creatorId ?? readXCreatorId(),
		host: ctx.host ?? "",
		cwd,
		site
	};
}
function injectGrokPwaHead(html, ctx = {}) {
	if (typeof html !== "string") return html;
	const { site, projectId, creator, creatorId, host, cwd } = normalizeHeadContext(ctx);
	const documentTitle = titleFromDocument(html);
	const appName = resolveOgTitle(site, ctx.appName ?? "Grok App", host, documentTitle);
	let next = stripShareMetaTags(html);
	if (!readGrokExtensionsEnabled()) next = stripGrokExtensionsScript(next);
	const missing = grokPwaHeadTags(appName).filter(([key]) => {
		if (key === "manifest") return !next.includes("href=\"/__grok/manifest.webmanifest\"");
		if (key === "apple-touch-icon") return !next.includes("href=\"/__grok/icon-180.png\"");
		return !next.includes(`name="${key}"`);
	}).map(([, tag]) => tag);
	next = insertAfterHeadOpen(next, grokOgHeadTags({
		host,
		appName,
		site,
		documentTitle,
		cwd
	}).join(""));
	if (readGrokExtensionsEnabled() && !next.includes("/grok-app-builder/extensions.js")) missing.push(...grokExtensionsHeadTags(projectId));
	else if (projectId && !next.includes("name=\"grok-project-id\"")) missing.push(`<meta name="grok-project-id" content="${escapeHtml(projectId)}">`);
	if (projectId && !next.includes("property=\"grok:app_id\"") && !next.includes("property='grok:app_id'")) missing.push(`<meta property="grok:app_id" content="${escapeHtml(projectId)}">`);
	const creatorTags = grokXCreatorHeadTags(creator, creatorId);
	if (creatorTags.length > 0) {
		if (!(next.includes("property=\"x:creator\" content=") || next.includes("property='x:creator' content="))) missing.push(creatorTags[0]);
		if (!next.includes("property=\"x:creator:id\"")) missing.push(creatorTags[1]);
	}
	if (missing.length === 0) return next;
	return insertBeforeHeadClose(next, missing.join(""));
}
function findHeadClose(buf) {
	return buf.toString("latin1").search(/<\/head>/i);
}
/**
* Streaming head injector: buffers only until `</head>` (ASCII marker; never
* appears inside a UTF-8 continuation byte), overwrites share-card metas,
* then passes later chunks through so streaming SSR keeps streaming.
*/
function createHeadInjector(ctx = {}) {
	const normalized = normalizeHeadContext(ctx);
	/** @type {Buffer[]} */
	let pending = [];
	let done = false;
	const apply = (html) => injectGrokPwaHead(html, {
		appName: normalized.appName,
		projectId: normalized.projectId,
		creator: normalized.creator,
		creatorId: normalized.creatorId,
		host: normalized.host,
		cwd: normalized.cwd,
		site: normalized.site
	});
	return {
		/** @param {Uint8Array | string} chunk @returns {Buffer[]} chunks ready to emit */
		push(chunk) {
			const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			if (done) return [buf];
			pending.push(buf);
			const joined = Buffer.concat(pending);
			const at = findHeadClose(joined);
			if (at === -1) return [];
			done = true;
			pending = [];
			const closeLen = joined.toString("latin1", at).match(/^<\/head>/i)[0].length;
			const head = apply(joined.subarray(0, at + closeLen).toString("utf8"));
			return [Buffer.concat([Buffer.from(head, "utf8"), joined.subarray(at + closeLen)])];
		},
		/** @returns {Buffer[]} whatever is still buffered (no `</head>` seen) */
		flush() {
			if (done || pending.length === 0) return [];
			const rest = Buffer.concat(pending);
			pending = [];
			done = true;
			return [Buffer.from(apply(rest.toString("utf8")), "utf8")];
		}
	};
}
//#endregion
//#region server/middleware/grok-pwa.ts
/**
* Deployed-app (Nitro) half of the platform PWA chrome. Auto-registered as
* global h3 middleware because vite.config.ts sets `serverDir: "./server"` —
* without that option Nitro v3 never scans this directory.
*
* - `?install=1&platform=ios` on a document path → the Home Screen tutorial,
*   bundled into the server build via `?raw` (the public/ directory is CDN
*   static output on Vercel and not readable from the function).
* - `/__grok/manifest.webmanifest` → per-app-named manifest (kept out of
*   public/ so this dynamic response is the only one).
* - Other HTML documents → stream-inject PWA + OG head tags at `</head>`.
*   OG identity is baked via `virtual:grok-og-identity` at `vite build`
*   (this function cannot read `src/lib/og/site.json` or `public/og.jpg`).
*   This must be a middleware transforming `next()`: h3 discards the `response`
*   runtime hook's return value, and `render:html` does not exist in Nitro v3.
*/
function requestHost(event) {
	return event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host;
}
function injectHeadStreaming(response, host) {
	const injector = createHeadInjector({
		host,
		site: grokOgIdentity.site
	});
	const transformed = response.body.pipeThrough(new TransformStream({
		transform(chunk, controller) {
			for (const out of injector.push(chunk)) controller.enqueue(out);
		},
		flush(controller) {
			for (const out of injector.flush()) controller.enqueue(out);
		}
	}));
	const headers = new Headers(response.headers);
	headers.delete("content-length");
	return new Response(transformed, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}
async function grokPwaMiddleware(event, next) {
	if ((event.req.method ?? "GET").toUpperCase() !== "GET") return next();
	const path = event.url.pathname;
	const urlWithQuery = path + event.url.search;
	if (path === "/__grok/manifest.webmanifest" || path === "/__grok/manifest.json") return new Response(renderWebManifest(requestHost(event)), { headers: {
		"content-type": "application/manifest+json; charset=utf-8",
		"cache-control": "no-cache"
	} });
	if (isInstallQuery(urlWithQuery) && isDocumentPath(path) && acceptsHtml(event.req.headers.get("accept"))) {
		const html = renderInstallPageHtml(install_page_default, {
			host: requestHost(event),
			url: urlWithQuery
		});
		return new Response(html, { headers: {
			"content-type": "text/html; charset=utf-8",
			"cache-control": "no-cache"
		} });
	}
	if (!isDocumentPath(path)) return next();
	const result = await next();
	if (result instanceof Response && result.body && String(result.headers.get("content-type") ?? "").includes("text/html") && !result.headers.get("content-encoding")) return injectHeadStreaming(result, requestHost(event));
	return result;
}
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_IO091Z = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_IO091Z
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [
	toEventHandler(static_default),
	toEventHandler(collectMiddleware),
	toEventHandler(grokPwaMiddleware)
].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
