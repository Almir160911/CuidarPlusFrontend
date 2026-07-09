import type { ReactNode } from 'react'
import { Card } from './Card'

interface StatsCardProps {
  label: string
  value: string | number
  icon?: ReactNode
}

export function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {icon && <div className="text-emerald-700">{icon}</div>}
      </div>

      <strong className="mt-2 block text-3xl text-slate-900">{value}</strong>
    </Card>
  )
}