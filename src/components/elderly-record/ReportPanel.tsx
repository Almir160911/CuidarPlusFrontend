import { useCallback, useEffect, useState } from 'react'
import {
  Download,
  FileText,
  RefreshCw,
} from 'lucide-react'

import { reportService } from '../../services/report.service'
import type {
  ElderlyDetailedReport,
  ElderlySummaryReport,
} from '../../types/report'

import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { LoadingList } from '../ui/LoadingList'
import { StatsCard } from '../ui/StatsCard'

interface ReportPanelProps {
  elderlyPersonId: string
}

function formatDate(date?: string | null) {
  if (!date) {
    return '-'
  }

  return new Date(date).toLocaleString('pt-BR')
}

function ReportList({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <Card className="p-5">
      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Sem registros no período.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export function ReportPanel({
  elderlyPersonId,
}: ReportPanelProps) {
  const [summary, setSummary] =
    useState<ElderlySummaryReport | null>(null)

  const [detailed, setDetailed] =
    useState<ElderlyDetailedReport | null>(null)

  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] =
    useState(false)
  const [error, setError] = useState('')

  const loadReports = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [summaryResult, detailedResult] =
        await Promise.all([
          reportService.getSummary(
            elderlyPersonId,
          ),
          reportService.getDetailed(
            elderlyPersonId,
          ),
        ])

      setSummary(summaryResult)
      setDetailed(detailedResult)
    } catch {
      setSummary(null)
      setDetailed(null)

      setError(
        'Não foi possível carregar os relatórios.',
      )
    } finally {
      setLoading(false)
    }
  }, [elderlyPersonId])

  async function handleDownloadPdf() {
    setDownloading(true)
    setError('')

    try {
      const blob =
        await reportService.downloadPdf(
          elderlyPersonId,
        )

      const url =
        window.URL.createObjectURL(blob)

      const link =
        document.createElement('a')

      link.href = url
      link.download =
        `relatorio-acompanhamento-${elderlyPersonId}.pdf`

      document.body.appendChild(link)

      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch {
      setError(
        'Não foi possível gerar o relatório em PDF.',
      )
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    void loadReports()
  }, [loadReports])

  if (loading) {
    return <LoadingList rows={8} />
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            Relatórios
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Relatório de Acompanhamento
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Resumo do prontuário, histórico recente
            e geração do relatório em PDF.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => void loadReports()}
          >
            <RefreshCw size={17} />
            Atualizar
          </Button>

          <Button
            type="button"
            disabled={downloading}
            onClick={() => void handleDownloadPdf()}
          >
            <Download size={17} />

            {downloading
              ? 'Gerando PDF...'
              : 'Baixar PDF'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {summary && (
        <>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <FileText size={22} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {summary.elderlyPersonName}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Nascimento:{' '}
                  {new Date(
                    summary.birthDate,
                  ).toLocaleDateString('pt-BR')}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Relatório gerado em{' '}
                  {formatDate(summary.generatedAt)}
                </p>
              </div>
            </div>
          </Card>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatsCard
              label="Medicamentos ativos"
              value={summary.activeMedications}
            />

            <StatsCard
              label="Sinais vitais - 30 dias"
              value={summary.vitalSignsLast30Days}
            />

            <StatsCard
              label="Cuidados - 30 dias"
              value={summary.careLogsLast30Days}
            />

            <StatsCard
              label="Próximas consultas"
              value={summary.upcomingAppointments}
            />

            <StatsCard
              label="Alertas não lidos"
              value={summary.unreadAlerts}
            />
          </section>
        </>
      )}

      {detailed && (
        <section className="grid gap-5 lg:grid-cols-2">
          <ReportList
            title="Medicamentos em uso"
            items={detailed.activeMedications}
          />

          <ReportList
            title="Últimos sinais vitais"
            items={detailed.recentVitalSigns}
          />

          <ReportList
            title="Diário de cuidados recente"
            items={detailed.recentCareLogs}
          />

          <ReportList
            title="Consultas e exames futuros"
            items={detailed.upcomingAppointments}
          />

          <ReportList
            title="Alertas não lidos"
            items={detailed.unreadAlerts}
          />
        </section>
      )}
    </section>
  )
}