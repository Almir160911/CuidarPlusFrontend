import {
  Capacitor,
  registerPlugin,
} from '@capacitor/core'

import { api } from './api'
import { connectedDeviceService } from './connected-device.service'

import {
  unwrapApiResponse,
  type ApiResponse,
} from '../types/api-response'
import {
  ConnectedDeviceType,
  type ConnectedDevice,
} from '../types/connected-device'
import type {
  HealthCompatibility,
  HealthPlatform,
  HealthProvider,
  HealthSyncRequest,
  HealthSyncResult,
  ImportHealthMeasurementsResponse,
  NativeHealthMeasurement,
  NativeHealthBridge,
} from '../types/health-integration'

const FIRST_SYNC_DAYS = 30
const SYNC_OVERLAP_MINUTES = 5
const SYNC_STORAGE_PREFIX =
  'cuidarplus_health_sync_'

const nativeBridge =
  registerPlugin<NativeHealthBridge>(
    'HealthIntegration',
  )

function detectPlatform(): HealthPlatform {
  if (Capacitor.isNativePlatform()) {
    const platform =
      Capacitor.getPlatform()
        .toLowerCase()

    if (platform === 'android') {
      return 'android'
    }

    if (platform === 'ios') {
      return 'ios'
    }
  }

  const userAgent =
    navigator.userAgent.toLowerCase()

  if (userAgent.includes('android')) {
    return 'android'
  }

  if (
    userAgent.includes('iphone') ||
    userAgent.includes('ipad') ||
    userAgent.includes('ipod')
  ) {
    return 'ios'
  }

  return 'web'
}

function isNativeApplication(): boolean {
  return Capacitor.isNativePlatform()
}

function getProvider(
  platform: HealthPlatform,
): HealthProvider {
  if (platform === 'android') {
    return 'health-connect'
  }

  if (platform === 'ios') {
    return 'health-kit'
  }

  return 'none'
}

function createBrowserCompatibility():
  HealthCompatibility {
  const platform = detectPlatform()
  const provider = getProvider(platform)

  if (platform === 'android') {
    return {
      platform,
      provider,
      nativeApplication: false,
      available: false,
      permissionStatus: 'unavailable',
      operatingSystem: 'Android',
      message:
        'O aparelho usa Android, mas o CuidarPlus está aberto no navegador. Instale a versão Android para acessar o Health Connect.',
    }
  }

  if (platform === 'ios') {
    return {
      platform,
      provider,
      nativeApplication: false,
      available: false,
      permissionStatus: 'unavailable',
      operatingSystem: 'iOS',
      message:
        'O aparelho usa iOS, mas o CuidarPlus está aberto no navegador. Instale a versão para iPhone para acessar o HealthKit.',
    }
  }

  return {
    platform: 'web',
    provider: 'none',
    nativeApplication: false,
    available: false,
    permissionStatus: 'unavailable',
    operatingSystem: null,
    message:
      'A gestão pode ser realizada pela web. A leitura de dados de saúde requer o CuidarPlus instalado em um celular Android ou iPhone.',
  }
}

function getSyncStorageKey(
  connectedDeviceId: string,
): string {
  return (
    SYNC_STORAGE_PREFIX +
    connectedDeviceId
  )
}

function getReadPeriod(
  connectedDeviceId: string,
): {
  since: string
  until: string
} {
  const until = new Date()
  const storedValue =
    localStorage.getItem(
      getSyncStorageKey(
        connectedDeviceId,
      ),
    )

  let since: Date

  if (storedValue) {
    const storedDate =
      new Date(storedValue)

    if (
      !Number.isNaN(
        storedDate.getTime(),
      )
    ) {
      since = new Date(
        storedDate.getTime() -
          SYNC_OVERLAP_MINUTES *
            60 *
            1000,
      )

      return {
        since: since.toISOString(),
        until: until.toISOString(),
      }
    }
  }

  since = new Date(
    until.getTime() -
      FIRST_SYNC_DAYS *
        24 *
        60 *
        60 *
        1000,
  )

  return {
    since: since.toISOString(),
    until: until.toISOString(),
  }
}

function saveSuccessfulSync(
  connectedDeviceId: string,
  synchronizedAt: string,
): void {
  localStorage.setItem(
    getSyncStorageKey(
      connectedDeviceId,
    ),
    synchronizedAt,
  )
}

