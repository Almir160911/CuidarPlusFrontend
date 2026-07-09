import { Users } from 'lucide-react'
import { EmptyState } from '../ui/EmptyState'

export function ElderlyEmpty() {
  return (
    <EmptyState
      icon={<Users size={32} />}
      title="Nenhum idoso encontrado"
      description="Cadastre o primeiro idoso para iniciar o acompanhamento de medicamentos, consultas, sinais vitais e cuidados diários."
    />
  )
}