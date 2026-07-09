import { LogOut, Menu, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../../services/auth.service'

export function Topbar() {
  const navigate = useNavigate()

  function handleLogout() {
    authService.logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden">
          <Menu size={21} />
        </button>

        <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 sm:flex">
          <Search size={18} className="text-slate-400" />
          <input
            className="w-72 bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Pesquisar no Cuidar+..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">Administrador</p>
          <p className="text-xs text-slate-500">Portal Cuidar+</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <LogOut size={17} />
          Sair
        </button>
      </div>
    </header>
  )
}