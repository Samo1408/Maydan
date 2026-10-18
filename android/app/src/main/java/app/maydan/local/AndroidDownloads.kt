package app.maydan.local

import android.content.ContentValues
import android.content.Context
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.webkit.JavascriptInterface
import android.widget.Toast
import android.util.Base64
import java.io.File

class AndroidDownloads(private val context: Context) {
    @JavascriptInterface
    fun saveBase64(filename: String, mimeType: String, base64: String): String {
        return try {
            val safeName = filename.substringAfterLast('/').substringAfterLast('\\').replace(Regex("[^\\p{L}\\p{N}._ -]"), "_").take(120).ifBlank { "maydan-export.bin" }
            val bytes = Base64.decode(base64, Base64.DEFAULT)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val values = ContentValues().apply {
                    put(MediaStore.Downloads.DISPLAY_NAME, safeName)
                    put(MediaStore.Downloads.MIME_TYPE, mimeType.ifBlank { "application/octet-stream" })
                    put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Maydan")
                    put(MediaStore.Downloads.IS_PENDING, 1)
                }
                val uri = context.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                    ?: throw IllegalStateException("تعذّر إنشاء ملف التنزيل")
                context.contentResolver.openOutputStream(uri)?.use { it.write(bytes) }
                    ?: throw IllegalStateException("تعذّر كتابة ملف التنزيل")
                values.clear()
                values.put(MediaStore.Downloads.IS_PENDING, 0)
                context.contentResolver.update(uri, values, null, null)
                Toast.makeText(context, "تم حفظ $safeName في مجلد Downloads/Maydan", Toast.LENGTH_LONG).show()
                uri.toString()
            } else {
                val directory = File(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "Maydan")
                directory.mkdirs()
                val file = File(directory, safeName)
                file.writeBytes(bytes)
                Toast.makeText(context, "تم حفظ الملف داخل مساحة ميدان", Toast.LENGTH_LONG).show()
                file.absolutePath
            }
        } catch (error: Exception) {
            Toast.makeText(context, "تعذّر حفظ الملف: ${error.message ?: "خطأ غير معروف"}", Toast.LENGTH_LONG).show()
            ""
        }
    }
}
