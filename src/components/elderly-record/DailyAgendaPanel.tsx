import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  HeartPulse,
  LoaderCircle,
  RefreshCw,
  Stethoscope,
  Utensils,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDailyAgenda } from '../../hooks/useDailyAgenda'
import {
  MedicationAdministrationStatus,
  type DailyMedication,
} from '../../types/daily-agenda'

interface DailyAgendaPanelProps {
  elderlyPersonId: string
}

interface ConfirmationState {
  medication: DailyMedication
  action: 'taken' | 'not-taken'
}

function formatDateForInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseInputDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)

  return new Date(year, month - 1, day)
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
  }).format(parseInputDate(date))
}

function formatTime(value: string): string {
  return value.slice(0, 5)
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function addDays(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)

  return result
}

function getMedicationStatusLabel(
  status: DailyMedication['status'],
): string {
  switch (status) {
    case MedicationAdministrationStatus.Taken:
      return 'Administrado'

    case MedicationAdministrationStatus.NotTaken:
      return 'Não administrado'

    case MedicationAdministrationStatus.Late:
      return 'Atrasado'

    default:
      return 'Pendente'
  }
}

function getMedicationStatusClasses(
  status: DailyMedication['status'],
): string {
  switch (status) {
    case MedicationAdministrationStatus.Taken:
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200'

    case MedicationAdministrationStatus.NotTaken:
      return 'bg-red-50 text-red-700 ring-red-200'

    case MedicationAdministrationStatus.Late:
      return 'bg-amber-50 text-amber-700 ring-amber-200'

    default:
      return 'bg-slate-50 text-slate-700 ring-slate-200'
  }
}

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string
  value: number
  description: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-2 text-3xl font-semibold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  )
}

