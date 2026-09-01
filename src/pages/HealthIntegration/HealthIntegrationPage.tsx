import {
  Activity,
  CircleAlert,
  CircleCheck,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Watch,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { LoadingList } from '../../components/ui/LoadingList'
import { PageHeader } from '../../components/ui/PageHeader'

import { connectedDeviceService } from '../../services/connected-device.service'
import { elderlyService } from '../../services/elderly.service'
import { healthIntegrationService } from '../../services/health-integration.service'

import {
  connectedDeviceTypeLabels,
  DeviceConnectionStatus,
  type ConnectedDevice,
} from '../../types/connected-device'
import type { ElderlyPerson } from '../../types/elderly'
import type {
  HealthCompatibility,
  HealthPermissionStatus,
  HealthPlatform,
  HealthProvider,
  HealthSyncResult,
} from '../../types/health-integration'

import { getApiErrorMessage } from '../../utils/api-error'

const selectClassName =
  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100'

function getPlatformLabel(
  platform: HealthPlatform,
) {
  switch (platform) {
    case 'android':
      return 'Android'

    case 'ios':
      return 'iOS'

    default:
      return 'Navegador web'
  }
}

function getProviderLabel(
  provider: HealthProvider,
) {
  switch (provider) {
    case 'health-connect':
      return 'Health Connect'

    case 'health-kit':
      return 'Apple Health / HealthKit'

    default:
      return 'Nenhum provedor nativo'
  }
}

function getPermissionLabel(
  status: HealthPermissionStatus,
) {
  switch (status) {
    case 'granted':
      return 'Permissões concedidas'

    case 'partial':
      return 'Permissões parciais'

    case 'denied':
      return 'Permissões negadas'

    case 'not-requested':
      return 'Aguardando autorização'

    default:
      return 'Indisponível neste ambiente'
  }
}

function getPermissionClass(
  status: HealthPermissionStatus,
) {
  switch (status) {
    case 'granted':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'

    case 'partial':
    case 'not-requested':
      return 'border-amber-200 bg-amber-50 text-amber-700'

    case 'denied':
      return 'border-red-200 bg-red-50 text-red-700'

    default:
      return 'border-slate-200 bg-slate-100 text-slate-600'
  }
}

function formatDate(
  value?: string | null,
) {
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

export function HealthIntegrationPage() {
  const [searchParams] = useSearchParams()

  const [elderlyPeople, setElderlyPeople] =
    useState<ElderlyPerson[]>([])

  const [devices, setDevices] =
    useState<ConnectedDevice[]>([])

  const [
    compatibility,
    setCompatibility,
  ] = useState<HealthCompatibility | null>(
    null,
  )

  const [
    elderlyPersonId,
    setElderlyPersonId,
  ] = useState('')

  const [deviceId, setDeviceId] =
    useState('')

  const [syncResult, setSyncResult] =
    useState<HealthSyncResult | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [checking, setChecking] =
    useState(false)

  const [requesting, setRequesting] =
    useState(false)

  const [synchronizing, setSynchronizing] =
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
          elderlyResult,
          deviceResult,
          compatibilityResult,
        ] = await Promise.all([
          elderlyService.list({
            page: 1,
            pageSize: 100,
          }),
          connectedDeviceService.list(),
          healthIntegrationService
            .getCompatibility(),
        ])

        setElderlyPeople(
          elderlyResult.items,
        )

        setDevices(deviceResult.items)

        setCompatibility(
          compatibilityResult,
        )

        const requestedDeviceId =
          searchParams.get('deviceId')

        const requestedDevice =
          deviceResult.items.find(
            (device) =>
              device.id ===
              requestedDeviceId,
          )

        if (requestedDevice) {
          setElderlyPersonId(
            requestedDevice.elderlyPersonId,
          )

          setDeviceId(
            requestedDevice.id,
          )

          return
        }

        const firstDevice =
          deviceResult.items[0]

        if (firstDevice) {
          setElderlyPersonId(
            firstDevice.elderlyPersonId,
          )

          setDeviceId(firstDevice.id)
          return
        }

        const firstElderly =
          elderlyResult.items.find(
            (elderly) => elderly.id,
          )

        setElderlyPersonId(
          firstElderly?.id ?? '',
        )
      } catch (caughtError) {
        setError(
          getApiErrorMessage(
            caughtError,
            'Não foi possível carregar a integração de saúde.',
          ),
        )
      } finally {
        setLoading(false)
      }
    },
    [searchParams],
  )

  useEffect(() => {
    void loadData()
  }, [loadData])

  const availableDevices =
    useMemo(
      () =>
        devices.filter(
          (device) =>
            device.elderlyPersonId ===
              elderlyPersonId &&
            device.status !==
              DeviceConnectionStatus.Disabled,
        ),
      [devices, elderlyPersonId],
    )

  const selectedDevice =
    useMemo(
      () =>
        devices.find(
          (device) =>
            device.id === deviceId,
        ) ?? null,
      [devices, deviceId],
    )

  function handleElderlyChange(
    value: string,
  ) {
    setElderlyPersonId(value)
    setSyncResult(null)
    setMessage('')
    setError('')

    const firstDeviceForElderly =
      devices.find(
        (device) =>
          device.elderlyPersonId ===
            value &&
          device.status !==
            DeviceConnectionStatus.Disabled,
      )

    setDeviceId(
      firstDeviceForElderly?.id ?? '',
    )
  }

  async function checkCompatibility() {
    setChecking(true)
    setMessage('')
    setError('')

    try {
      const result =
        await healthIntegrationService
          .getCompatibility()

      setCompatibility(result)

      setMessage(
        'Compatibilidade verificada.',
      )
    } catch (caughtError) {
      setError(
        getApiErrorMessage(
          caughtError,
          'Não foi possível verificar a compatibilidade.',
        ),
      )
    } finally {
      setChecking(false)
    }
  }

  async function requestPermissions() {
    setRequesting(true)
    setMessage('')
    setError('')

    try {
      const result =
        await healthIntegrationService
          .requestPermissions()

      setCompatibility(result)

      setMessage(
        'Permissões de saúde atualizadas.',
      )
    } catch (caughtError) {
      setError(
        getApiErrorMessage(
          caughtError,
          'Não foi possível solicitar as permissões.',
        ),
      )
    } finally {
      setRequesting(false)
    }
  }

  async function synchronize() {
    if (
      !elderlyPersonId ||
      !deviceId
    ) {
      setError(
        'Selecione a pessoa e o dispositivo.',
      )
      return
    }

    setSynchronizing(true)
    setSyncResult(null)
    setMessage('')
    setError('')

    try {
      const result =
        await healthIntegrationService
          .synchronize({
            elderlyPersonId,
            connectedDeviceId: deviceId,
          })

      setSyncResult(result)

      setMessage(
        'Sincronização concluída com sucesso.',
      )

      await loadData()
    } catch (caughtError) {
      setError(
        getApiErrorMessage(
          caughtError,
          'Não foi possível sincronizar os dados de saúde.',
        ),
      )
    } finally {
      setSynchronizing(false)
    }
  }

  if (loading) {
    return <LoadingList />
  }

  const permissionGranted =
    compatibility?.permissionStatus ===
    'granted'

  const nativeAvailable =
    Boolean(
      compatibility
        ?.nativeApplication &&
      compatibility.available,
    )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Monitoramento digital"
        title="Integração de saúde"
        description="Configure como o CuidarPlus receberá dados do Health Connect no Android ou do HealthKit no iPhone."
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

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
              {compatibility?.platform ===
              'web' ? (
                <Monitor size={22} />
              ) : (
                <Smartphone size={22} />
              )}
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Plataforma
              </p>

              <h2 className="mt-1 font-semibold text-slate-900">
                {getPlatformLabel(
                  compatibility?.platform ??
                    'web',
                )}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {compatibility
                  ?.nativeApplication
                  ? 'Aplicativo instalado'
                  : 'Acesso pelo navegador'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <Activity size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Provedor de saúde
              </p>

              <h2 className="mt-1 font-semibold text-slate-900">
                {getProviderLabel(
                  compatibility?.provider ??
                    'none',
                )}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {compatibility?.available
                  ? 'Disponível neste aparelho'
                  : 'Ainda não disponível'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Permissões
              </p>

              <span
                className={[
                  'mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold',
                  getPermissionClass(
                    compatibility
                      ?.permissionStatus ??
                      'unavailable',
                  ),
                ].join(' ')}
              >
                {getPermissionLabel(
                  compatibility
                    ?.permissionStatus ??
                    'unavailable',
                )}
              </span>
            </div>
          </div>
        </Card>
      </section>

      <Card className="p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <CircleAlert
              size={22}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <h2 className="font-semibold text-slate-900">
                Situação da integração
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                {compatibility?.message}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={checking}
              onClick={() =>
                void checkCompatibility()
              }
            >
              <RefreshCw
                size={17}
                className={
                  checking
                    ? 'animate-spin'
                    : ''
                }
              />
              Verificar compatibilidade
            </Button>

            <Button
              type="button"
              disabled={
                requesting ||
                !nativeAvailable
              }
              onClick={() =>
                void requestPermissions()
              }
            >
              <ShieldCheck size={17} />
              Autorizar dados de saúde
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Vincular pessoa e dispositivo
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Escolha para quem as medições serão importadas.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Pessoa acompanhada

            <select
              value={elderlyPersonId}
              className={selectClassName}
              onChange={(event) =>
                handleElderlyChange(
                  event.target.value,
                )
              }
            >
              <option value="">
                Selecione uma pessoa
              </option>

              {elderlyPeople.map(
                (elderly) => (
                  <option
                    key={elderly.id}
                    value={elderly.id}
                  >
                    {elderly.fullName}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Dispositivo

            <select
              value={deviceId}
              disabled={!elderlyPersonId}
              className={selectClassName}
              onChange={(event) => {
                setDeviceId(
                  event.target.value,
                )
                setSyncResult(null)
              }}
            >
              <option value="">
                Selecione um dispositivo
              </option>

              {availableDevices.map(
                (device) => (
                  <option
                    key={device.id}
                    value={device.id}
                  >
                    {device.name}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>

        {selectedDevice && (
          <dl className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">
                Tipo
              </dt>
              <dd className="mt-1 font-medium text-slate-900">
                {
                  connectedDeviceTypeLabels[
                    selectedDevice.type
                  ]
                }
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Provedor cadastrado
              </dt>
              <dd className="mt-1 font-medium text-slate-900">
                {selectedDevice.provider}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Última sincronização
              </dt>
              <dd className="mt-1 font-medium text-slate-900">
                {formatDate(
                  selectedDevice.lastSyncAt,
                )}
              </dd>
            </div>
          </dl>
        )}

        {availableDevices.length === 0 &&
          elderlyPersonId && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Esta pessoa não possui um dispositivo ativo cadastrado.
            </div>
          )}

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            disabled={
              synchronizing ||
              !permissionGranted ||
              !elderlyPersonId ||
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
              : 'Sincronizar agora'}
          </Button>
        </div>
      </Card>

      {syncResult && (
        <Card className="border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-start gap-3">
            <CircleCheck
              size={24}
              className="shrink-0 text-emerald-700"
            />

            <div>
              <h2 className="font-semibold text-emerald-900">
                Resultado da sincronização
              </h2>

              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-emerald-700">
                    Recebidas
                  </p>
                  <p className="text-2xl font-bold text-emerald-950">
                    {
                      syncResult.measurementsReceived
                    }
                  </p>
                </div>

                <div>
                  <p className="text-emerald-700">
                    Importadas
                  </p>
                  <p className="text-2xl font-bold text-emerald-950">
                    {
                      syncResult.measurementsImported
                    }
                  </p>
                </div>

                <div>
                  <p className="text-emerald-700">
                    Ignoradas
                  </p>
                  <p className="text-2xl font-bold text-emerald-950">
                    {
                      syncResult.measurementsIgnored
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-start gap-3">
          <Watch
            size={22}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Fluxos compatíveis
            </h2>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                Android: Galaxy Watch → Samsung Health → Health Connect → CuidarPlus.
              </li>
              <li>
                iOS: Apple Watch → Apple Health → HealthKit → CuidarPlus.
              </li>
              <li>
                Navegador: acompanhamento e configuração, sem leitura direta dos dados de saúde.
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}