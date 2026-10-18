package app.maydan.local

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder

class MaydanServerService : Service() {
    private var server: LocalMaydanServer? = null

    override fun onCreate() {
        super.onCreate()
        val manager = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            manager.createNotificationChannel(NotificationChannel(CHANNEL_ID, "خادم ميدان المحلي", NotificationManager.IMPORTANCE_LOW).apply {
                description = "يبقي جمع البيانات متاحًا للأجهزة على الشبكة المحلية"
            })
        }
        val openApp = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        @Suppress("DEPRECATION")
        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
        } else {
            Notification.Builder(this)
        }
        val notification: Notification = builder
            .setSmallIcon(android.R.drawable.stat_sys_upload_done)
            .setContentTitle("ميدان — الخادم المحلي")
            .setContentText("يستقبل الإجابات على الشبكة المحلية · المنفذ 8080")
            .setContentIntent(openApp)
            .setOngoing(true)
            .build()
        startForeground(NOTIFICATION_ID, notification)
        try {
            server = LocalMaydanServer(applicationContext)
            server?.start(NanoReadTimeout, false)
        } catch (error: Exception) {
            stopForeground(STOP_FOREGROUND_REMOVE)
            stopSelf()
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int = START_STICKY
    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        runCatching { server?.stop() }
        server = null
        super.onDestroy()
    }

    companion object {
        private const val CHANNEL_ID = "maydan-local-server"
        private const val NOTIFICATION_ID = 8041
        private const val NanoReadTimeout = 10_000
    }
}