interface HealthSourceMetadata {
  sourceDeviceManufacturer?: string | null
  sourceDeviceModel?: string | null
  sourceDeviceCategory?: string | null
}

function normalizeDeviceValue(
  value?: string | null,
): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function getSourceMetadata(
  measurement: NativeHealthMeasurement,
): HealthSourceMetadata | null {
  if (!measurement.metadataJson) {
    return null
  }

  try {
    return JSON.parse(
      measurement.metadataJson,
    ) as HealthSourceMetadata
  } catch {
    return null
  }
}

function isCompatibleWithDevice(
  measurement: NativeHealthMeasurement,
  device: HealthSyncRequest['connectedDevice'],
): boolean {
  const metadata =
    getSourceMetadata(measurement)

  const sourceModel =
    normalizeDeviceValue(
      metadata?.sourceDeviceModel,
    )

  const registeredModels = [
    device.model,
    device.externalDeviceId,
  ]
    .map(normalizeDeviceValue)
    .filter(Boolean)

  if (
    !sourceModel ||
    registeredModels.length === 0
  ) {
    return false
  }

  const modelMatches =
    registeredModels.some(
      (registeredModel) =>
        registeredModel === sourceModel ||
        registeredModel.includes(sourceModel) ||
        sourceModel.includes(registeredModel),
    )

  if (!modelMatches) {
    return false
  }

  const sourceManufacturer =
    normalizeDeviceValue(
      metadata?.sourceDeviceManufacturer,
    )

  const registeredManufacturer =
    normalizeDeviceValue(
      device.manufacturer,
    )

  return (
    !sourceManufacturer ||
    !registeredManufacturer ||
    sourceManufacturer.includes(
      registeredManufacturer,
    ) ||
    registeredManufacturer.includes(
      sourceManufacturer,
    )
  )
}

function isPhoneMeasurement(
  measurement: NativeHealthMeasurement,
): boolean {
  return (
    getSourceMetadata(measurement)
      ?.sourceDeviceCategory === 'phone'
  )
}

function findPhoneDevice(
  devices: ConnectedDevice[],
  externalDeviceId: string,
): ConnectedDevice | undefined {
  return devices.find(
    (device) =>
      device.provider
        .trim()
        .toLowerCase() ===
        'healthconnect' &&
      device.externalDeviceId ===
        externalDeviceId,
  )
}

async function getOrCreatePhoneDevice(
  elderlyPersonId: string,
  compatibility: HealthCompatibility,
): Promise<ConnectedDevice> {
  const externalDeviceId =
    compatibility.deviceExternalId
  const manufacturer =
    compatibility.deviceManufacturer
  const model = compatibility.deviceModel

  if (
    !externalDeviceId ||
    !manufacturer ||
    !model
  ) {
    throw new Error(
      'Não foi possível identificar este celular.',
    )
  }

  const devices =
    await connectedDeviceService
      .listByElderly(elderlyPersonId)

  const existingDevice =
    findPhoneDevice(
      devices,
      externalDeviceId,
    )

  if (existingDevice) {
    return existingDevice
  }

  try {
    return await connectedDeviceService.create({
      elderlyPersonId,
      type: ConnectedDeviceType.Smartphone,
      name: `Celular ${manufacturer} ${model}`,
      manufacturer,
      provider: 'HealthConnect',
      model,
      externalDeviceId,
    })
  } catch (caughtError) {
    const refreshedDevices =
      await connectedDeviceService
        .listByElderly(elderlyPersonId)

    const concurrentlyCreatedDevice =
      findPhoneDevice(
        refreshedDevices,
        externalDeviceId,
      )

    if (concurrentlyCreatedDevice) {
      return concurrentlyCreatedDevice
    }

    throw caughtError
  }
}

function describeMeasurementSource(
  measurement: NativeHealthMeasurement,
): string {
  const metadata =
    getSourceMetadata(measurement)

  return [
    metadata?.sourceDeviceManufacturer,
    metadata?.sourceDeviceModel,
  ]
    .filter(Boolean)
    .join(' ') ||
    'origem não identificada'
}

async function importMeasurements(
  deviceId: string,
  measurements: NativeHealthMeasurement[],
): Promise<ImportHealthMeasurementsResponse> {
  const response = await api.post<
    | ApiResponse<
        ImportHealthMeasurementsResponse
      >
    | ImportHealthMeasurementsResponse
  >(
    `/api/device-sync/${deviceId}/measurements`,
    { measurements },
  )

  return unwrapApiResponse(response.data)
}


