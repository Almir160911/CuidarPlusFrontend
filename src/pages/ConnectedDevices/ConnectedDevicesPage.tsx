import {
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Watch,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { ConnectedDeviceForm } from '../../components/connected-devices/ConnectedDeviceForm'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingList } from '../../components/ui/LoadingList'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'

import { connectedDeviceService } from '../../services/connected-device.service'
import { elderlyService } from '../../services/elderly.service'

import {
  DeviceConnectionStatus,
  connectedDeviceTypeLabels,
  deviceConnectionStatusLabels,
  type ConnectedDevice,
  type CreateConnectedDeviceRequest,
} from '../../types/connected-device'
import type { ElderlyPerson } from '../../types/elderly'

import { getApiErrorMessage } from '../../utils/api-error'

function formatDate(value?: string | null) {
  if (!value) {
    return 'Nunca sincronizado'
  }

  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      dateStyle: 'short',
      timeStyle: 'short',
    },
  ).format(new Date(value))
}

function getStatusClass(
  status: DeviceConnectionStatus,
) {
  switch (status) {
    case DeviceConnectionStatus.Connected:
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'

    case DeviceConnectionStatus.Pending:
      return 'border-amber-200 bg-amber-50 text-amber-700'

    case DeviceConnectionStatus.Error:
      return 'border-red-200 bg-red-50 text-red-700'

    case DeviceConnectionStatus.Disabled:
      return 'border-slate-200 bg-slate-100 text-slate-600'

    default:
      return 'border-blue-200 bg-blue-50 text-blue-700'
  }
}

