import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderOpen,
  HeartPulse,
  Pill,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { LoadingList } from '../../components/ui/LoadingList'
import { StatsCard } from '../../components/ui/StatsCard'
import { dashboardService } from '../../services/dashboard.service'
import type { ElderlyDashboard } from '../../types/elderly-dashboard'

interface ModuleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  value?: number
}

function ModuleCard({
  title,
  description,
  icon,
  value,
}: ModuleCardProps) {
  return (
    <Card className="p-6 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          {icon}
        </div>

        {value !== undefined && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
            {value}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>

      <button
        type="button"
        className="mt-6 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Abrir módulo
      </button>
    </Card>
  )
}

function formatDate(date?: string | null) {
  if (!date) return 'Não informado'

  return new Date(date).toLocaleString('pt-BR')
}

export function ElderlyRecordPage() {
  const { id } = useParams()

  const [dashboard, setDashboard] = useState<ElderlyDashboard | null>(null)
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
        const result = await dashboardService.getElderlyDashboard(id)
        setDashboard(result)
      } catch {
        setError('Não foi possível carregar o prontuário do idoso.')
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
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
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
                  {new Date(dashboard.birthDate).toLocaleDateString('pt-BR')}
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
              {dashboard.emergencyContactName || 'Não informado'}
            </p>

            <p className="text-sm">
              {dashboard.emergencyContactPhone || '-'}
            </p>
          </div>
        </div>
      </Card>

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
          <p className="text-sm text-slate-500">Médico responsável</p>
          <strong className="mt-2 block text-lg text-slate-900">
            {dashboard.doctorName || 'Não informado'}
          </strong>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">Convênio</p>
          <strong className="mt-2 block text-lg text-slate-900">
            {dashboard.healthInsurance || 'Não informado'}
          </strong>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">Documentos</p>
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
                {dashboard.nextAppointment.doctorName || 'Médico não informado'}
              </p>

              <p className="text-sm text-slate-600">
                {dashboard.nextAppointment.specialty || 'Especialidade não informada'}
              </p>

              <p className="text-sm font-medium text-emerald-700">
                {formatDate(dashboard.nextAppointment.appointmentDate)}
              </p>

              <p className="text-sm text-slate-500">
                {dashboard.nextAppointment.location || 'Local não informado'}
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
                <strong>{dashboard.latestVitalSign.bloodPressure || '-'}</strong>
              </div>

              <div>
                <p className="text-slate-500">Glicemia</p>
                <strong>{dashboard.latestVitalSign.bloodGlucose ?? '-'}</strong>
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

              <p className="col-span-2 text-xs text-slate-400">
                Registrado em {formatDate(dashboard.latestVitalSign.registeredAt)}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Nenhum sinal vital registrado.
            </p>
          )}
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ModuleCard
          title="Medicamentos"
          description="Tratamentos, dosagens e períodos de uso."
          value={dashboard.activeMedications}
          icon={<Pill size={24} />}
        />

        <ModuleCard
          title="Agenda de Medicamentos"
          description="Horários, confirmações e pendências."
          value={dashboard.pendingMedicationSchedules}
          icon={<CalendarDays size={24} />}
        />

        <ModuleCard
          title="Sinais Vitais"
          description="Pressão, glicemia, temperatura, batimentos e saturação."
          value={dashboard.vitalSignsCount}
          icon={<HeartPulse size={24} />}
        />

        <ModuleCard
          title="Consultas Médicas"
          description="Histórico e próximas consultas."
          value={dashboard.upcomingAppointments}
          icon={<Stethoscope size={24} />}
        />

        <ModuleCard
          title="Diário de Cuidados"
          description="Banho, alimentação, humor, dor, quedas e observações."
          value={dashboard.careLogsCount}
          icon={<ClipboardList size={24} />}
        />

        <ModuleCard
          title="Alertas"
          description="Ocorrências e pendências importantes."
          value={dashboard.unreadAlerts}
          icon={<AlertTriangle size={24} />}
        />

        <ModuleCard
          title="Documentos"
          description="Receitas, exames, documentos e termos."
          value={dashboard.documentsCount}
          icon={<FolderOpen size={24} />}
        />

        <ModuleCard
          title="Relatórios"
          description="Resumo, relatório detalhado e PDF."
          icon={<FileText size={24} />}
        />
      </section>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">
            Timeline recente
          </h2>
        </div>

        {dashboard.recentTimeline.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            Nenhum evento registrado na timeline.
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {dashboard.recentTimeline.map((event) => (
              <div
                key={event.id}
                className="relative border-l-2 border-emerald-200 pl-5"
              >
                <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-emerald-600" />

                <p className="font-semibold text-slate-900">{event.title}</p>

                {event.description && (
                  <p className="mt-1 text-sm text-slate-500">
                    {event.description}
                  </p>
                )}

                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(event.occurredAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}