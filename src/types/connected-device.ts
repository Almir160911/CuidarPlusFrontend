export interface ConnectedDevice {
  id: string
  organizationId: string
  elderlyPersonId: string
  type: string | number
  name: string
  manufacturer: string
  model?: string | null
  provider: string
  externalDeviceId?: string | null
  status: string | number
  lastSyncAt?: string | null
  lastError?: string | null
  createdAt: string
  updatedAt?: string | null
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
