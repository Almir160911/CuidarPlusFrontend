export type HealthPlatform =
  | 'web'
  | 'android'
  | 'ios'

export type HealthProvider =
  | 'none'
  | 'health-connect'
  | 'health-kit'

export type HealthPermissionStatus =
  | 'unavailable'
  | 'not-requested'
  | 'partial'
  | 'granted'
  | 'denied'

export interface HealthCompatibility {
  platform: HealthPlatform
  provider: HealthProvider
  nativeApplication: boolean
  available: boolean
  permissionStatus: HealthPermissionStatus
  deviceName?: string | null
  operatingSystem?: string | null
  message: string
}

export interface HealthSyncRequest {
  elderlyPersonId: string
  connectedDeviceId: string
}

export interface NativeHealthReadRequest {
  since: string
  until: string
}

export interface NativeHealthMeasurement {
  type: number
  value: number
  unit: string
  measuredAt: string
  externalMeasurementId: string
  metadataJson?: string | null
}

export interface NativeHealthReadResult {
  measurements: NativeHealthMeasurement[]
}

export interface ImportHealthMeasurementsResponse {
  syncLogId: string
  connectedDeviceId: string
  status: string | number
  measurementsReceived: number
  measurementsImported: number
  measurementsIgnored: number
  startedAt: string
  finishedAt?: string | null
}

export interface HealthSyncResult {
  measurementsReceived: number
  measurementsImported: number
  measurementsIgnored: number
  synchronizedAt: string
}

export interface NativeHealthBridge {
  getCompatibility():
    Promise<HealthCompatibility>

  requestHealthPermissions():
    Promise<HealthCompatibility>

  readMeasurements(
    request: NativeHealthReadRequest,
  ): Promise<NativeHealthReadResult>
}