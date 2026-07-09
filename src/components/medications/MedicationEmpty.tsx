import { Pill } from 'lucide-react'
import { EmptyState } from '../ui/EmptyState'

export function MedicationEmpty() {
  return (
    <EmptyState
      icon={<Pill size={32} />}
      title="Nenhum medicamento encontrado"
      description="Selecione um idoso e cadastre os medicamentos utilizados no acompanhamento."
    />
  )
}