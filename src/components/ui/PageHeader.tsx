import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        {eyebrow && <p className="text-sm font-medium text-emerald-700">{eyebrow}</p>}
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-2 text-slate-500">{description}</p>}
      </div>

      {actions && <div>{actions}</div>}
    </section>
  )
}