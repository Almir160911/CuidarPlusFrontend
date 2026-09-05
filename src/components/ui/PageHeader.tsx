import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  showBack?: boolean
  backTo?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  showBack = false,
  backTo = '/',
}: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 font-semibold text-slate-600 transition hover:bg-white hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Voltar ao Dashboard"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        )}

        {eyebrow && <p className="text-sm font-medium text-emerald-700">{eyebrow}</p>}
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-2 text-slate-500">{description}</p>}
      </div>

      {actions && <div>{actions}</div>}
    </section>
  )
}
