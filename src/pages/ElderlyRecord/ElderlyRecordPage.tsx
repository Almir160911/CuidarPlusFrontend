import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderOpen,
  HeartPulse,
  LayoutDashboard,
  Pill,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import { MedicationPanel } from '../../components/elderly-record/MedicationPanel'
import { Card } from '../../components/ui/Card'
import { LoadingList } from '../../components/ui/LoadingList'
import { StatsCard } from '../../components/ui/StatsCard'
import { dashboardService } from '../../services/dashboard.service'
import type { ElderlyDashboard } from '../../types/elderly-dashboard'
import { MedicationSchedulePanel } from '../../components/elderly-record/MedicationSchedulePanel'

type RecordTab =
  | 'summary'
  | 'medications'
  | 'schedule'
  | 'appointments'
  | 'vital-signs'
  | 'care-logs'
  | 'documents'
  | 'timeline'
  | 'reports'

interface TabDefinition {
  id: RecordTab
  label: string
  icon: ReactNode
  badge?: number
}

interface PlaceholderPanelProps {
  title: string
  description: string
  icon: ReactNode
}

function formatDate(date?: string | null) {
  if (!date) return 'Não informado'

  return new Date(date).toLocaleString('pt-BR')
}

function PlaceholderPanel({
  title,
  description,
  icon,
}: PlaceholderPanelProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="rounded-3xl bg-emerald-50 p-5 text-emerald-700">
          {icon}
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 max-w-xl text-slate-500">
          {description}
        </p>

        <p className="mt-5 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          Módulo em desenvolvimento
        </p>
      </div>
    </Card>
  )
}

