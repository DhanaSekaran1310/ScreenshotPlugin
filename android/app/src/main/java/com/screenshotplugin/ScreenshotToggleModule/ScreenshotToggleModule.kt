package com.screenshotplugin

import android.app.Activity
import android.content.Context
import android.os.Build
import android.provider.Settings
import android.view.WindowManager
import android.net.wifi.WifiManager
import android.telephony.TelephonyManager
import android.location.Location
import android.location.LocationManager
import android.util.Log
import com.facebook.react.bridge.*
import java.net.HttpURLConnection
import java.net.URL
import java.util.*
import kotlinx.coroutines.*
import org.json.JSONObject

class ScreenshotToggleModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val context: Context = reactContext

    override fun getName(): String {
        return "ScreenshotToggleModule"
    }

@ReactMethod
    fun toggleScreenshot(isActivated: Boolean, promise: Promise) {
        val currentActivity = currentActivity

        if (currentActivity == null) {
            promise.reject("Error", "Current activity is null")
            return
        }

        try {
            // Switch to main thread for UI interaction
            currentActivity.runOnUiThread {
                if (isActivated) {
                    // Disable Screenshot
                    currentActivity.window.setFlags(
                        WindowManager.LayoutParams.FLAG_SECURE,
                        WindowManager.LayoutParams.FLAG_SECURE
                    )
                } else {
                    // Enable Screenshot
                    currentActivity.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
                }
            }

            // Collect device details asynchronously
            GlobalScope.launch(Dispatchers.IO) {
                val deviceDetails = getDeviceDetails(isActivated)
                promise.resolve(deviceDetails.toString())
            }
            
        } catch (e: Exception) {
           promise.reject("Error", e.message ?: "Unknown error")
        }
    }

    private fun getDeviceDetails(isActivated: Boolean): WritableMap {
        val deviceDetails = Arguments.createMap()

        // OS Info
        deviceDetails.putString("os", "Android")
        deviceDetails.putString("osVersion", Build.VERSION.RELEASE)
        
        // Device Info
        deviceDetails.putString("deviceName", Build.MODEL)
        deviceDetails.putString("brand", Build.BRAND)
        
        // Screenshot Status
        deviceDetails.putString("screenshotStatus", if (isActivated) "Disabled" else "Enabled")
        
        // MAC Address
        deviceDetails.putString("macAddress", getMacAddress())
        
        // IMEI (Deprecated, works only below Android 10)
        deviceDetails.putString("imei", getIMEINumber())
        
        // Location (Last Known)
        val location = getLastKnownLocation()
        if (location != null) {
            deviceDetails.putDouble("latitude", location.latitude)
            deviceDetails.putDouble("longitude", location.longitude)
        }
        
        // Public IP
        val publicIP = getPublicIP()
        deviceDetails.putString("publicIP", publicIP)
        
        return deviceDetails
    }

    private fun getMacAddress(): String {
        try {
            val wifiManager = context.getSystemService(Context.WIFI_SERVICE) as WifiManager
            val info = wifiManager.connectionInfo
            return info.macAddress ?: "Unavailable"
        } catch (e: Exception) {
            Log.e("MAC", e.message.toString())
        }
        return "Unavailable"
    }

    private fun getIMEINumber(): String {
        try {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) { // Android 10 and below
                val telephonyManager =
                    context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
                return telephonyManager.deviceId ?: "Unavailable"
            }
        } catch (e: Exception) {
            Log.e("IMEI", e.message.toString())
        }
        return "Unavailable"
    }

    private fun getLastKnownLocation(): Location? {
        try {
            val locationManager =
                context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            val providers = locationManager.getProviders(true)
            for (provider in providers.reversed()) {
                val location = locationManager.getLastKnownLocation(provider)
                if (location != null) return location
            }
        } catch (e: SecurityException) {
            Log.e("Location", "Permission not granted")
        } catch (e: Exception) {
            Log.e("Location", e.message.toString())
        }
        return null
    }

    private fun getPublicIP(): String {
        return try {
            val url = URL("https://api.ipify.org?format=json")
            val urlConnection = url.openConnection() as HttpURLConnection
            urlConnection.requestMethod = "GET"
            urlConnection.connectTimeout = 5000
            urlConnection.readTimeout = 5000

            val scanner = Scanner(urlConnection.inputStream)
            val response = scanner.useDelimiter("\\A").next()
            val json = JSONObject(response)
            json.getString("ip")
        } catch (e: Exception) {
            Log.e("PublicIP", e.message.toString())
            "Unavailable"
        }
    }
}
