export function ElderlyLoading() {
  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  )
}