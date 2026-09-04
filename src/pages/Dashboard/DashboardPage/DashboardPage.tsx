import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Pill,
  Users,
} from 'lucide-react'

import { dashboardService } from '../../../services/dashboard.service'
import type {
  GeneralDashboard,
  GeneralDashboardCareLog,
} from '../../../types/general-dashboard'

interface DashboardCard {
  title: string
  value: number
  description: string
  icon: typeof Users
}

const initialDashboard: GeneralDashboard = {
  elderlyPeopleCount: 0,
  activeMedications: 0,
  upcomingAppointments: 0,
  unreadAlerts: 0,
  recentCareLogs: [],
  recentVitalSigns: [],
}

function formatDate(date?: string | null) {
  if (!date) {
    return '-'
  }

  return new Date(date).toLocaleString('pt-BR')
}

function CareLogItem({
  item,
}: {
  item: GeneralDashboardCareLog
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="font-semibold text-slate-900">
            {item.elderlyPersonName}
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Humor: {item.mood || 'Não informado'}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Alimentação:{' '}
            <strong>
              {item.hadMeal ? 'Realizada' : 'Não realizada'}
            </strong>
            {' · '}
            Banho:{' '}
            <strong>
              {item.hadBath ? 'Realizado' : 'Não realizado'}
            </strong>
          </p>

          {(item.hadPain || item.hadFall) && (
            <p className="mt-2 text-sm font-medium text-amber-700">
              {item.hadPain && 'Relato de dor'}

              {item.hadPain && item.hadFall && ' · '}

              {item.hadFall && 'Ocorrência de queda'}
            </p>
          )}
        </div>

        <span className="shrink-0 text-xs text-slate-400">
          {formatDate(item.registeredAt)}
        </span>
      </div>

      {item.notes && (
        <p className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600">
          {item.notes}
        </p>
      )}
    </div>
  )
}

export function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<GeneralDashboard>(initialDashboard)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const result =
          await dashboardService.getGeneralDashboard()

        setDashboard({
          elderlyPeopleCount:
            result.elderlyPeopleCount ?? 0,

          activeMedications:
            result.activeMedications ?? 0,

          upcomingAppointments:
            result.upcomingAppointments ?? 0,

          unreadAlerts:
            result.unreadAlerts ?? 0,

          recentCareLogs:
            Array.isArray(result.recentCareLogs)
              ? result.recentCareLogs
              : [],

          recentVitalSigns:
            Array.isArray(result.recentVitalSigns)
              ? result.recentVitalSigns
              : [],
        })
      } catch {
        setDashboard(initialDashboard)

        setError(
          'Não foi possível carregar os dados do Dashboard.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  const cards: DashboardCard[] = [
    {
      title: 'Pessoas assistidas',
      value: dashboard.elderlyPeopleCount,
      description: 'Pessoas acompanhadas',
      icon: Users,
    },
    {
      title: 'Medicamentos',
      value: dashboard.activeMedications,
      description: 'Tratamentos ativos',
      icon: Pill,
    },
    {
      title: 'Consultas',
      value: dashboard.upcomingAppointments,
      description: 'Consultas futuras',
      icon: CalendarDays,
    },
    {
      title: 'Alertas',
      value: dashboard.unreadAlerts,
      description: 'Alertas não lidos',
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-emerald-700">
          Portal Administrativo
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Dashboard Cuidar+
        </h1>

        <p className="mt-2 text-slate-500">
          Visão geral dos cuidados, medicamentos,
          sinais vitais e alertas.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <Icon size={24} />
                </div>
              </div>

              <p className="mt-6 text-sm font-medium text-slate-500">
                {card.title}
              </p>

              <h2 className="mt-2 text-4xl font-bold text-slate-900">
                {loading ? '...' : card.value}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {card.description}
              </p>
            </div>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-emerald-700" />

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Últimos cuidados registrados
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Registros mais recentes das pessoas assistidas.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Carregando cuidados...
            </div>
          ) : dashboard.recentCareLogs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Nenhum cuidado registrado ainda.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {dashboard.recentCareLogs.map((item) => (
                <CareLogItem
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          )}
        </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <HeartPulse
          size={22}
          className="text-emerald-700"
        />

        <h2 className="text-lg font-bold text-slate-900">
          Sinais vitais
        </h2>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-slate-500">
          Carregando sinais vitais...
        </p>
      )}

      {!loading &&
        dashboard.recentVitalSigns.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Nenhum sinal vital registrado.
          </div>
        )}

      {!loading &&
        dashboard.recentVitalSigns.length > 0 && (
          <div className="mt-6 space-y-4">
            {dashboard.recentVitalSigns.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-slate-900">
                    {item.elderlyPersonName}
                  </p>

                  <span className="text-xs text-slate-400">
                    {formatDate(item.registeredAt)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">
                      Pressão
                    </p>

                    <p className="font-semibold text-slate-700">
                      {item.bloodPressure || '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Frequência cardíaca
                    </p>

                    <p className="font-semibold text-slate-700">
                      {item.heartRate != null
                        ? `${item.heartRate} bpm`
                        : '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Saturação
                    </p>

                    <p className="font-semibold text-slate-700">
                      {item.oxygenSaturation != null
                        ? `${item.oxygenSaturation}%`
                        : '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Temperatura
                    </p>

                    <p className="font-semibold text-slate-700">
                      {item.temperature != null
                        ? `${item.temperature} °C`
                        : '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Glicemia
                    </p>

                    <p className="font-semibold text-slate-700">
                      {item.bloodGlucose ?? '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
      </section>
    </div>
  )
}
