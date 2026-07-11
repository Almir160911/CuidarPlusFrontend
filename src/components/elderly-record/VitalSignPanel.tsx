import { useState } from 'react'
import { HeartPulse, Plus, RefreshCw } from 'lucide-react'
import { useVitalSigns } from '../../hooks/useVitalSigns'
import type { CreateVitalSignRequest } from '../../types/vital-sign'
import { VitalSignForm } from '../vital-signs/VitalSignForm'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { LoadingList } from '../ui/LoadingList'
import { Modal } from '../ui/Modal'
import { StatsCard } from '../ui/StatsCard'

interface VitalSignPanelProps {
  elderlyPersonId: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

export function VitalSignPanel({
  elderlyPersonId,
}: VitalSignPanelProps) {
  const {
    items,
    latest,
    loading,
    saving,
    error,
    load,
    create,
  } = useVitalSigns(elderlyPersonId)

  const [formOpen, setFormOpen] = useState(false)

  async function handleCreate(payload: CreateVitalSignRequest) {
    await create(payload)
    setFormOpen(false)
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Monitoramento clínico
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Sinais Vitais
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="Registros" value={items.length} />
        <StatsCard
          label="Pressão"
          value={latest?.bloodPressure || '-'}
        />
        <StatsCard
          label="Glicemia"
          value={latest?.bloodGlucose ?? '-'}
        />
        <StatsCard
          label="Temperatura"
          value={
            latest?.temperature !== null &&
            latest?.temperature !== undefined
              ? `${latest.temperature} °C`
              : '-'
          }
        />
        <StatsCard
          label="Saturação"
          value={
            latest?.oxygenSaturation !== null &&
            latest?.oxygenSaturation !== undefined
              ? `${latest.oxygenSaturation}%`
              : '-'
          }
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={load}>
          <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </Button>

        <Button onClick={() => setFormOpen(true)}>
          <Plus size={17} />
          Novo registro
        </Button>
      </div>

      {loading ? (
        <LoadingList rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<HeartPulse size={32} />}
          title="Nenhum sinal vital registrado"
          description="Registre os primeiros sinais vitais deste idoso."
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4">Data</th>
                <th className="px-5 py-4">Pressão</th>
                <th className="px-5 py-4">Glicemia</th>
                <th className="px-5 py-4">Temperatura</th>
                <th className="px-5 py-4">Frequência</th>
                <th className="px-5 py-4">Saturação</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    {formatDate(item.registeredAt)}
                  </td>
                  <td className="px-5 py-4">
                    {item.bloodPressure || '-'}
                  </td>
                  <td className="px-5 py-4">
                    {item.bloodGlucose ?? '-'}
                  </td>
                  <td className="px-5 py-4">
                    {item.temperature ?? '-'}
                  </td>
                  <td className="px-5 py-4">
                    {item.heartRate ?? '-'}
                  </td>
                  <td className="px-5 py-4">
                    {item.oxygenSaturation ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={formOpen}
        title="Novo registro de sinais vitais"
        description="Registre as medições realizadas."
        maxWidth="max-w-2xl"
        onClose={() => setFormOpen(false)}
      >
        <VitalSignForm
          elderlyPersonId={elderlyPersonId}
          saving={saving}
          onSubmit={handleCreate}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </section>
  )
}
