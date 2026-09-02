import {
  Activity,
  AlertTriangle,
  Cable,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  Pill,
  Stethoscope,
  Users,
  Watch,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { authService } from '../../../services/auth.service'

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

const adminMenuItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: Home,
  },
  {
    label: 'Idosos',
    path: '/idosos',
    icon: Users,
  },
  {
    label: 'Medicamentos',
    path: '/medicamentos',
    icon: Pill,
  },
  {
    label: 'Agendamentos',
    path: '/agendamentos',
    icon: CalendarDays,
  },
  {
    label: 'Cuidados',
    path: '/cuidados',
    icon: ClipboardList,
  },
  {
    label: 'Sinais Vitais',
    path: '/sinais-vitais',
    icon: HeartPulse,
  },
  {
    label: 'Dispositivos',
    path: '/dispositivos',
    icon: Watch,
  },
  {
    label: 'Integração de saúde',
    path: '/integracao-saude',
    icon: Cable,
  },
  {
    label: 'Consultas',
    path: '/consultas',
    icon: Stethoscope,
  },
  {
    label: 'Alertas',
    path: '/alertas',
    icon: AlertTriangle,
  },
  {
    label: 'Relatórios',
    path: '/relatorios',
    icon: FileText,
  },
]

const linkedUserMenuItems = [
  {
    label: 'Minhas pessoas',
    path: '/minhas-pessoas',
    icon: Users,
  },
  {
    label: 'Agendamentos',
    path: '/agendamentos',
    icon: CalendarDays,
  },
]

function isGlobalAdmin(): boolean {
  const role =
    authService.getUser()?.role?.toLowerCase()

  return (
    role === 'systemadmin' ||
    role === 'familyadmin'
  )
}

export function Sidebar({
  mobileOpen,
  onClose,
}: SidebarProps) {
  const menuItems =
    isGlobalAdmin()
      ? adminMenuItems
      : linkedUserMenuItems

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu de navegação"
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 lg:z-40 lg:translate-x-0 lg:shadow-none',
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <Activity size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-slate-900">
              Cuidar+
            </h1>

            <p className="text-xs text-slate-500">
              Gestão de cuidados
            </p>
          </div>

          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
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
    </>
  )
}