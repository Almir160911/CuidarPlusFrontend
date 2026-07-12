
import {
  AlertTriangle,
  Bath,
  HeartPulse,
  Moon,
  Smile,
  Utensils,
} from 'lucide-react'
import type { CareLog } from '../../types/care-log'
import { Card } from '../ui/Card'

interface CareLogDetailsProps {
  item: CareLog
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 text-emerald-700">
        {icon}
        <p className="text-sm font-semibold">{label}</p>
      </div>

      <p className="mt-3 font-semibold text-slate-900">
        {value}
      </p>
    </Card>
  )
}

export function CareLogDetails({
  item,
}: CareLogDetailsProps) {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <p className="text-sm text-slate-500">
          Registrado em
        </p>

        <p className="mt-1 text-xl font-bold text-slate-900">
          {formatDate(item.registeredAt)}
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailItem
          label="Alimentação"
          value={item.hadMeal ? 'Realizada' : 'Não realizada'}
          icon={<Utensils size={20} />}
        />

        <DetailItem
          label="Banho"
          value={item.hadBath ? 'Realizado' : 'Não realizado'}
          icon={<Bath size={20} />}
        />

        <DetailItem
          label="Sono"
          value={item.sleepQuality || 'Não informado'}
          icon={<Moon size={20} />}
        />

        <DetailItem
          label="Humor"
          value={item.mood || 'Não informado'}
          icon={<Smile size={20} />}
        />

        <DetailItem
          label="Dor"
          value={item.hadPain ? 'Sim' : 'Não'}
          icon={<HeartPulse size={20} />}
        />

        <DetailItem
          label="Queda"
          value={item.hadFall ? 'Sim' : 'Não'}
          icon={<AlertTriangle size={20} />}
        />
      </div>

      <Card className="p-5">
        <p className="text-sm font-semibold text-slate-700">
          Observações
        </p>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
          {item.notes || 'Nenhuma observação registrada.'}
        </p>
      </Card>
    </div>
  )
}
