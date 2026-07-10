import { useState } from 'react'
import { Pill } from 'lucide-react'
import { useMedications } from '../../hooks/useMedications'
import type {
  CreateMedicationRequest,
  Medication,
} from '../../types/medication'
import { MedicationEmpty } from '../medications/MedicationEmpty'
import { MedicationForm } from '../medications/MedicationForm'
import { MedicationLoading } from '../medications/MedicationLoading'
import { MedicationModal } from '../medications/MedicationModal'
import { MedicationTable } from '../medications/MedicationTable'
import { MedicationToolbar } from '../medications/MedicationToolbar'
import { Card } from '../ui/Card'
import { StatsCard } from '../ui/StatsCard'

interface MedicationPanelProps {
  elderlyPersonId: string
}

export function MedicationPanel({
  elderlyPersonId,
}: MedicationPanelProps) {
  const {
    items,
    totalItems,
    search,
    selected,
    loading,
    saving,
    error,
    setSearch,
    setSelected,
    load,
    create,
  } = useMedications(elderlyPersonId)

  const [createModalOpen, setCreateModalOpen] = useState(false)

  async function handleCreate(payload: CreateMedicationRequest) {
    await create(payload)
    setCreateModalOpen(false)
  }

  function handleView(medication: Medication) {
    setSelected(medication)
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Tratamentos
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Medicamentos
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Cadastre medicamentos, dosagens, frequências e períodos de uso.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatsCard
          label="Medicamentos cadastrados"
          value={totalItems}
          icon={<Pill size={20} />}
        />

        <StatsCard
          label="Tratamentos exibidos"
          value={items.length}
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <MedicationToolbar
        search={search}
        loading={loading}
        onSearchChange={setSearch}
        onRefresh={load}
        onCreate={() => setCreateModalOpen(true)}
      />

      {loading ? (
        <MedicationLoading />
      ) : items.length === 0 ? (
        <MedicationEmpty />
      ) : (
        <MedicationTable
          items={items}
          onView={handleView}
          onOpenSchedule={handleView}
        />
      )}

      <MedicationModal
        open={createModalOpen}
        title="Novo medicamento"
        description="Cadastre um medicamento no prontuário do idoso."
        onClose={() => setCreateModalOpen(false)}
      >
        <MedicationForm
          elderlyPersonId={elderlyPersonId}
          saving={saving}
          onSubmit={handleCreate}
          onCancel={() => setCreateModalOpen(false)}
        />
      </MedicationModal>

      <MedicationModal
        open={Boolean(selected)}
        title={selected?.name || 'Medicamento'}
        description="Informações do tratamento."
        onClose={() => setSelected(null)}
      >
        {selected && (
          <Card className="space-y-4 p-5">
            <div>
              <p className="text-sm text-slate-500">Dosagem</p>
              <p className="font-semibold text-slate-900">
                {selected.dosage || 'Não informada'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Frequência</p>
              <p className="font-semibold text-slate-900">
                {selected.frequency || 'Não informada'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Observações</p>
              <p className="text-slate-700">
                {selected.notes || 'Nenhuma observação.'}
              </p>
            </div>
          </Card>
        )}
      </MedicationModal>
    </section>
  )
}
