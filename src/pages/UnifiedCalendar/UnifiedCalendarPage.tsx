import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Pill,
  RefreshCw,
  Search,
  Stethoscope,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  type CalendarTypeFilter,
  useUnifiedCalendar,
} from '../../hooks/useUnifiedCalendar'
import type { CalendarEvent } from '../../types/calendar'

import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingList } from '../../components/ui/LoadingList'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatsCard } from '../../components/ui/StatsCard'

interface CalendarEventGroup {
  date: string
  events: CalendarEvent[]
}

function formatMonth(
  value: Date,
): string {
  return value.toLocaleDateString(
    'pt-BR',
    {
      month: 'long',
      year: 'numeric',
    },
  )
}

function formatGroupDate(
  value: string,
): string {
  return new Date(
    `${value}T12:00:00`,
  ).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(
  value: string,
): string {
  return new Date(
    value,
  ).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getLocalDateKey(
  value: string,
): string {
  const date = new Date(value)

  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')
  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function groupEventsByDate(
  events: CalendarEvent[],
): CalendarEventGroup[] {
  const groups = new Map<
    string,
    CalendarEvent[]
  >()

  events.forEach((event) => {
    const key =
      getLocalDateKey(event.startsAt)

    const current =
      groups.get(key) ?? []

    current.push(event)
    groups.set(key, current)
  })

  return Array.from(groups.entries())
    .sort(([first], [second]) =>
      first.localeCompare(second),
    )
    .map(([date, groupedEvents]) => ({
      date,
      events: groupedEvents.sort(
        (first, second) =>
          new Date(
            first.startsAt,
          ).getTime() -
          new Date(
            second.startsAt,
          ).getTime(),
      ),
    }))
}

function getStatusPresentation(
  status: string,
) {
  switch (status.toLowerCase()) {
    case 'taken':
      return {
        label: 'Administrado',
        className:
          'bg-emerald-100 text-emerald-700',
      }

    case 'not-taken':
      return {
        label: 'Não administrado',
        className:
          'bg-red-100 text-red-700',
      }

    case 'late':
      return {
        label: 'Atrasado',
        className:
          'bg-amber-100 text-amber-700',
      }

    case 'scheduled':
      return {
        label: 'Agendado',
        className:
          'bg-blue-100 text-blue-700',
      }

    default:
      return {
        label: 'Pendente',
        className:
          'bg-slate-200 text-slate-700',
      }
  }
}

function CalendarEventCard({
  event,
}: {
  event: CalendarEvent
}) {
  const isAppointment =
    event.type === 'appointment'

  const EventIcon = isAppointment
    ? Stethoscope
    : Pill

  const status =
    getStatusPresentation(
      event.status,
    )

  const recordTab = isAppointment
    ? 'appointments'
    : 'daily-agenda'

  return (
    <Card className="p-5">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 gap-4">
          <div
            className={[
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
              isAppointment
                ? 'bg-blue-50 text-blue-700'
                : 'bg-emerald-50 text-emerald-700',
            ].join(' ')}
          >
            <EventIcon size={22} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words font-bold text-slate-900">
                {event.title}
              </h3>

              <span
                className={[
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  status.className,
                ].join(' ')}
              >
                {status.label}
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-emerald-700">
              {event.elderlyPersonName}
            </p>

            {event.description && (
              <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                {event.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                {formatTime(
                  event.startsAt,
                )}
              </span>

              {event.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          to={`/idosos/${event.elderlyPersonId}?tab=${recordTab}`}
          className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Abrir prontuário
        </Link>
      </div>
    </Card>
  )
}

export function UnifiedCalendarPage() {
  const {
    referenceDate,
    events,

    search,
    typeFilter,

    loading,
    error,

    appointmentCount,
    medicationCount,
    pendingCount,
    lateCount,

    setSearch,
    setTypeFilter,

    previousMonth,
    nextMonth,
    goToCurrentMonth,

    load,
  } = useUnifiedCalendar()

  const groups =
    groupEventsByDate(events)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agenda"
        title="Calendário Unificado"
        description="Acompanhe consultas, exames e administrações de medicamentos de todos os idosos."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Consultas e exames"
          value={appointmentCount}
          icon={
            <Stethoscope size={20} />
          }
        />

        <StatsCard
          label="Medicamentos"
          value={medicationCount}
          icon={<Pill size={20} />}
        />

        <StatsCard
          label="Pendentes"
          value={pendingCount}
          icon={
            <CalendarDays size={20} />
          }
        />

        <StatsCard
          label="Atrasados"
          value={lateCount}
          icon={
            <AlertTriangle size={20} />
          }
        />
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <Card className="p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={previousMonth}
            >
              <ChevronLeft size={17} />
            </Button>

            <p className="min-w-52 text-center text-lg font-bold capitalize text-slate-900">
              {formatMonth(
                referenceDate,
              )}
            </p>

            <Button
              type="button"
              variant="secondary"
              onClick={nextMonth}
            >
              <ChevronRight size={17} />
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={
                goToCurrentMonth
              }
            >
              Mês atual
            </Button>
          </div>

          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => void load()}
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />
            Atualizar
          </Button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Pesquisar idoso, consulta ou medicamento..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value as
                  CalendarTypeFilter,
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="all">
              Todos os eventos
            </option>

            <option value="appointment">
              Consultas e exames
            </option>

            <option value="medication">
              Medicamentos
            </option>
          </select>
        </div>
      </Card>

      {loading ? (
        <LoadingList rows={8} />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={
            <CalendarDays size={32} />
          }
          title="Nenhum evento encontrado"
          description="Não existem consultas ou medicamentos no mês e nos filtros selecionados."
        />
      ) : (
        <div className="space-y-7">
          {groups.map((group) => (
            <section
              key={group.date}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <h2 className="text-sm font-bold capitalize text-slate-600">
                  {formatGroupDate(
                    group.date,
                  )}
                </h2>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="space-y-3">
                {group.events.map(
                  (event) => (
                    <CalendarEventCard
                      key={`${event.type}-${event.id}`}
                      event={event}
                    />
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
