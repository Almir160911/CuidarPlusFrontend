import {
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Pill,
  Users,
} from 'lucide-react'

const cards = [
  {
    title: 'Idosos cadastrados',
    value: '0',
    description: 'Pessoas acompanhadas',
    icon: Users,
  },
  {
    title: 'Medicamentos',
    value: '0',
    description: 'Tratamentos ativos',
    icon: Pill,
  },
  {
    title: 'Consultas',
    value: '0',
    description: 'Agenda médica',
    icon: CalendarDays,
  },
  {
    title: 'Alertas',
    value: '0',
    description: 'Pendências críticas',
    icon: AlertTriangle,
  },
]

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-emerald-700">Portal Administrativo</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Dashboard Cuidar+</h1>
        <p className="mt-2 text-slate-500">
          Visão geral dos cuidados, medicamentos, sinais vitais e alertas.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <Icon size={24} />
                </div>
              </div>

              <p className="mt-6 text-sm font-medium text-slate-500">{card.title}</p>
              <h2 className="mt-2 text-4xl font-bold text-slate-900">{card.value}</h2>
              <p className="mt-1 text-sm text-slate-400">{card.description}</p>
            </div>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">Últimos cuidados registrados</h2>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Nenhum cuidado registrado ainda.
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <HeartPulse className="text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">Sinais vitais</h2>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Nenhum registro disponível.
          </div>
        </div>
      </section>
    </div>
  )
}