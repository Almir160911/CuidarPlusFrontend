export const ConnectedDeviceType = {
  SmartWatch: 1,
  BloodPressureMonitor: 2,
  GlucoseMeter: 3,
  PulseOximeter: 4,
  Thermometer: 5,
  WeightScale: 6,
  Smartphone: 7,
  Other: 99,
} as const

export type ConnectedDeviceType =
  typeof ConnectedDeviceType[
    keyof typeof ConnectedDeviceType
  ]

export const DeviceConnectionStatus = {
  Pending: 1,
  Connected: 2,
  Disconnected: 3,
  Error: 4,
  Disabled: 5,
} as const

export type DeviceConnectionStatus =
  typeof DeviceConnectionStatus[
    keyof typeof DeviceConnectionStatus
  ]

export const connectedDeviceTypeLabels:
  Record<ConnectedDeviceType, string> = {
    [ConnectedDeviceType.SmartWatch]:
      'Smartwatch',
    [ConnectedDeviceType.BloodPressureMonitor]:
      'Medidor de pressão',
    [ConnectedDeviceType.GlucoseMeter]:
      'Glicosímetro',
    [ConnectedDeviceType.PulseOximeter]:
      'Oxímetro',
    [ConnectedDeviceType.Thermometer]:
      'Termômetro',
    [ConnectedDeviceType.Smartphone]:
      'Celular',
    [ConnectedDeviceType.WeightScale]:
      'Balança',
    [ConnectedDeviceType.Other]:
      'Outro',
  }

export const deviceConnectionStatusLabels:
  Record<DeviceConnectionStatus, string> = {
    [DeviceConnectionStatus.Pending]:
      'Aguardando sincronização',
    [DeviceConnectionStatus.Connected]:
      'Sincronizado',
    [DeviceConnectionStatus.Disconnected]:
      'Sem sincronização',
    [DeviceConnectionStatus.Error]:
      'Erro na sincronização',
    [DeviceConnectionStatus.Disabled]:
      'Desativado',
  }

export interface ConnectedDevice {
  id: string
  organizationId: string
  elderlyPersonId: string
  type: ConnectedDeviceType
  name: string
  manufacturer: string
  model?: string | null
  provider: string
  externalDeviceId?: string | null
  status: DeviceConnectionStatus
  lastSyncAt?: string | null
  lastError?: string | null
  createdAt: string
  updatedAt?: string | null
}

export interface CreateConnectedDeviceRequest {
  elderlyPersonId: string
  type: ConnectedDeviceType
  name: string
  manufacturer: string
  provider: string
  model?: string | null
  externalDeviceId?: string | null
}

export interface DeviceMeasurement {
  id: string
  connectedDeviceId: string
  elderlyPersonId: string
  type: string | number
  value: number
  unit: string
  measuredAt: string
}

export interface DeviceSyncResult {
  syncLogId: string
  connectedDeviceId: string
  status: string | number
  measurementsImported: number
  startedAt: string
  finishedAt?: string | null
  measurements: DeviceMeasurement[]
}

export interface ConnectedDevicePagedResult {
  items: ConnectedDevice[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}