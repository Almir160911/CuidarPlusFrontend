package br.com.cuidarplus.app

import android.os.Build

import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.BloodGlucoseRecord
import androidx.health.connect.client.records.BloodPressureRecord
import androidx.health.connect.client.records.BodyTemperatureRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.OxygenSaturationRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.WeightRecord
import androidx.health.connect.client.records.metadata.Metadata
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import org.json.JSONObject
import java.time.Duration
import java.time.Instant

internal class HealthConnectMeasurementReader(
    private val client: HealthConnectClient
) {
    suspend fun read(
        since: Instant,
        until: Instant,
        grantedPermissions: Set<String>
    ): JSArray {
        val measurements =
            mutableListOf<NativeMeasurement>()

        if (
            hasPermission<HeartRateRecord>(
                grantedPermissions
            )
        ) {
            readHeartRate(
                since,
                until,
                measurements
            )
        }

        if (
            hasPermission<BloodPressureRecord>(
                grantedPermissions
            )
        ) {
            readBloodPressure(
                since,
                until,
                measurements
            )
        }

        if (
            hasPermission<BloodGlucoseRecord>(
                grantedPermissions
            )
        ) {
            readBloodGlucose(
                since,
                until,
                measurements
            )
        }

        if (
            hasPermission<OxygenSaturationRecord>(
                grantedPermissions
            )
        ) {
            readOxygenSaturation(
                since,
                until,
                measurements
            )
        }

        if (
            hasPermission<BodyTemperatureRecord>(
                grantedPermissions
            )
        ) {
            readBodyTemperature(
                since,
                until,
                measurements
            )
        }

        if (
            hasPermission<WeightRecord>(
                grantedPermissions
            )
        ) {
            readWeight(
                since,
                until,
                measurements
            )
        }

        if (
            hasPermission<StepsRecord>(
                grantedPermissions
            )
        ) {
            readSteps(
                since,
                until,
                measurements
            )
        }

        if (
            hasPermission<SleepSessionRecord>(
                grantedPermissions
            )
        ) {
            readSleep(
                since,
                until,
                measurements
            )
        }

        val result = JSArray()

        measurements
            .sortedBy {
                it.measuredAt
            }
            .forEach {
                result.put(
                    it.toJsObject()
                )
            }

        return result
    }

    private suspend fun readHeartRate(
        since: Instant,
        until: Instant,
        output: MutableList<NativeMeasurement>
    ) {
        val records =
            client.readRecords(
                ReadRecordsRequest(
                    HeartRateRecord::class,
                    timeRangeFilter =
                        createTimeRange(
                            since,
                            until
                        )
                )
            ).records

        records.forEach { record ->
            record.samples.forEach { sample ->
                output.add(
                    NativeMeasurement(
                        type = HEART_RATE,
                        value =
                            sample
                                .beatsPerMinute
                                .toDouble(),
                        unit = "bpm",
                        measuredAt =
                            sample.time,
                        externalMeasurementId =
                            externalId(
                                record.metadata,
                                "heart-rate",
                                sample.time
                            ),
                        metadataJson =
                            metadataJson(
                                record.metadata,
                                "HeartRateRecord"
                            )
                    )
                )
            }
        }
    }

    private suspend fun readBloodPressure(
        since: Instant,
        until: Instant,
        output: MutableList<NativeMeasurement>
    ) {
        val records =
            client.readRecords(
                ReadRecordsRequest(
                    BloodPressureRecord::class,
                    timeRangeFilter =
                        createTimeRange(
                            since,
                            until
                        )
                )
            ).records

        records.forEach { record ->
            val metadata =
                metadataJson(
                    record.metadata,
                    "BloodPressureRecord"
                )

            output.add(
                NativeMeasurement(
                    type =
                        BLOOD_PRESSURE_SYSTOLIC,
                    value =
                        record.systolic
                            .inMillimetersOfMercury,
                    unit = "mmHg",
                    measuredAt = record.time,
                    externalMeasurementId =
                        externalId(
                            record.metadata,
                            "blood-pressure-systolic",
                            record.time
                        ),
                    metadataJson = metadata
                )
            )

            output.add(
                NativeMeasurement(
                    type =
                        BLOOD_PRESSURE_DIASTOLIC,
                    value =
                        record.diastolic
                            .inMillimetersOfMercury,
                    unit = "mmHg",
                    measuredAt = record.time,
                    externalMeasurementId =
                        externalId(
                            record.metadata,
                            "blood-pressure-diastolic",
                            record.time
                        ),
                    metadataJson = metadata
                )
            )
        }
    }

    private suspend fun readBloodGlucose(
        since: Instant,
        until: Instant,
        output: MutableList<NativeMeasurement>
    ) {
        val records =
            client.readRecords(
                ReadRecordsRequest(
                    BloodGlucoseRecord::class,
                    timeRangeFilter =
                        createTimeRange(
                            since,
                            until
                        )
                )
            ).records

        records.forEach { record ->
            output.add(
                NativeMeasurement(
                    type = BLOOD_GLUCOSE,
                    value =
                        record.level
                            .inMilligramsPerDeciliter,
                    unit = "mg/dL",
                    measuredAt = record.time,
                    externalMeasurementId =
                        externalId(
                            record.metadata,
                            "blood-glucose",
                            record.time
                        ),
                    metadataJson =
                        metadataJson(
                            record.metadata,
                            "BloodGlucoseRecord"
                        )
                )
            )
        }
    }

    private suspend fun readOxygenSaturation(
        since: Instant,
        until: Instant,
        output: MutableList<NativeMeasurement>
    ) {
        val records =
            client.readRecords(
                ReadRecordsRequest(
                    OxygenSaturationRecord::class,
                    timeRangeFilter =
                        createTimeRange(
                            since,
                            until
                        )
                )
            ).records

        records.forEach { record ->
            output.add(
                NativeMeasurement(
                    type = OXYGEN_SATURATION,
                    value =
                        record.percentage.value,
                    unit = "%",
                    measuredAt = record.time,
                    externalMeasurementId =
                        externalId(
                            record.metadata,
                            "oxygen-saturation",
                            record.time
                        ),
                    metadataJson =
                        metadataJson(
                            record.metadata,
                            "OxygenSaturationRecord"
                        )
                )
            )
        }
    }

    private suspend fun readBodyTemperature(
        since: Instant,
        until: Instant,
        output: MutableList<NativeMeasurement>
    ) {
        val records =
            client.readRecords(
                ReadRecordsRequest(
                    BodyTemperatureRecord::class,
                    timeRangeFilter =
                        createTimeRange(
                            since,
                            until
                        )
                )
            ).records

        records.forEach { record ->
            output.add(
                NativeMeasurement(
                    type = TEMPERATURE,
                    value =
                        record.temperature
                            .inCelsius,
                    unit = "°C",
                    measuredAt = record.time,
                    externalMeasurementId =
                        externalId(
                            record.metadata,
                            "body-temperature",
                            record.time
                        ),
                    metadataJson =
                        metadataJson(
                            record.metadata,
                            "BodyTemperatureRecord"
                        )
                )
            )
        }
    }

    private suspend fun readWeight(
        since: Instant,
        until: Instant,
        output: MutableList<NativeMeasurement>
    ) {
        val records =
            client.readRecords(
                ReadRecordsRequest(
                    WeightRecord::class,
                    timeRangeFilter =
                        createTimeRange(
                            since,
                            until
                        )
                )
            ).records

        records.forEach { record ->
            output.add(
                NativeMeasurement(
                    type = WEIGHT,
                    value =
                        record.weight
                            .inKilograms,
                    unit = "kg",
                    measuredAt = record.time,
                    externalMeasurementId =
                        externalId(
                            record.metadata,
                            "weight",
                            record.time
                        ),
                    metadataJson =
                        metadataJson(
                            record.metadata,
                            "WeightRecord"
                        )
                )
            )
        }
    }

    private suspend fun readSteps(
        since: Instant,
        until: Instant,
        output: MutableList<NativeMeasurement>
    ) {
        val records =
            client.readRecords(
                ReadRecordsRequest(
                    StepsRecord::class,
                    timeRangeFilter =
                        createTimeRange(
                            since,
                            until
                        )
                )
            ).records

        records.forEach { record ->
            output.add(
                NativeMeasurement(
                    type = STEPS,
                    value =
                        record.count
                            .toDouble(),
                    unit = "steps",
                    measuredAt =
                        record.endTime,
                    externalMeasurementId =
                        externalId(
                            record.metadata,
                            "steps",
                            record.endTime
                        ),
                    metadataJson =
                        metadataJson(
                            record.metadata,
                            "StepsRecord"
                        )
                )
            )
        }
    }

    private suspend fun readSleep(
        since: Instant,
        until: Instant,
        output: MutableList<NativeMeasurement>
    ) {
        val records =
            client.readRecords(
                ReadRecordsRequest(
                    SleepSessionRecord::class,
                    timeRangeFilter =
                        createTimeRange(
                            since,
                            until
                        )
                )
            ).records

        records.forEach { record ->
            val durationMinutes =
                Duration.between(
                    record.startTime,
                    record.endTime
                ).toMinutes()

            if (durationMinutes > 0) {
                output.add(
                    NativeMeasurement(
                        type = SLEEP_DURATION,
                        value =
                            durationMinutes
                                .toDouble(),
                        unit = "min",
                        measuredAt =
                            record.endTime,
                        externalMeasurementId =
                            externalId(
                                record.metadata,
                                "sleep-duration",
                                record.endTime
                            ),
                        metadataJson =
                            metadataJson(
                                record.metadata,
                                "SleepSessionRecord"
                            )
                    )
                )
            }
        }
    }

    private inline fun <
        reified T : androidx.health.connect.client.records.Record
    > hasPermission(
        grantedPermissions: Set<String>
    ): Boolean {
        return grantedPermissions.contains(
            HealthPermission
                .getReadPermission(
                    T::class
                )
        )
    }

    private fun createTimeRange(
        since: Instant,
        until: Instant
    ): TimeRangeFilter {
        return TimeRangeFilter.between(
            since,
            until
        )
    }

    private fun externalId(
        metadata: Metadata,
        measurementType: String,
        measuredAt: Instant
    ): String {
        return listOf(
            "health-connect",
            metadata.id,
            measurementType,
            measuredAt.toEpochMilli()
        ).joinToString(":")
    }

    private fun metadataJson(
        metadata: Metadata,
        recordType: String
    ): String {
        val dataOrigin =
            metadata.dataOrigin.packageName

        val sourceDevice =
            metadata.device

        val isPhoneOrigin =
            dataOrigin.startsWith(
                "com.android.healthconnect.phone"
            )

        val manufacturer =
            sourceDevice?.manufacturer
                ?: if (isPhoneOrigin) {
                    Build.MANUFACTURER
                } else {
                    null
                }

        val model =
            sourceDevice?.model
                ?: if (isPhoneOrigin) {
                    Build.MODEL
                } else {
                    null
                }

        return JSONObject()
            .put("source", "HealthConnect")
            .put("recordType", recordType)
            .put("dataOrigin", dataOrigin)
            .put(
                "sourceDeviceManufacturer",
                manufacturer
            )
            .put(
                "sourceDeviceModel",
                model
            )
            .put(
                "sourceDeviceType",
                sourceDevice?.type
            )
            .put(
                "sourceDeviceCategory",
                if (isPhoneOrigin) {
                    "phone"
                } else {
                    "physical-or-unknown"
                }
            )
            .toString()
    }

    private data class NativeMeasurement(
        val type: Int,
        val value: Double,
        val unit: String,
        val measuredAt: Instant,
        val externalMeasurementId: String,
        val metadataJson: String
    ) {
        fun toJsObject(): JSObject {
            return JSObject().apply {
                put("type", type)
                put("value", value)
                put("unit", unit)
                put(
                    "measuredAt",
                    measuredAt.toString()
                )
                put(
                    "externalMeasurementId",
                    externalMeasurementId
                )
                put(
                    "metadataJson",
                    metadataJson
                )
            }
        }
    }

    private companion object {
        const val HEART_RATE = 1
        const val BLOOD_PRESSURE_SYSTOLIC = 2
        const val BLOOD_PRESSURE_DIASTOLIC = 3
        const val BLOOD_GLUCOSE = 4
        const val OXYGEN_SATURATION = 5
        const val TEMPERATURE = 6
        const val WEIGHT = 7
        const val STEPS = 8
        const val SLEEP_DURATION = 9
    }
}
