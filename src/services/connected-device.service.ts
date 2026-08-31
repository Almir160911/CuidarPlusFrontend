import { api } from './api'
import {
  unwrapApiResponse,
  type ApiResponse,
} from '../types/api-response'

import type {
  ConnectedDevice,
  ConnectedDevicePagedResult,
  CreateConnectedDeviceRequest,
  DeviceSyncResult,
} from '../types/connected-device'

function normalizePagedResult(
  value:
    | ConnectedDevicePagedResult
    | ConnectedDevice[],
): ConnectedDevicePagedResult {
  if (Array.isArray(value)) {
    return {
      items: value,
      page: 1,
      pageSize: value.length,
      totalItems: value.length,
      totalPages: 1,
    }
  }

  const items = Array.isArray(value.items)
    ? value.items
    : []

  return {
    items,
    page: value.page ?? 1,
    pageSize: value.pageSize ?? 100,
    totalItems:
      value.totalItems ?? items.length,
    totalPages: value.totalPages ?? 1,
  }
}

export const connectedDeviceService = {
  async list():
    Promise<ConnectedDevicePagedResult> {
    const response = await api.get<
      | ApiResponse<ConnectedDevicePagedResult>
      | ConnectedDevicePagedResult
    >('/api/connected-devices', {
      params: {
        page: 1,
        pageSize: 100,
      },
    })

    return normalizePagedResult(
      unwrapApiResponse(response.data),
    )
  },

  async listByElderly(
    elderlyPersonId: string,
  ): Promise<ConnectedDevice[]> {
    const response = await api.get<
      | ApiResponse<ConnectedDevice[]>
      | ConnectedDevice[]
    >(
      `/api/connected-devices/elderly/${elderlyPersonId}`,
    )

    return unwrapApiResponse(response.data)
  },

  async create(
    payload: CreateConnectedDeviceRequest,
  ): Promise<ConnectedDevice> {
    const response = await api.post<
      | ApiResponse<ConnectedDevice>
      | ConnectedDevice
    >(
      '/api/connected-devices',
      payload,
    )

    return unwrapApiResponse(response.data)
  },

  async activate(
    deviceId: string,
  ): Promise<ConnectedDevice> {
    const response = await api.patch<
      | ApiResponse<ConnectedDevice>
      | ConnectedDevice
    >(
      `/api/connected-devices/${deviceId}/activate`,
    )

    return unwrapApiResponse(response.data)
  },

  async disable(
    deviceId: string,
  ): Promise<ConnectedDevice> {
    const response = await api.patch<
      | ApiResponse<ConnectedDevice>
      | ConnectedDevice
    >(
      `/api/connected-devices/${deviceId}/disable`,
    )

    return unwrapApiResponse(response.data)
  },

  async synchronizeMock(
    deviceId: string,
  ): Promise<DeviceSyncResult> {
    const response = await api.post<
      | ApiResponse<DeviceSyncResult>
      | DeviceSyncResult
    >(`/api/device-sync/mock/${deviceId}`)

    return unwrapApiResponse(response.data)
  },
}