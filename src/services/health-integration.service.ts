import {
  Capacitor,
  registerPlugin,
} from '@capacitor/core'

import { api } from './api'

import {
  unwrapApiResponse,
  type ApiResponse,
} from '../types/api-response'

import type {
  HealthCompatibility,
  HealthPlatform,
  HealthProvider,
  HealthSyncRequest,
  HealthSyncResult,
  ImportHealthMeasurementsResponse,
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
      !request.connectedDeviceId
    ) {
      throw new Error(
        'Selecione a pessoa e o dispositivo antes de sincronizar.',
      )
    }

    const readPeriod =
      getReadPeriod(
        request.connectedDeviceId,
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
      saveSuccessfulSync(
        request.connectedDeviceId,
        synchronizedAt,
      )

      return {
        measurementsReceived: 0,
        measurementsImported: 0,
        measurementsIgnored: 0,
        synchronizedAt,
      }
    }

    const response = await api.post<
      | ApiResponse<
          ImportHealthMeasurementsResponse
        >
      | ImportHealthMeasurementsResponse
    >(
      `/api/device-sync/${request.connectedDeviceId}/measurements`,
      {
        measurements,
      },
    )

    const result =
      unwrapApiResponse(
        response.data,
      )

    const finishedAt =
      result.finishedAt ??
      synchronizedAt

    saveSuccessfulSync(
      request.connectedDeviceId,
      finishedAt,
    )

    return {
      measurementsReceived:
        result.measurementsReceived,
      measurementsImported:
        result.measurementsImported,
      measurementsIgnored:
        result.measurementsIgnored,
      synchronizedAt: finishedAt,
    }
  },
}