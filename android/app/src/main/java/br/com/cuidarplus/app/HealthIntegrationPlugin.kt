package br.com.cuidarplus.app

import android.os.Build
import androidx.activity.result.ActivityResult
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.BloodGlucoseRecord
import androidx.health.connect.client.records.BloodPressureRecord
import androidx.health.connect.client.records.BodyTemperatureRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.OxygenSaturationRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.WeightRecord
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

@CapacitorPlugin(
    name = "HealthIntegration"
)
class HealthIntegrationPlugin : Plugin() {
    private val pluginScope =
        CoroutineScope(
            SupervisorJob() +
                Dispatchers.IO
        )

    private val requiredPermissions =
        setOf(
            HealthPermission.getReadPermission(
                HeartRateRecord::class
            ),
            HealthPermission.getReadPermission(
                BloodPressureRecord::class
            ),
            HealthPermission.getReadPermission(
                BloodGlucoseRecord::class
            ),
            HealthPermission.getReadPermission(
                OxygenSaturationRecord::class
            ),
            HealthPermission.getReadPermission(
                BodyTemperatureRecord::class
            ),
            HealthPermission.getReadPermission(
                WeightRecord::class
            ),
            HealthPermission.getReadPermission(
                StepsRecord::class
            ),
            HealthPermission.getReadPermission(
                SleepSessionRecord::class
            )
        )

    private val permissionContract by lazy {
        PermissionController
            .createRequestPermissionResultContract()
    }

    @PluginMethod
    fun getCompatibility(
        call: PluginCall
    ) {
        resolveCompatibility(
            call = call,
            afterPermissionRequest = false
        )
    }

    @PluginMethod
    fun requestHealthPermissions(
        call: PluginCall
    ) {
        val sdkStatus =
            HealthConnectClient.getSdkStatus(
                context
            )

        if (
            sdkStatus !=
            HealthConnectClient.SDK_AVAILABLE
        ) {
            call.resolve(
                createUnavailableCompatibility(
                    sdkStatus
                )
            )
            return
        }

        pluginScope.launch {
            try {
                val client =
                    HealthConnectClient
                        .getOrCreate(context)

                val granted =
                    client.permissionController
                        .getGrantedPermissions()

                if (
                    granted.containsAll(
                        requiredPermissions
                    )
                ) {
                    resolveOnMainThread(
                        call,
                        createAvailableCompatibility(
                            granted,
                            afterPermissionRequest =
                                true
                        )
                    )
                    return@launch
                }

                activity.runOnUiThread {
                    try {
                        val intent =
                            permissionContract
                                .createIntent(
                                    context,
                                    requiredPermissions
                                )

                        startActivityForResult(
                            call,
                            intent,
                            "handlePermissionResult"
                        )
                    } catch (
                        exception: Exception
                    ) {
                        call.reject(
                            "Não foi possível abrir as permissões do Health Connect.",
                            exception
                        )
                    }
                }
            } catch (
                exception: Exception
            ) {
                rejectOnMainThread(
                    call,
                    "Não foi possível consultar as permissões do Health Connect.",
                    exception
                )
            }
        }
    }

    @ActivityCallback
    private fun handlePermissionResult(
        call: PluginCall?,
        result: ActivityResult
    ) {
        if (call == null) {
            return
        }

        try {
            val granted =
                permissionContract.parseResult(
                    result.resultCode,
                    result.data
                )

            call.resolve(
                createAvailableCompatibility(
                    granted,
                    afterPermissionRequest = true
                )
            )
        } catch (
            exception: Exception
        ) {
            call.reject(
                "Não foi possível interpretar as permissões concedidas.",
                exception
            )
        }
    }

    @PluginMethod
    fun readMeasurements(
        call: PluginCall
    ) {
        call.reject(
            "A leitura das medições será habilitada na próxima etapa."
        )
    }

    private fun resolveCompatibility(
        call: PluginCall,
        afterPermissionRequest: Boolean
    ) {
        val sdkStatus =
            HealthConnectClient.getSdkStatus(
                context
            )

        if (
            sdkStatus !=
            HealthConnectClient.SDK_AVAILABLE
        ) {
            call.resolve(
                createUnavailableCompatibility(
                    sdkStatus
                )
            )
            return
        }

        pluginScope.launch {
            try {
                val granted =
                    HealthConnectClient
                        .getOrCreate(context)
                        .permissionController
                        .getGrantedPermissions()

                resolveOnMainThread(
                    call,
                    createAvailableCompatibility(
                        granted,
                        afterPermissionRequest
                    )
                )
            } catch (
                exception: Exception
            ) {
                rejectOnMainThread(
                    call,
                    "Não foi possível verificar o Health Connect.",
                    exception
                )
            }
        }
    }

    private fun createUnavailableCompatibility(
        sdkStatus: Int
    ): JSObject {
        val requiresUpdate =
            sdkStatus ==
                HealthConnectClient
                    .SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED

        return JSObject().apply {
            put("platform", "android")
            put(
                "provider",
                "health-connect"
            )
            put(
                "nativeApplication",
                true
            )
            put("available", false)
            put(
                "permissionStatus",
                "unavailable"
            )
            put(
                "deviceName",
                getDeviceName()
            )
            put(
                "operatingSystem",
                "Android ${Build.VERSION.RELEASE}"
            )
            put(
                "message",
                if (requiresUpdate) {
                    "O Health Connect precisa ser instalado ou atualizado neste aparelho."
                } else {
                    "O Health Connect não está disponível neste aparelho."
                }
            )
        }
    }

    private fun createAvailableCompatibility(
        granted: Set<String>,
        afterPermissionRequest: Boolean
    ): JSObject {
        val permissionStatus =
            when {
                granted.containsAll(
                    requiredPermissions
                ) -> "granted"

                granted.isNotEmpty() ->
                    "partial"

                afterPermissionRequest ->
                    "denied"

                else ->
                    "not-requested"
            }

        val message =
            when (permissionStatus) {
                "granted" ->
                    "Health Connect disponível e permissões concedidas."

                "partial" ->
                    "Algumas permissões foram concedidas. Autorize os demais dados para uma sincronização completa."

                "denied" ->
                    "As permissões de saúde não foram concedidas."

                else ->
                    "Health Connect disponível. Autorize o acesso aos dados de saúde."
            }

        return JSObject().apply {
            put("platform", "android")
            put(
                "provider",
                "health-connect"
            )
            put(
                "nativeApplication",
                true
            )
            put("available", true)
            put(
                "permissionStatus",
                permissionStatus
            )
            put(
                "deviceName",
                getDeviceName()
            )
            put(
                "operatingSystem",
                "Android ${Build.VERSION.RELEASE}"
            )
            put("message", message)
        }
    }

    private fun getDeviceName(): String {
        val manufacturer =
            Build.MANUFACTURER
                .trim()
                .replaceFirstChar {
                    it.uppercase()
                }

        val model =
            Build.MODEL.trim()

        return if (
            model.startsWith(
                manufacturer,
                ignoreCase = true
            )
        ) {
            model
        } else {
            "$manufacturer $model"
        }
    }

    private fun resolveOnMainThread(
        call: PluginCall,
        result: JSObject
    ) {
        activity.runOnUiThread {
            call.resolve(result)
        }
    }

    private fun rejectOnMainThread(
        call: PluginCall,
        message: String,
        exception: Exception
    ) {
        activity.runOnUiThread {
            call.reject(
                message,
                exception
            )
        }
    }
}