export const healthIntegrationService = {
  detectPlatform,

  isNativeApplication,

  async getCompatibility():
    Promise<HealthCompatibility> {
    if (!isNativeApplication()) {
      return createBrowserCompatibility()
    }

    return nativeBridge
      .getCompatibility()
  },

  async openHealthConnectSettings():
    Promise<void> {
    if (!isNativeApplication()) {
      throw new Error(
        'O Health Connect somente pode ser aberto pelo CuidarPlus instalado no Android.',
      )
    }

    return nativeBridge
      .openHealthConnectSettings()
  },


  async requestPermissions():
    Promise<HealthCompatibility> {
    if (!isNativeApplication()) {
      throw new Error(
        'As permissões de saúde somente podem ser solicitadas pelo CuidarPlus instalado no celular.',
      )
    }

    return nativeBridge
      .requestHealthPermissions()
  },

  async synchronize(
    request: HealthSyncRequest,
  ): Promise<HealthSyncResult> {
    if (!isNativeApplication()) {
      throw new Error(
        'A sincronização com dados reais requer o CuidarPlus instalado no celular.',
      )
    }

    if (
      !request.elderlyPersonId ||
      !request.connectedDevice.id
    ) {
      throw new Error(
        'Selecione a pessoa e o dispositivo antes de sincronizar.',
      )
    }

    const readPeriod =
      getReadPeriod(
        request.connectedDevice.id,
      )

    const nativeResult =
      await nativeBridge
        .readMeasurements(
          readPeriod,
        )

    const measurements =
      Array.isArray(
        nativeResult.measurements,
      )
        ? nativeResult.measurements
        : []

    const synchronizedAt =
      new Date().toISOString()

    if (measurements.length === 0) {
      localStorage.removeItem(
        getSyncStorageKey(
          request.connectedDevice.id,
        ),
      )

      return {
        measurementsReceived: 0,
        measurementsImported: 0,
        measurementsIgnored: 0,
        synchronizedAt,
      }
    }

    let phoneMeasurements =
      measurements.filter(isPhoneMeasurement)

    const selectedMeasurements =
      measurements.filter(
        (measurement) =>
          !isPhoneMeasurement(measurement) &&
          isCompatibleWithDevice(
            measurement,
            request.connectedDevice,
          ),
      )

    const selectedMeasurementTypes =
      new Set(
        selectedMeasurements.map(
          (measurement) => measurement.type,
        ),
      )

    phoneMeasurements =
      phoneMeasurements.filter(
        (measurement) =>
          !selectedMeasurementTypes.has(
            measurement.type,
          ),
      )


    const batches: Array<{
      deviceId: string
      measurements: NativeHealthMeasurement[]
    }> = []

    if (selectedMeasurements.length > 0) {
      batches.push({
        deviceId: request.connectedDevice.id,
        measurements: selectedMeasurements,
      })
    }

    if (phoneMeasurements.length > 0) {
      const compatibility =
        await nativeBridge.getCompatibility()

      const phoneDevice =
        await getOrCreatePhoneDevice(
          request.elderlyPersonId,
          compatibility,
        )

      batches.push({
        deviceId: phoneDevice.id,
        measurements: phoneMeasurements,
      })
    }

    if (batches.length === 0) {
      localStorage.removeItem(
        getSyncStorageKey(
          request.connectedDevice.id,
        ),
      )

      const detectedSources =
        Array.from(
          new Set(
            measurements.map(
              describeMeasurementSource,
            ),
          ),
        ).join(", ")

      throw new Error(
        `As medições encontradas pertencem a ${detectedSources} e não correspondem a uma origem cadastrada.`,
      )
    }

    let measurementsImported = 0
    let measurementsIgnored =
      measurements.length -
      selectedMeasurements.length -
      phoneMeasurements.length
    let finishedAt = synchronizedAt

    for (const batch of batches) {
      const result =
        await importMeasurements(
          batch.deviceId,
          batch.measurements,
        )

      measurementsImported +=
        result.measurementsImported
      measurementsIgnored +=
        result.measurementsIgnored

      if (result.finishedAt) {
        finishedAt = result.finishedAt
      }
    }

    saveSuccessfulSync(
      request.connectedDevice.id,
      finishedAt,
    )

    return {
      measurementsReceived:
        measurements.length,
      measurementsImported,
      measurementsIgnored,
      synchronizedAt: finishedAt,
    }
  },
}