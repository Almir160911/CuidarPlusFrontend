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

export interface HealthSyncResult {
  measurementsReceived: number
  measurementsImported: number
  measurementsIgnored: number
  synchronizedAt: string
}

export interface NativeHealthBridge {
  getCompatibility():
    Promise<HealthCompatibility>

  requestPermissions():
    Promise<HealthCompatibility>

  synchronize(
    request: HealthSyncRequest,
  ): Promise<HealthSyncResult>
}