export function ConnectedDevicesPage() {
  const [devices, setDevices] =
    useState<ConnectedDevice[]>([])

  const [elderlyPeople, setElderlyPeople] =
    useState<ElderlyPerson[]>([])

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  const [processingId, setProcessingId] =
    useState<string | null>(null)

  const [modalOpen, setModalOpen] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const [error, setError] =
    useState('')

  const loadData = useCallback(
    async () => {
      setLoading(true)
      setError('')

      try {
        const [
          deviceResult,
          elderlyResult,
        ] = await Promise.all([
          connectedDeviceService.list(),
          elderlyService.list({
            page: 1,
            pageSize: 100,
          }),
        ])

        setDevices(deviceResult.items)
        setElderlyPeople(
          elderlyResult.items,
        )
      } catch (caughtError) {
        setError(
          getApiErrorMessage(
            caughtError,
            'Não foi possível carregar os dispositivos.',
          ),
        )
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    void loadData()
  }, [loadData])

  const elderlyNames = useMemo(() => {
    const result: Record<string, string> = {}

    elderlyPeople.forEach((elderly) => {
      if (elderly.id) {
        result[elderly.id] =
          elderly.fullName ??
          'Idoso sem nome'
      }
    })

    return result
  }, [elderlyPeople])

  async function handleCreate(
    payload: CreateConnectedDeviceRequest,
  ) {
    setSubmitting(true)
    setMessage('')
    setError('')

    try {
      await connectedDeviceService.create(
        payload,
      )

      setModalOpen(false)
      setMessage(
        'Dispositivo cadastrado com sucesso.',
      )

      await loadData()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggleStatus(
    device: ConnectedDevice,
  ) {
    setProcessingId(device.id)
    setMessage('')
    setError('')

    try {
      if (
        device.status ===
        DeviceConnectionStatus.Disabled
      ) {
        await connectedDeviceService.activate(
          device.id,
        )

        setMessage(
          'Dispositivo ativado com sucesso.',
        )
      } else {
        await connectedDeviceService.disable(
          device.id,
        )

        setMessage(
          'Dispositivo desativado com sucesso.',
        )
      }

      await loadData()
    } catch (caughtError) {
      setError(
        getApiErrorMessage(
          caughtError,
          'Não foi possível alterar o dispositivo.',
        ),
      )
    } finally {
      setProcessingId(null)
    }
  }

  async function handleSynchronize(
    device: ConnectedDevice,
  ) {
    setProcessingId(device.id)
    setMessage('')
    setError('')

    try {
      const result =
        await connectedDeviceService
          .synchronize(device.id)

      setMessage(
        `Demonstração concluída para ${device.name}: ${result.measurementsImported} medição(ões) importada(s).`,
      )

      await loadData()
    } catch (caughtError) {
      setError(
        getApiErrorMessage(
          caughtError,
          'Não foi possível sincronizar o dispositivo.',
        ),
      )
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Monitoramento digital"
        title="Dispositivos conectados"
        description="Gerencie os equipamentos e acompanhe quando cada um enviou dados pela última vez."
        actions={
          <Button
            type="button"
            onClick={() =>
              setModalOpen(true)
            }
          >
            <Plus size={18} />
            Novo dispositivo
          </Button>
        }
      />

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingList />
      ) : devices.length === 0 ? (
        <EmptyState
          icon={<Watch size={24} />}
          title="Nenhum dispositivo cadastrado"
          description="Cadastre o primeiro equipamento usando o botão Novo dispositivo."
        />
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {devices.map((device) => {
            const isProcessing =
              processingId === device.id

            const isDisabled =
              device.status ===
              DeviceConnectionStatus.Disabled

            const typeLabel =
              connectedDeviceTypeLabels[
                device.type
              ] ??
              `Tipo ${device.type}`

            const statusLabel =
              deviceConnectionStatusLabels[
                device.status
              ] ??
              `Status ${device.status}`

            return (
              <Card
                key={device.id}
                className="p-6"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <Watch size={22} />
                      </div>

                      <div>
                        <h2 className="font-semibold text-slate-900">
                          {device.name}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {typeLabel}
                        </p>
                      </div>
                    </div>

                    <span
                      className={[
                        'rounded-full border px-3 py-1 text-xs font-semibold',
                        getStatusClass(
                          device.status,
                        ),
                      ].join(' ')}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <dl className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-500">
                        Idoso
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {elderlyNames[
                          device.elderlyPersonId
                        ] ??
                          'Idoso não localizado'}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">
                        Fabricante e modelo
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {device.manufacturer}
                        {device.model
                          ? ` ${device.model}`
                          : ''}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">
                        Provedor
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {device.provider}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">
                        Última sincronização
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {formatDate(
                          device.lastSyncAt,
                        )}
                      </dd>
                    </div>
                  </dl>

                  {device.lastError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {device.lastError}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-end gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={
                        isProcessing ||
                        isDisabled
                      }
                      onClick={() =>
                        void handleSynchronize(
                          device,
                        )
                      }
                    >
                      <RefreshCw
                        size={17}
                        className={
                          isProcessing
                            ? 'animate-spin'
                            : ''
                        }
                      />
                      Simular sincronização
                    </Button>

                    <Button
                      type="button"
                      variant={
                        isDisabled
                          ? 'primary'
                          : 'danger'
                      }
                      disabled={isProcessing}
                      onClick={() =>
                        void handleToggleStatus(
                          device,
                        )
                      }
                    >
                      {isDisabled ? (
                        <>
                          <Power size={17} />
                          Ativar
                        </>
                      ) : (
                        <>
                          <PowerOff size={17} />
                          Desativar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </section>
      )}

      <Modal
        open={modalOpen}
        title="Cadastrar dispositivo"
        description="Associe um equipamento de monitoramento a um idoso."
        maxWidth="max-w-3xl"
        onClose={() => {
          if (!submitting) {
            setModalOpen(false)
          }
        }}
      >
        <ConnectedDeviceForm
          elderlyPeople={elderlyPeople}
          submitting={submitting}
          onCancel={() =>
            setModalOpen(false)
          }
          onSubmit={handleCreate}
        />
      </Modal>
    </div>
  )
}
