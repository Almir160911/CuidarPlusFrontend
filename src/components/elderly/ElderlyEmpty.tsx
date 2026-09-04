import { Users } from 'lucide-react'
import { EmptyState } from '../ui/EmptyState'

export function ElderlyEmpty() {
  return (
    <EmptyState
      icon={<Users size={32} />}
      title="Nenhuma pessoa assistida encontrada"
      description="Cadastre a primeira pessoa assistida para iniciar o acompanhamento de medicamentos, consultas, sinais vitais e cuidados diários."
    />
  )
}
