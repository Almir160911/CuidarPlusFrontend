import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  FileText,
  RefreshCw,
  UserRound,
} from 'lucide-react'

import { ReportPanel } from '../../components/elderly-record/ReportPanel'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingList } from '../../components/ui/LoadingList'

import { elderlyService } from '../../services/elderly.service'
import type { ElderlyPerson } from '../../types/elderly'

export function ReportsPage() {
  const [elderlyPeople, setElderlyPeople] =
    useState<ElderlyPerson[]>([])

  const [selectedId, setSelectedId] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const loadElderlyPeople =
    useCallback(async () => {
      setLoading(true)
      setError('')

      try {
        const result =
          await elderlyService.list({
            page: 1,
            pageSize: 100,
          })

        setElderlyPeople(result.items)

        setSelectedId((current) => {
          if (
            current &&
            result.items.some(
              (item) => item.id === current,
            )
          ) {
            return current
          }

          return result.items[0]?.id ?? ''
        })
      } catch {
        setElderlyPeople([])
        setSelectedId('')

        setError(
          'Não foi possível carregar as pessoas assistidas.',
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    void loadElderlyPeople()
  }, [loadElderlyPeople])

  return (
    <main className="space-y-6">
      <section>
        <p className="text-sm font-medium text-emerald-700">
          Acompanhamento
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Relatórios
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Consulte o resumo do prontuário,
          informações detalhadas e gere o
          relatório médico em PDF.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label
              htmlFor="report-elderly"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Pessoa assistida
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                id="report-elderly"
                value={selectedId}
                disabled={
                  loading ||
                  elderlyPeople.length === 0
                }
                onChange={(event) =>
                  setSelectedId(
                    event.target.value,
                  )
                }
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {elderlyPeople.length === 0 ? (
                  <option value="">
                    Nenhuma pessoa disponível
                  </option>
                ) : (
                  elderlyPeople.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.fullName}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() =>
              void loadElderlyPeople()
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
      ) : elderlyPeople.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} />}
          title="Nenhuma pessoa assistida disponível"
          description="Cadastre uma pessoa assistida para gerar relatórios de acompanhamento."
        />
      ) : selectedId ? (
        <ReportPanel
          key={selectedId}
          elderlyPersonId={selectedId}
        />
      ) : null}
    </main>
  )
}
