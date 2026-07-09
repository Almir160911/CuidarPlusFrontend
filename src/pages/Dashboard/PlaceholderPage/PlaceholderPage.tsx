export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-emerald-700">Módulo Cuidar+</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-500">
        Este módulo será desenvolvido nas próximas etapas do frontend.
      </p>
    </div>
  )
}