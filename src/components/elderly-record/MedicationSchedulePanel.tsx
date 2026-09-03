import { useEffect, useState } from 'react'
import {
  Clock,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { useMedications } from '../../hooks/useMedications'
import { useMedicationSchedules } from '../../hooks/useMedicationSchedules'
import type { Medication } from '../../types/medication'
import { MedicationScheduleForm } from '../medication-schedules/MedicationScheduleForm'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { LoadingList } from '../ui/LoadingList'
import { Modal } from '../ui/Modal'

interface MedicationSchedulePanelProps {
  elderlyPersonId: string
}

function formatTime(value?: string) {
  if (!value) return '-'

  return value.substring(0, 5)
}

export function MedicationSchedulePanel({
  elderlyPersonId,
}: MedicationSchedulePanelProps) {
  const {
    items: medications,
    loading: medicationsLoading,
    error: medicationsError,
  } = useMedications(elderlyPersonId)

  const [selectedMedicationId, setSelectedMedicationId] =
    useState('')

  const [formOpen, setFormOpen] = useState(false)

  const {
    items: schedules,
    loading,
    saving,
    error,
    load,
    create,
  } = useMedicationSchedules(selectedMedicationId)

  useEffect(() => {
    if (!selectedMedicationId && medications.length > 0) {
      setSelectedMedicationId(medications[0].id ?? '')
    }
  }, [medications, selectedMedicationId])

  const selectedMedication: Medication | undefined =
    medications.find(
      (item) => item.id === selectedMedicationId,
    )

  if (medicationsLoading) {
    return <LoadingList rows={5} />
  }

  if (medicationsError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
        {medicationsError}
      </div>
    )
  }

  if (medications.length === 0) {
    return (
      <EmptyState
        icon={<Clock size={32} />}
        title="Nenhum medicamento disponível"
        description="Cadastre primeiro um medicamento para depois definir os horários de administração."
      />
    )
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Administração
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Agenda de Medicamentos
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Defina os horários recorrentes. As administrações são
          confirmadas na Agenda diária.
        </p>
      </div>

      <Card className="p-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Medicamento
          </span>

          <select
            value={selectedMedicationId}
            onChange={(event) =>
              setSelectedMedicationId(event.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            {medications.map((medication) => (
              <option
                key={medication.id}
                value={medication.id}
              >
                {medication.name} — {medication.dosage}
              </option>
            ))}
          </select>
        </label>
      </Card>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">
            {selectedMedication?.name}
          </p>

          <p className="text-sm text-slate-500">
            {selectedMedication?.dosage} •{' '}
            {selectedMedication?.frequency}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            disabled={loading}
            onClick={load}
          >
            <RefreshCw
              size={17}
              className={loading ? 'animate-spin' : ''}
            />
            Atualizar
          </Button>

          <Button onClick={() => setFormOpen(true)}>
            <Plus size={17} />
            Novo horário
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingList rows={5} />
      ) : schedules.length === 0 ? (
        <EmptyState
          icon={<Clock size={32} />}
          title="Nenhum horário cadastrado"
          description="Cadastre os horários em que este medicamento deverá ser administrado."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">
                    Horário programado
                  </p>

                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {formatTime(schedule.scheduledTime)}
                  </p>
                </div>

                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                  Recorrente
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        title="Novo horário"
        description={`Defina um horário para ${
          selectedMedication?.name ?? 'o medicamento'
        }.`}
        maxWidth="max-w-lg"
        onClose={() => setFormOpen(false)}
      >
        <MedicationScheduleForm
          medicationId={selectedMedicationId}
          saving={saving}
          onSubmit={async (payload) => {
            await create(payload)
            setFormOpen(false)
          }}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </section>
  )
}
