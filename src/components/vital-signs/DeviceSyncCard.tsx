import {
  RefreshCw,
  Watch,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { connectedDeviceService } from '../../services/connected-device.service'
import { getApiErrorMessage } from '../../utils/api-error'

import type { ConnectedDevice } from '../../types/connected-device'

interface DeviceSyncCardProps {
  onSynchronized: () => Promise<void>
}

function formatDate(value?: string | null) {
  if (!value) {
    return 'Nunca sincronizado'
  }

  return new Date(value).toLocaleString(
    'pt-BR',
  )
}

export function DeviceSyncCard({
  onSynchronized,
}: DeviceSyncCardProps) {
  const [devices, setDevices] = useState<
    ConnectedDevice[]
  >([])

  const [deviceId, setDeviceId] =
    useState('')

  const [loadingDevices, setLoadingDevices] =
    useState(true)

  const [synchronizing, setSynchronizing] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const [error, setError] =
    useState('')

  async function loadDevices() {
    setLoadingDevices(true)
    setError('')

    try {
      const result =
        await connectedDeviceService.list()

      setDevices(result.items)

      setDeviceId((current) => {
        if (
          current &&
          result.items.some(
            (device) =>
              device.id === current,
          )
        ) {
          return current
        }

        return result.items[0]?.id ?? ''
      })
    } catch (caughtError) {
      setError(
        getApiErrorMessage(
          caughtError,
          'Não foi possível carregar os dispositivos.',
        ),
      )
    } finally {
      setLoadingDevices(false)
    }
  }

  async function synchronize() {
    if (!deviceId) {
      setError(
        'Selecione um dispositivo.',
      )
      return
    }

    setSynchronizing(true)
    setMessage('')
    setError('')

    try {
      const result =
        await connectedDeviceService
          .synchronizeMock(deviceId)

      setMessage(
        `Demonstração concluída: ${result.measurementsImported} medição(ões) importada(s).`,
      )

      await loadDevices()
      await onSynchronized()
    } catch (caughtError) {
      setError(
        getApiErrorMessage(
          caughtError,
          'Não foi possível sincronizar o dispositivo.',
        ),
      )
    } finally {
      setSynchronizing(false)
    }
  }

  useEffect(() => {
    void loadDevices()
  }, [])

  const selectedDevice =
    devices.find(
      (device) =>
        device.id === deviceId,
    ) ?? null

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <Watch
              size={20}
              className="text-emerald-600"
            />

            <div>
              <h2 className="font-semibold text-slate-900">
                Sincronização de demonstração
              </h2>

              <p className="text-sm text-slate-500">
                Simule a importação de medições do dispositivo selecionado.
              </p>
            </div>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Dispositivo

            <select
              value={deviceId}
              disabled={
                loadingDevices ||
                synchronizing
              }
              onChange={(event) =>
                setDeviceId(
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
            >
              {devices.length === 0 && (
                <option value="">
                  Nenhum dispositivo cadastrado
                </option>
              )}

              {devices.map((device) => (
                <option
                  key={device.id}
                  value={device.id}
                >
                  {device.name} — {device.manufacturer}
                  {device.model
                    ? ` ${device.model}`
                    : ''}
                </option>
              ))}
            </select>
          </label>

          {selectedDevice && (
            <p className="mt-2 text-xs text-slate-500">
              Última sincronização:{' '}
              {formatDate(
                selectedDevice.lastSyncAt,
              )}
            </p>
          )}
        </div>

        <Button
          type="button"
          disabled={
            loadingDevices ||
            synchronizing ||
            !deviceId
          }
          onClick={() =>
            void synchronize()
          }
        >
          <RefreshCw
            size={17}
            className={
              synchronizing
                ? 'animate-spin'
                : ''
            }
          />

          {synchronizing
            ? 'Sincronizando...'
            : 'Simular sincronização'}
        </Button>
      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </Card>
  )
}
