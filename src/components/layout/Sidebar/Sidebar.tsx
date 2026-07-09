import { Activity, AlertTriangle, CalendarDays, ClipboardList, HeartPulse, Home, Pill, Stethoscope, Users, FileText } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', path: '/', icon: Home },
  { label: 'Idosos', path: '/idosos', icon: Users },
  { label: 'Medicamentos', path: '/medicamentos', icon: Pill },
  { label: 'Agendamentos', path: '/agendamentos', icon: CalendarDays },
  { label: 'Cuidados', path: '/cuidados', icon: ClipboardList },
  { label: 'Sinais Vitais', path: '/sinais-vitais', icon: HeartPulse },
  { label: 'Consultas', path: '/consultas', icon: Stethoscope },
  { label: 'Alertas', path: '/alertas', icon: AlertTriangle },
  { label: 'Relatórios', path: '/relatorios', icon: FileText },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
          <Activity size={24} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">Cuidar+</h1>
          <p className="text-xs text-slate-500">Gestão de cuidados</p>
        </div>
      </div>

      <nav className="space-y-1 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}