function SummaryTab({
  dashboard,
}: {
  dashboard: ElderlyDashboard
}) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Medicamentos ativos"
          value={dashboard.activeMedications}
          icon={<Pill size={20} />}
        />

        <StatsCard
          label="Horários pendentes"
          value={dashboard.pendingMedicationSchedules}
          icon={<CalendarDays size={20} />}
        />

        <StatsCard
          label="Alertas não lidos"
          value={dashboard.unreadAlerts}
          icon={<AlertTriangle size={20} />}
        />

        <StatsCard
          label="Próximas consultas"
          value={dashboard.upcomingAppointments}
          icon={<Stethoscope size={20} />}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Médico responsável
          </p>

          <strong className="mt-2 block text-lg text-slate-900">
            {dashboard.doctorName || 'Não informado'}
          </strong>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Convênio
          </p>

          <strong className="mt-2 block text-lg text-slate-900">
            {dashboard.healthInsurance || 'Não informado'}
          </strong>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Documentos cadastrados
          </p>

          <strong className="mt-2 block text-lg text-slate-900">
            {dashboard.documentsCount}
          </strong>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-emerald-700" />

            <h2 className="text-lg font-bold text-slate-900">
              Próxima consulta
            </h2>
          </div>

          {dashboard.nextAppointment ? (
            <div className="mt-5 space-y-2">
              <p className="font-semibold text-slate-900">
                {dashboard.nextAppointment.title}
              </p>

              <p className="text-sm text-slate-600">
                {dashboard.nextAppointment.doctorName ||
                  'Médico não informado'}
              </p>

              <p className="text-sm text-slate-600">
                {dashboard.nextAppointment.specialty ||
                  'Especialidade não informada'}
              </p>

              <p className="text-sm font-medium text-emerald-700">
                {formatDate(
                  dashboard.nextAppointment.appointmentDate,
                )}
              </p>

              <p className="text-sm text-slate-500">
                {dashboard.nextAppointment.location ||
                  'Local não informado'}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Nenhuma consulta futura agendada.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <HeartPulse className="text-emerald-700" />

            <h2 className="text-lg font-bold text-slate-900">
              Últimos sinais vitais
            </h2>
          </div>

          {dashboard.latestVitalSign ? (
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Pressão</p>
                <strong>
                  {dashboard.latestVitalSign.bloodPressure || '-'}
                </strong>
              </div>

              <div>
                <p className="text-slate-500">Glicemia</p>
                <strong>
                  {dashboard.latestVitalSign.bloodGlucose ?? '-'}
                </strong>
              </div>

              <div>
                <p className="text-slate-500">Temperatura</p>
                <strong>
                  {dashboard.latestVitalSign.temperature !== null &&
                  dashboard.latestVitalSign.temperature !== undefined
                    ? `${dashboard.latestVitalSign.temperature} °C`
                    : '-'}
                </strong>
              </div>

              <div>
                <p className="text-slate-500">Saturação</p>
                <strong>
                  {dashboard.latestVitalSign.oxygenSaturation !== null &&
                  dashboard.latestVitalSign.oxygenSaturation !== undefined
                    ? `${dashboard.latestVitalSign.oxygenSaturation}%`
                    : '-'}
                </strong>
              </div>

              <div>
                <p className="text-slate-500">Frequência cardíaca</p>
                <strong>
                  {dashboard.latestVitalSign.heartRate !== null &&
                  dashboard.latestVitalSign.heartRate !== undefined
                    ? `${dashboard.latestVitalSign.heartRate} bpm`
                    : '-'}
                </strong>
              </div>

              <p className="col-span-2 text-xs text-slate-400">
                Registrado em{' '}
                {formatDate(
                  dashboard.latestVitalSign.registeredAt,
                )}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Nenhum sinal vital registrado.
            </p>
          )}
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-emerald-700" />

            <h2 className="text-lg font-bold text-slate-900">
              Último registro de cuidados
            </h2>
          </div>

          {dashboard.latestCareLog ? (
            <div className="mt-5 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <p>
                  Alimentação:{' '}
                  <strong>
                    {dashboard.latestCareLog.hadMeal
                      ? 'Realizada'
                      : 'Não realizada'}
                  </strong>
                </p>

                <p>
                  Banho:{' '}
                  <strong>
                    {dashboard.latestCareLog.hadBath
                      ? 'Realizado'
                      : 'Não realizado'}
                  </strong>
                </p>

                <p>
                  Humor:{' '}
                  <strong>
                    {dashboard.latestCareLog.mood ||
                      'Não informado'}
                  </strong>
                </p>

                <p>
                  Sono:{' '}
                  <strong>
                    {dashboard.latestCareLog.sleepQuality ||
                      'Não informado'}
                  </strong>
                </p>

                <p>
                  Dor:{' '}
                  <strong>
                    {dashboard.latestCareLog.hadPain
                      ? 'Sim'
                      : 'Não'}
                  </strong>
                </p>

                <p>
                  Queda:{' '}
                  <strong>
                    {dashboard.latestCareLog.hadFall
                      ? 'Sim'
                      : 'Não'}
                  </strong>
                </p>
              </div>

              {dashboard.latestCareLog.notes && (
                <p className="rounded-2xl bg-slate-50 p-4 text-slate-600">
                  {dashboard.latestCareLog.notes}
                </p>
              )}

              <p className="text-xs text-slate-400">
                Registrado em{' '}
                {formatDate(
                  dashboard.latestCareLog.registeredAt,
                )}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Nenhum cuidado registrado.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Informações clínicas
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm text-slate-500">
                Alergias
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {dashboard.allergies || 'Não informadas'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Doenças conhecidas
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {dashboard.knownDiseases || 'Não informadas'}
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

function TimelineTab({
  dashboard,
}: {
  dashboard: ElderlyDashboard
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="text-emerald-700" />

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Timeline do prontuário
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Histórico cronológico dos acontecimentos relacionados
            ao cuidado.
          </p>
        </div>
      </div>

      {dashboard.recentTimeline.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">
          Nenhum evento registrado na timeline.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {dashboard.recentTimeline.map((event) => (
            <div
              key={event.id}
              className="relative border-l-2 border-emerald-200 pb-2 pl-6"
            >
              <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-emerald-600" />

              <p className="font-semibold text-slate-900">
                {event.title}
              </p>

              {event.description && (
                <p className="mt-1 text-sm text-slate-500">
                  {event.description}
                </p>
              )}

              {event.relatedEntityName && (
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Referência: {event.relatedEntityName}
                </p>
              )}

              <p className="mt-2 text-xs text-slate-400">
                {formatDate(event.occurredAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export function ElderlyRecordPage() {
  const { id } = useParams()

  const [dashboard, setDashboard] =
    useState<ElderlyDashboard | null>(null)

  const [activeTab, setActiveTab] =
    useState<RecordTab>('summary')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      if (!id) {
        setError('Identificador do idoso não informado.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const result =
          await dashboardService.getElderlyDashboard(id)

        setDashboard(result)
      } catch {
        setError(
          'Não foi possível carregar o prontuário do idoso.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [id])

  if (loading) {
    return <LoadingList rows={8} />
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
        {error || 'Prontuário não encontrado.'}
      </div>
    )
  }

  const tabs: TabDefinition[] = [
    {
      id: 'summary',
      label: 'Resumo',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'medications',
      label: 'Medicamentos',
      icon: <Pill size={18} />,
      badge: dashboard.activeMedications,
    },
    {
      id: 'schedule',
      label: 'Agenda',
      icon: <CalendarDays size={18} />,
      badge: dashboard.pendingMedicationSchedules,
    },
    {
      id: 'appointments',
      label: 'Consultas',
      icon: <Stethoscope size={18} />,
      badge: dashboard.upcomingAppointments,
    },
    {
      id: 'vital-signs',
      label: 'Sinais vitais',
      icon: <HeartPulse size={18} />,
      badge: dashboard.vitalSignsCount,
    },
    {
      id: 'care-logs',
      label: 'Cuidados',
      icon: <ClipboardList size={18} />,
      badge: dashboard.careLogsCount,
    },
    {
      id: 'documents',
      label: 'Documentos',
      icon: <FolderOpen size={18} />,
      badge: dashboard.documentsCount,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <ClipboardList size={18} />,
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: <FileText size={18} />,
    },
  ]

  return (
    <div className="space-y-6">
      <Link
        to="/idosos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={17} />
        Voltar para idosos
      </Link>

      <Card className="p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
              <UserRound size={30} />
            </div>

            <div>
              <p className="text-sm font-medium text-emerald-700">
                Prontuário do Idoso
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {dashboard.elderlyPersonName}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>{dashboard.age} anos</span>
                <span>•</span>

                <span>
                  Nascimento:{' '}
                  {new Date(
                    dashboard.birthDate,
                  ).toLocaleDateString('pt-BR')}
                </span>

                <span
                  className={[
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    dashboard.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-600',
                  ].join(' ')}
                >
                  {dashboard.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-800">
            <p className="text-xs font-semibold uppercase tracking-wide">
              Contato de emergência
            </p>

            <p className="mt-1 font-bold">
              {dashboard.emergencyContactName ||
                'Não informado'}
            </p>

            <p className="text-sm">
              {dashboard.emergencyContactPhone || '-'}
            </p>
          </div>
        </div>
      </Card>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
        <nav className="flex min-w-max gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')}
              >
                {tab.icon}
                {tab.label}

                {tab.badge !== undefined && (
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-xs',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-600',
                    ].join(' ')}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {activeTab === 'summary' && (
        <SummaryTab dashboard={dashboard} />
      )}

      {activeTab === 'medications' && (
        <MedicationPanel
          elderlyPersonId={dashboard.elderlyPersonId}
        />
      )}

      {activeTab === 'schedule' && (
        <MedicationSchedulePanel
          elderlyPersonId={dashboard.elderlyPersonId}
        />
      )}

      {activeTab === 'appointments' && (
        <PlaceholderPanel
          title="Consultas Médicas"
          description="Aqui serão exibidas as consultas futuras, o histórico médico, profissionais e especialidades."
          icon={<Stethoscope size={32} />}
        />
      )}

      {activeTab === 'vital-signs' && (
        <PlaceholderPanel
          title="Sinais Vitais"
          description="Aqui serão registrados e analisados pressão arterial, glicemia, temperatura, frequência cardíaca e saturação."
          icon={<HeartPulse size={32} />}
        />
      )}

      {activeTab === 'care-logs' && (
        <PlaceholderPanel
          title="Diário de Cuidados"
          description="Aqui serão registrados alimentação, banho, sono, humor, dor, quedas e observações."
          icon={<ClipboardList size={32} />}
        />
      )}

      {activeTab === 'documents' && (
        <PlaceholderPanel
          title="Documentos"
          description="Aqui serão armazenados receitas, exames, documentos pessoais, termos e outros anexos."
          icon={<FolderOpen size={32} />}
        />
      )}

      {activeTab === 'timeline' && (
        <TimelineTab dashboard={dashboard} />
      )}

      {activeTab === 'reports' && (
        <PlaceholderPanel
          title="Relatórios"
          description="Aqui serão gerados resumos clínicos, relatórios detalhados, arquivos PDF e impressões."
          icon={<FileText size={32} />}
        />
      )}
    </div>
  )
}