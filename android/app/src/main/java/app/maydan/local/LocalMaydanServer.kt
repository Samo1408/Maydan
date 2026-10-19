package app.maydan.local

import android.content.Context
import fi.iki.elonen.NanoHTTPD
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.net.NetworkInterface
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.util.Collections
import java.util.Date
import java.text.SimpleDateFormat
import java.util.Locale

class LocalMaydanServer(
    private val context: Context,
    port: Int = 8080,
) : NanoHTTPD("0.0.0.0", port) {
    private val storeFile = File(context.filesDir, "maydan-store.json")
    private val lock = Any()

    override fun serve(session: IHTTPSession): Response {
        val path = session.uri.substringBefore('?').ifBlank { "/" }
        return try {
            if (path.startsWith("/api/")) handleApi(session, path)
            else serveAsset(path)
        } catch (error: Exception) {
            json(Response.Status.INTERNAL_ERROR, JSONObject().put("error", error.message ?: "حدث خطأ داخلي"))
        }
    }

    private fun handleApi(session: IHTTPSession, path: String): Response {
        if (session.method == Method.OPTIONS) {
            return newFixedLengthResponse(Response.Status.NO_CONTENT, "application/json", "")
        }
        if (path == "/api/snapshot" && session.method == Method.GET) {
            return json(Response.Status.OK, snapshot())
        }
        if (session.method != Method.POST) return json(Response.Status.METHOD_NOT_ALLOWED, JSONObject().put("error", "الطريقة غير مدعومة"))
        val body = readJson(session)
        return synchronized(lock) {
            val data = loadStore()
            when (path) {
                "/api/forms/save" -> {
                    val form = body
                    val forms = data.getJSONArray("forms")
                    val existing = indexOf(forms, "id", form.optString("id"))
                    form.put("updatedAt", now())
                    if (existing < 0) forms.put(0, form) else forms.put(existing, form)
                    persist(data)
                }
                "/api/forms/delete" -> {
                    val id = body.optString("id")
                    data.put("forms", filterArray(data.getJSONArray("forms")) { it.optString("id") != id })
                    data.put("submissions", filterArray(data.getJSONArray("submissions")) { it.optString("formId") != id })
                    persist(data)
                }
                "/api/submissions/delete" -> {
                    val id = body.optString("id")
                    data.put("submissions", filterArray(data.getJSONArray("submissions")) { it.optString("id") != id })
                    persist(data)
                }
                "/api/submissions/add" -> {
                    val id = body.optString("id")
                    if (indexOf(data.getJSONArray("submissions"), "id", id) < 0) {
                        val form = findById(data.getJSONArray("forms"), body.optString("formId"))
                            ?: return@synchronized json(Response.Status.BAD_REQUEST, JSONObject().put("error", "النموذج غير موجود"))
                        if (!form.optBoolean("deployed", false) && body.optString("source") == "lan") {
                            return@synchronized json(Response.Status.BAD_REQUEST, JSONObject().put("error", "النموذج غير منشور على الشبكة"))
                        }
                        validateRequired(form, body.optJSONObject("answers") ?: JSONObject())?.let {
                            return@synchronized json(Response.Status.BAD_REQUEST, JSONObject().put("error", it))
                        }
                        val cleanSubmission = JSONObject()
                            .put("id", id)
                            .put("formId", body.optString("formId"))
                            .put("answers", body.optJSONObject("answers") ?: JSONObject())
                            .put("deviceLabel", body.optString("deviceLabel").trim().take(80).ifBlank { "جهاز" })
                            .put("source", if (body.optString("source") == "lan") "lan" else "desk")
                            .put("submittedAt", body.optString("submittedAt").ifBlank { now() })
                        data.getJSONArray("submissions").put(0, cleanSubmission)
                        persist(data)
                    }
                }
                "/api/submissions/import" -> {
                    val formId = body.optString("formId")
                    if (findById(data.getJSONArray("forms"), formId) == null) {
                        return@synchronized json(Response.Status.BAD_REQUEST, JSONObject().put("error", "النموذج غير موجود"))
                    }
                    val existing = data.getJSONArray("submissions")
                    val rows = body.optJSONArray("rows") ?: JSONArray()
                    for (i in 0 until minOf(rows.length(), 500)) {
                        val row = rows.optJSONObject(i) ?: continue
                        val id = row.optString("id")
                        if (indexOf(existing, "id", id) >= 0) continue
                        existing.put(0, JSONObject()
                            .put("id", id)
                            .put("formId", formId)
                            .put("answers", row.optJSONObject("answers") ?: JSONObject())
                            .put("submittedAt", row.optString("submittedAt").ifBlank { now() })
                            .put("deviceLabel", row.optString("deviceLabel").take(80).ifBlank { "استيراد" })
                            .put("source", "desk"))
                    }
                    persist(data)
                }
                "/api/submissions/get" -> {
                    val found = findById(data.getJSONArray("submissions"), body.optString("id"))
                    return@synchronized json(Response.Status.OK, JSONObject().put("submission", found ?: JSONObject.NULL))
                }
                else -> return@synchronized json(Response.Status.NOT_FOUND, JSONObject().put("error", "المسار غير موجود"))
            }
            json(Response.Status.OK, snapshot())
        }
    }

    private fun serveAsset(requestPath: String): Response {
        val clean = requestPath.removePrefix("/").replace("\\", "/")
        if (clean.split('/').any { it == ".." }) return newFixedLengthResponse(Response.Status.FORBIDDEN, "text/plain", "Forbidden")
        val relative = if (clean.isBlank()) "index.html" else clean
        val bytes = try {
            context.assets.open("www/$relative").use { it.readBytes() }
        } catch (_: Exception) {
            if (relative.contains('.') && !relative.endsWith(".html")) {
                return newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain; charset=utf-8", "Not found")
            }
            try { context.assets.open("www/index.html").use { it.readBytes() } }
            catch (_: Exception) { return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "text/plain", "Android web assets missing") }
        }
        val mime = when (relative.substringAfterLast('.', "html").lowercase(Locale.ROOT)) {
            "html" -> "text/html; charset=utf-8"
            "js", "mjs" -> "text/javascript; charset=utf-8"
            "css" -> "text/css; charset=utf-8"
            "json", "webmanifest" -> "application/json; charset=utf-8"
            "svg" -> "image/svg+xml"
            "png" -> "image/png"
            "jpg", "jpeg" -> "image/jpeg"
            "woff" -> "font/woff"
            "woff2" -> "font/woff2"
            "ico" -> "image/x-icon"
            else -> "application/octet-stream"
        }
        return newFixedLengthResponse(Response.Status.OK, mime, bytes.inputStream(), bytes.size.toLong())
    }

    private fun readJson(session: IHTTPSession): JSONObject {
        val files = HashMap<String, String>()
        session.parseBody(files)
        val direct = files["postData"]
        val raw = when {
            direct == null -> files.values.firstOrNull()?.let { value -> runCatching { File(value).readText() }.getOrNull() } ?: "{}"
            direct.trimStart().startsWith("{") || direct.trimStart().startsWith("[") -> direct
            else -> runCatching { File(direct).readText() }.getOrDefault(direct)
        }
        return JSONObject(raw.ifBlank { "{}" })
    }

    private fun loadStore(): JSONObject {
        if (!storeFile.exists()) {
            storeFile.parentFile?.mkdirs()
            context.assets.open("seed/maydan-store.json").use { input -> storeFile.writeBytes(input.readBytes()) }
        }
        val text = storeFile.readText()
        return JSONObject(text)
    }

    private fun persist(data: JSONObject) {
        val temp = File(storeFile.parentFile, "${storeFile.name}.tmp")
        temp.writeText(data.toString(), StandardCharsets.UTF_8)
        try {
            Files.move(temp.toPath(), storeFile.toPath(), StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE)
        } catch (_: Exception) {
            try {
                Files.move(temp.toPath(), storeFile.toPath(), StandardCopyOption.REPLACE_EXISTING)
            } catch (error: Exception) {
                throw IllegalStateException("تعذّر حفظ البيانات على الهاتف", error)
            }
        }
    }

    private fun snapshot(): JSONObject = synchronized(lock) {
        val data = loadStore()
        val forms = data.optJSONArray("forms") ?: JSONArray()
        val source = data.optJSONArray("submissions") ?: JSONArray()
        val submissions = JSONArray()
        for (i in 0 until source.length()) {
            val row = source.optJSONObject(i)?.let { JSONObject(it.toString()) } ?: continue
            val answers = row.optJSONObject("answers") ?: JSONObject()
            val keys = answers.keys().asSequence().toList()
            for (key in keys) {
                val value = answers.opt(key)
                if (value is String && value.startsWith("data:")) answers.put(key, "__image__")
            }
            submissions.put(row)
        }
        JSONObject().put("forms", forms).put("submissions", submissions).put("network", networkInfo())
    }

    private fun networkInfo(): JSONObject {
        val addresses = JSONArray()
        try {
            val interfaces = Collections.list(NetworkInterface.getNetworkInterfaces())
            for (network in interfaces) {
                if (!network.isUp || network.isLoopback) continue
                for (address in Collections.list(network.inetAddresses)) {
                    val value = address.hostAddress ?: continue
                    if (address.isLoopbackAddress || value.contains(':')) continue
                    addresses.put(JSONObject().put("name", network.displayName).put("address", value))
                }
            }
        } catch (_: Exception) { }
        return JSONObject().put("port", 8080).put("addresses", addresses)
    }

    private fun validateRequired(form: JSONObject, answers: JSONObject): String? {
        val questions = form.optJSONArray("questions") ?: return null
        for (i in 0 until questions.length()) {
            val question = questions.optJSONObject(i) ?: continue
            if (!question.optBoolean("required", false)) continue
            val name = question.optString("name")
            val value = answers.opt(name)
            val empty = value == null || value == JSONObject.NULL || (value is String && value.isBlank()) || (value is JSONArray && value.length() == 0)
            if (empty) return "الحقل مطلوب: ${question.optString("label", name)}"
        }
        return null
    }

    private fun indexOf(array: JSONArray, key: String, value: String): Int {
        for (i in 0 until array.length()) if (array.optJSONObject(i)?.optString(key) == value) return i
        return -1
    }
    private fun findById(array: JSONArray, id: String): JSONObject? {
        for (i in 0 until array.length()) {
            val item = array.optJSONObject(i) ?: continue
            if (item.optString("id") == id) return item
        }
        return null
    }
    private fun filterArray(array: JSONArray, keep: (JSONObject) -> Boolean): JSONArray {
        val result = JSONArray()
        for (i in 0 until array.length()) {
            val item = array.optJSONObject(i) ?: continue
            if (keep(item)) result.put(item)
        }
        return result
    }
    private fun now(): String = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply { timeZone = java.util.TimeZone.getTimeZone("UTC") }.format(Date())
    private fun json(status: Response.IStatus, body: JSONObject): Response = newFixedLengthResponse(status, "application/json; charset=utf-8", body.toString())
}