export function DailyAgendaPanel({
  elderlyPersonId,
}: DailyAgendaPanelProps) {
  const {
    agenda,
    selectedDate,
    loading,
    updatingMedicationId,
    error,
    setSelectedDate,
    reload,
    confirmTaken,
    confirmNotTaken,
  } = useDailyAgenda(elderlyPersonId)

  const [confirmation, setConfirmation] =
    useState<ConfirmationState | null>(null)

  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectedDateValue = useMemo(
    () => formatDateForInput(selectedDate),
    [selectedDate],
  )

  const handleOpenConfirmation = (
    medication: DailyMedication,
    action: ConfirmationState['action'],
  ) => {
    setNotes(medication.notes ?? '')
    setConfirmation({
      medication,
      action,
    })
  }

  const handleCloseConfirmation = () => {
    if (submitting) {
      return
    }

    setConfirmation(null)
    setNotes('')
  }

  const handleConfirm = async () => {
    if (!confirmation) {
      return
    }

    try {
      setSubmitting(true)

      const success =
        confirmation.action === 'taken'
          ? await confirmTaken(
              confirmation.medication.administrationId,
              notes,
            )
          : await confirmNotTaken(
              confirmation.medication.administrationId,
              notes,
            )

      if (success) {
        setConfirmation(null)
        setNotes('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !agenda) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 text-slate-600">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Carregando agenda diária...
        </div>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-sky-600" />

              <h2 className="text-xl font-semibold text-slate-900">
                Agenda diária
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Acompanhamento operacional dos cuidados realizados no dia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                setSelectedDate(addDays(selectedDate, -1))
              }
              disabled={loading}
              title="Dia anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <input
              type="date"
              value={selectedDateValue}
              onChange={(event) =>
                setSelectedDate(
                  parseInputDate(event.target.value),
                )
              }
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                setSelectedDate(addDays(selectedDate, 1))
              }
              disabled={loading}
              title="Próximo dia"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setSelectedDate(new Date())}
              disabled={loading}
            >
              Hoje
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-sky-600 px-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => void reload()}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? 'animate-spin' : ''
                }`}
              />

              Atualizar
            </button>
          </div>
        </div>

        {agenda && (
          <p className="mt-4 border-t border-slate-100 pt-4 text-sm font-medium capitalize text-slate-700">
            {formatDate(agenda.date)}
          </p>
        )}
      </header>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {agenda && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Medicações"
              value={agenda.summary.totalMedications}
              description={`${agenda.summary.takenMedications} administradas`}
            />

            <SummaryCard
              title="Pendentes"
              value={
                agenda.summary.pendingMedications +
                agenda.summary.lateMedications
              }
              description={`${agenda.summary.lateMedications} atrasadas`}
            />

            <SummaryCard
              title="Consultas"
              value={agenda.summary.appointments}
              description="Agendamentos no dia"
            />

            <SummaryCard
              title="Alertas"
              value={agenda.summary.unreadAlerts}
              description="Alertas ainda não lidos"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-sky-600" />

                    <h3 className="font-semibold text-slate-900">
                      Medicações do dia
                    </h3>
                  </div>
                </div>

                {agenda.medications.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-slate-500">
                    Nenhuma medicação programada para esta data.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {agenda.medications.map((medication) => {
                      const isUpdating =
                        updatingMedicationId ===
                        medication.administrationId

                      return (
                        <article
                          key={medication.administrationId}
                          className="p-5"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-lg font-semibold text-slate-900">
                                  {formatTime(
                                    medication.scheduledTime,
                                  )}
                                </span>

                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getMedicationStatusClasses(
                                    medication.status,
                                  )}`}
                                >
                                  {getMedicationStatusLabel(
                                    medication.status,
                                  )}
                                </span>
                              </div>

                              <h4 className="mt-2 font-medium text-slate-900">
                                {medication.medicationName}
                              </h4>

                              <p className="mt-1 text-sm text-slate-500">
                                {medication.dosage}
                                {medication.frequency
                                  ? ` • ${medication.frequency}`
                                  : ''}
                              </p>

                              {medication.administeredAt && (
                                <p className="mt-2 text-xs text-slate-500">
                                  Registrado em{' '}
                                  {formatDateTime(
                                    medication.administeredAt,
                                  )}
                                </p>
                              )}

                              {medication.notes && (
                                <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                                  {medication.notes}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() =>
                                  handleOpenConfirmation(
                                    medication,
                                    'taken',
                                  )
                                }
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}

                                Administrado
                              </button>

                              <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() =>
                                  handleOpenConfirmation(
                                    medication,
                                    'not-taken',
                                  )
                                }
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4" />
                                Não administrado
                              </button>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-sky-600" />

                    <h3 className="font-semibold text-slate-900">
                      Consultas e exames
                    </h3>
                  </div>
                </div>

                {agenda.appointments.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-slate-500">
                    Nenhuma consulta ou exame nesta data.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {agenda.appointments.map((appointment) => (
                      <article
                        key={appointment.id}
                        className="p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
                            {new Intl.DateTimeFormat('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            }).format(
                              new Date(
                                appointment.appointmentDate,
                              ),
                            )}
                          </div>

                          <div>
                            <h4 className="font-medium text-slate-900">
                              {appointment.title}
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                              {[
                                appointment.doctorName,
                                appointment.specialty,
                              ]
                                .filter(Boolean)
                                .join(' • ') ||
                                'Profissional não informado'}
                            </p>

                            {appointment.location && (
                              <p className="mt-1 text-sm text-slate-500">
                                Local: {appointment.location}
                              </p>
                            )}

                            {appointment.notes && (
                              <p className="mt-2 text-sm text-slate-600">
                                {appointment.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-red-500" />

                    <h3 className="font-semibold text-slate-900">
                      Últimos sinais vitais
                    </h3>
                  </div>
                </div>

                {!agenda.latestVitalSign ? (
                  <div className="px-5 py-8 text-center text-sm text-slate-500">
                    Nenhum sinal vital registrado nesta data.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 p-5 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">
                        Pressão
                      </span>
                      <strong className="mt-1 block text-slate-900">
                        {agenda.latestVitalSign.bloodPressure ??
                          'Não informado'}
                      </strong>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">
                        Temperatura
                      </span>
                      <strong className="mt-1 block text-slate-900">
                        {agenda.latestVitalSign.temperature != null
                          ? `${agenda.latestVitalSign.temperature} °C`
                          : 'Não informado'}
                      </strong>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">
                        Frequência cardíaca
                      </span>
                      <strong className="mt-1 block text-slate-900">
                        {agenda.latestVitalSign.heartRate != null
                          ? `${agenda.latestVitalSign.heartRate} bpm`
                          : 'Não informado'}
                      </strong>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">
                        Saturação
                      </span>
                      <strong className="mt-1 block text-slate-900">
                        {agenda.latestVitalSign
                          .oxygenSaturation != null
                          ? `${agenda.latestVitalSign.oxygenSaturation}%`
                          : 'Não informado'}
                      </strong>
                    </div>

                    <div className="col-span-2 rounded-lg bg-slate-50 p-3">
                      <span className="block text-xs text-slate-500">
                        Glicemia
                      </span>
                      <strong className="mt-1 block text-slate-900">
                        {agenda.latestVitalSign.bloodGlucose != null
                          ? `${agenda.latestVitalSign.bloodGlucose} mg/dL`
                          : 'Não informado'}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-amber-600" />

                    <h3 className="font-semibold text-slate-900">
                      Último cuidado
                    </h3>
                  </div>
                </div>

                {!agenda.latestCareLog ? (
                  <div className="px-5 py-8 text-center text-sm text-slate-500">
                    Nenhum cuidado registrado nesta data.
                  </div>
                ) : (
                  <div className="space-y-3 p-5 text-sm text-slate-600">
                    <p>
                      Alimentação:{' '}
                      <strong className="text-slate-900">
                        {agenda.latestCareLog.hadMeal
                          ? 'Realizada'
                          : 'Não realizada'}
                      </strong>
                    </p>

                    <p>
                      Banho:{' '}
                      <strong className="text-slate-900">
                        {agenda.latestCareLog.hadBath
                          ? 'Realizado'
                          : 'Não realizado'}
                      </strong>
                    </p>

                    <p>
                      Dor:{' '}
                      <strong className="text-slate-900">
                        {agenda.latestCareLog.hadPain
                          ? 'Relatada'
                          : 'Não relatada'}
                      </strong>
                    </p>

                    <p>
                      Queda:{' '}
                      <strong className="text-slate-900">
                        {agenda.latestCareLog.hadFall
                          ? 'Registrada'
                          : 'Não registrada'}
                      </strong>
                    </p>

                    {agenda.latestCareLog.mood && (
                      <p>
                        Humor:{' '}
                        <strong className="text-slate-900">
                          {agenda.latestCareLog.mood}
                        </strong>
                      </p>
                    )}

                    {agenda.latestCareLog.sleepQuality && (
                      <p>
                        Sono:{' '}
                        <strong className="text-slate-900">
                          {agenda.latestCareLog.sleepQuality}
                        </strong>
                      </p>
                    )}

                    {agenda.latestCareLog.notes && (
                      <p className="rounded-lg bg-slate-50 p-3">
                        {agenda.latestCareLog.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />

                    <h3 className="font-semibold text-slate-900">
                      Alertas não lidos
                    </h3>
                  </div>
                </div>

                {agenda.alerts.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm text-slate-500">
                    Nenhum alerta pendente.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {agenda.alerts.map((alert) => (
                      <article
                        key={alert.id}
                        className="p-5"
                      >
                        <h4 className="text-sm font-semibold text-slate-900">
                          {alert.title}
                        </h4>

                        <p className="mt-1 text-sm text-slate-600">
                          {alert.message}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {formatDateTime(alert.createdAt)}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </>
      )}

      {!loading && !agenda && !error && (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
          Não foi possível localizar a agenda diária.
        </div>
      )}

      {confirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {confirmation.action === 'taken'
                    ? 'Confirmar administração'
                    : 'Confirmar não administração'}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {confirmation.medication.medicationName} —{' '}
                  {formatTime(
                    confirmation.medication.scheduledTime,
                  )}
                </p>
              </div>

              <button
                type="button"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                onClick={handleCloseConfirmation}
                disabled={submitting}
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <label
                htmlFor="medication-administration-notes"
                className="text-sm font-medium text-slate-700"
              >
                Observações
              </label>

              <textarea
                id="medication-administration-notes"
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={
                  confirmation.action === 'taken'
                    ? 'Ex.: administrado após o café da manhã.'
                    : 'Ex.: paciente recusou a medicação.'
                }
                className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                disabled={submitting}
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleCloseConfirmation}
                disabled={submitting}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={
                  confirmation.action === 'taken'
                    ? 'inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
                    : 'inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                }
                onClick={() => void handleConfirm()}
                disabled={submitting}
              >
                {submitting && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}

                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
