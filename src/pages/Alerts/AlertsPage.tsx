import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  type AlertReadFilter,
  useOrganizationAlerts,
} from '../../hooks/useOrganizationAlerts'
import type { Alert } from '../../types/alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingList } from '../../components/ui/LoadingList'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatsCard } from '../../components/ui/StatsCard'

function formatDate(value: string) {
  return new Date(
    value,
  ).toLocaleString('pt-BR')
}

function getSeverityStyle(
  severity: string,
) {
  switch (
    severity.toLowerCase()
  ) {
    case 'high':
      return {
        label: 'Alta',
        badge:
          'bg-red-100 text-red-700',
        border: 'border-red-200',
        icon: 'text-red-600',
      }

    case 'medium':
      return {
        label: 'Média',
        badge:
          'bg-amber-100 text-amber-700',
        border: 'border-amber-200',
        icon: 'text-amber-600',
      }

    default:
      return {
        label: 'Baixa',
        badge:
          'bg-blue-100 text-blue-700',
        border: 'border-blue-200',
        icon: 'text-blue-600',
      }
  }
}

function AlertCard({
  alert,
  updating,
  onMarkAsRead,
}: {
  alert: Alert
  updating: boolean
  onMarkAsRead:
    (id: string) => void
}) {
  const severity =
    getSeverityStyle(
      alert.severity,
    )

  return (
    <Card
      className={[
        'border-l-4 p-5',
        severity.border,
        alert.isRead
          ? 'opacity-75'
          : '',
      ].join(' ')}
    >
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
        <div className="flex min-w-0 gap-4">
          <div
            className={[
              'mt-1 shrink-0',
              severity.icon,
            ].join(' ')}
          >
            <AlertTriangle size={24} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words font-bold text-slate-900">
                {alert.title}
              </h3>

              <span
                className={[
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  severity.badge,
                ].join(' ')}
              >
                {severity.label}
              </span>

              <span
                className={[
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  alert.isRead
                    ? 'bg-slate-200 text-slate-600'
                    : 'bg-emerald-100 text-emerald-700',
                ].join(' ')}
              >
                {alert.isRead
                  ? 'Lido'
                  : 'Novo'}
              </span>
            </div>

            <p className="mt-2 break-words text-sm leading-6 text-slate-600">
              {alert.message}
            </p>

            <p className="mt-3 text-xs text-slate-400">
              Criado em{' '}
              {formatDate(
                alert.createdAt,
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            to={`/idosos/${alert.elderlyPersonId}?tab=alerts`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink size={16} />
            Abrir prontuário
          </Link>

          {!alert.isRead && (
            <Button
              type="button"
              variant="secondary"
              disabled={updating}
              onClick={() =>
                onMarkAsRead(
                  alert.id,
                )
              }
            >
              <Check size={17} />

              {updating
                ? 'Atualizando...'
                : 'Marcar como lido'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export function AlertsPage() {
  const {
    items,
    unreadCount,
    highCount,

    search,
    severity,
    readFilter,
    fromDate,
    toDate,

    page,
    pageSize,
    totalItems,
    totalPages,

    loading,
    updatingId,
    error,

    setPage,
    changeSearch,
    changeSeverity,
    changeReadFilter,
    changeFromDate,
    changeToDate,
    changePageSize,
    clearFilters,

    load,
    markAsRead,
  } = useOrganizationAlerts()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Monitoramento"
        title="Centro Global de Alertas"
        description="Acompanhe alertas clínicos, cuidados e medicamentos de todos os idosos da organização."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Total de alertas"
          value={totalItems}
          icon={
            <AlertTriangle size={20} />
          }
        />

        <StatsCard
          label="Não lidos nesta página"
          value={unreadCount}
        />

        <StatsCard
          label="Alta prioridade nesta página"
          value={highCount}
        />
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="p-5">
        <div className="grid gap-3 xl:grid-cols-6">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 xl:col-span-2">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                changeSearch(
                  event.target.value,
                )
              }
              placeholder="Pesquisar título ou mensagem..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={severity}
            onChange={(event) =>
              changeSeverity(
                event.target.value,
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="">
              Todas as prioridades
            </option>
            <option value="High">
              Alta
            </option>
            <option value="Medium">
              Média
            </option>
            <option value="Low">
              Baixa
            </option>
          </select>

          <select
            value={readFilter}
            onChange={(event) =>
              changeReadFilter(
                event.target.value as
                  AlertReadFilter,
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="all">
              Todos
            </option>
            <option value="unread">
              Não lidos
            </option>
            <option value="read">
              Lidos
            </option>
          </select>

          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            title="Data inicial"
            onChange={(event) =>
              changeFromDate(
                event.target.value,
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />

          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            title="Data final"
            onChange={(event) =>
              changeToDate(
                event.target.value,
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={clearFilters}
          >
            <SlidersHorizontal
              size={17}
            />
            Limpar filtros
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() =>
              void load()
            }
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
      </Card>

      {loading ? (
        <LoadingList rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={
            <AlertTriangle size={32} />
          }
          title="Nenhum alerta encontrado"
          description="Não há alertas correspondentes aos filtros selecionados."
        />
      ) : (
        <div className="space-y-4">
          {items.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              updating={
                updatingId === alert.id
              }
              onMarkAsRead={
                markAsRead
              }
            />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-slate-500">
                Página {page} de{' '}
                {totalPages}
              </p>

              <select
                value={pageSize}
                onChange={(event) =>
                  changePageSize(
                    Number(
                      event.target.value,
                    ),
                  )
                }
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option value={10}>
                  10 por página
                </option>
                <option value={20}>
                  20 por página
                </option>
                <option value={50}>
                  50 por página
                </option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-2"
                disabled={
                  page <= 1 ||
                  loading
                }
                onClick={() =>
                  setPage(page - 1)
                }
              >
                <ChevronLeft
                  size={17}
                />
                Anterior
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="px-3 py-2"
                disabled={
                  page >= totalPages ||
                  loading
                }
                onClick={() =>
                  setPage(page + 1)
                }
              >
                Próxima
                <ChevronRight
                  size={17}
                />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
