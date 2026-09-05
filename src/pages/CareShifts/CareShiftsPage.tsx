import { useState, type FormEvent } from 'react'
import { CalendarClock, CheckCircle2, Clock3, Play, RefreshCw, XCircle } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { useCareShifts } from '../../hooks/useCareShifts'
import type { CareShift } from '../../types/care-shift'

const statusLabel: Record<number, string> = { 1: 'Agendado', 2: 'Em andamento', 3: 'Encerrado', 4: 'Cancelado' }
const statusClass: Record<number, string> = { 1: 'bg-blue-50 text-blue-700', 2: 'bg-amber-50 text-amber-700', 3: 'bg-emerald-50 text-emerald-700', 4: 'bg-slate-100 text-slate-600' }

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : '—'
}

export function CareShiftsPage() {
  const shifts = useCareShifts()
  const [formOpen, setFormOpen] = useState(false)
  const [caregiverUserId, setCaregiverUserId] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [caregiverFormOpen, setCaregiverFormOpen] = useState(false)
  const [caregiverName, setCaregiverName] = useState('')
  const [caregiverEmail, setCaregiverEmail] = useState('')
  const [caregiverPassword, setCaregiverPassword] = useState('')
  const [completing, setCompleting] = useState<CareShift | null>(null)
  const [summary, setSummary] = useState('')
  const [occurrences, setOccurrences] = useState('')
  const [pendingNotes, setPendingNotes] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!shifts.selectedPersonId || !caregiverUserId || !startAt || !endAt) return
    await shifts.create({ elderlyPersonId: shifts.selectedPersonId, caregiverUserId,
      scheduledStartAt: new Date(startAt).toISOString(), scheduledEndAt: new Date(endAt).toISOString() })
    setFormOpen(false); setCaregiverUserId(''); setStartAt(''); setEndAt('')
  }

  async function createCaregiver(event: FormEvent) {
    event.preventDefault()
    const created = await shifts.createCaregiver({
      fullName: caregiverName,
      email: caregiverEmail,
      temporaryPassword: caregiverPassword,
      role: 2,
    })
    setCaregiverUserId(created.id)
    setCaregiverFormOpen(false)
    setCaregiverName(''); setCaregiverEmail(''); setCaregiverPassword('')
  }

  async function complete(event: FormEvent) {
    event.preventDefault()
    if (!completing) return
    await shifts.complete(completing.id, { summary, occurrences, pendingNotes })
    setCompleting(null); setSummary(''); setOccurrences(''); setPendingNotes('')
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Organização do cuidado" title="Turnos de cuidado"
        description="Acompanhe quem está cuidando, os horários e a passagem de turno. Este registro não substitui controle formal de ponto."
        actions={<Button variant="secondary" onClick={shifts.refresh}><RefreshCw size={18} />Atualizar</Button>} />

      {shifts.error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{shifts.error}</div>}

      {shifts.isAdmin && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm font-medium text-slate-700">Pessoa assistida
              <select value={shifts.selectedPersonId} onChange={(e) => shifts.selectPerson(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                {shifts.people.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
            </label>
            <Button onClick={() => setFormOpen((v) => !v)}><CalendarClock size={18} />Agendar turno</Button>
          </div>
          {formOpen && <form onSubmit={submit} className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-3">
            <label className="text-sm font-medium text-slate-700">Cuidador
              <select required disabled={shifts.caregivers.length === 0} value={caregiverUserId} onChange={(e) => setCaregiverUserId(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 disabled:bg-slate-100 disabled:text-slate-500">
                <option value="">{shifts.caregivers.length === 0 ? 'Nenhum cuidador cadastrado' : 'Selecione o cuidador'}</option>{shifts.caregivers.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">Início previsto<input required type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="text-sm font-medium text-slate-700">Término previsto<input required type="datetime-local" value={endAt} min={startAt} onChange={(e) => setEndAt(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            {shifts.caregivers.length === 0 && <div className="md:col-span-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Cadastre primeiro a pessoa que realizará o cuidado.</p>
              <p className="mt-1">Ela receberá um acesso próprio e visualizará os turnos atribuídos.</p>
              <button type="button" onClick={() => setCaregiverFormOpen(true)} className="mt-3 font-semibold text-emerald-700 underline underline-offset-4">Cadastrar cuidador agora</button>
            </div>}
            <div className="md:col-span-3 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancelar</Button><Button type="submit" disabled={shifts.saving || !caregiverUserId}>Salvar turno</Button></div>
          </form>}
        </section>
      )}

      {caregiverFormOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-6">
        <form onSubmit={createCaregiver} className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
          <h2 className="text-xl font-bold text-slate-900">Cadastrar cuidador</h2>
          <p className="mt-1 text-sm text-slate-500">Crie o acesso da pessoa que realizará os turnos de cuidado.</p>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700">Nome completo<input required maxLength={150} value={caregiverName} onChange={(e) => setCaregiverName(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="block text-sm font-medium text-slate-700">E-mail<input required type="email" maxLength={150} value={caregiverEmail} onChange={(e) => setCaregiverEmail(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="block text-sm font-medium text-slate-700">Senha temporária<input required type="password" minLength={8} maxLength={128} value={caregiverPassword} onChange={(e) => setCaregiverPassword(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /><span className="mt-1 block text-xs font-normal text-slate-500">Use maiúscula, minúscula, número e símbolo. O cuidador deverá receber essa senha com segurança.</span></label>
          </div>
          <div className="mt-6 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => setCaregiverFormOpen(false)}>Cancelar</Button><Button type="submit" disabled={shifts.saving}>Cadastrar e selecionar</Button></div>
        </form>
      </div>}

      {shifts.loading ? <div className="rounded-3xl bg-white p-8 text-center text-slate-500">Carregando turnos...</div> : shifts.items.length === 0 ?
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><Clock3 className="mx-auto text-emerald-600" /><h2 className="mt-3 font-semibold text-slate-900">Nenhum turno encontrado</h2><p className="mt-1 text-sm text-slate-500">Os turnos agendados aparecerão aqui.</p></div> :
        <section className="grid gap-4 xl:grid-cols-2">{shifts.items.map((item) => <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-slate-900">{item.elderlyPersonName || 'Pessoa assistida'}</h2><p className="text-sm text-slate-500">Cuidador: {item.caregiverName || 'Não identificado'}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[item.status]}`}>{statusLabel[item.status]}</span></div>
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm"><div><span className="text-slate-500">Início previsto</span><p className="font-medium">{formatDate(item.scheduledStartAt)}</p></div><div><span className="text-slate-500">Término previsto</span><p className="font-medium">{formatDate(item.scheduledEndAt)}</p></div></div>
          {(item.summary || item.occurrences || item.pendingNotes) && <div className="mt-4 space-y-2 text-sm">{item.summary && <p><strong>Resumo:</strong> {item.summary}</p>}{item.occurrences && <p><strong>Ocorrências:</strong> {item.occurrences}</p>}{item.pendingNotes && <p><strong>Pendências:</strong> {item.pendingNotes}</p>}</div>}
          <div className="mt-5 flex flex-wrap justify-end gap-2">{item.status === 1 && <Button disabled={shifts.saving} onClick={() => shifts.start(item.id)}><Play size={17} />Iniciar</Button>}{item.status === 2 && <Button disabled={shifts.saving} onClick={() => setCompleting(item)}><CheckCircle2 size={17} />Encerrar</Button>}{shifts.isAdmin && (item.status === 1 || item.status === 2) && <Button variant="danger" disabled={shifts.saving} onClick={() => window.confirm('Cancelar este turno?') && shifts.cancel(item.id)}><XCircle size={17} />Cancelar</Button>}</div>
        </article>)}</section>}

      {completing && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-6">
        <form onSubmit={complete} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
          <h2 className="text-xl font-bold text-slate-900">Encerrar turno</h2>
          <p className="mt-1 text-sm text-slate-500">Registre uma passagem de turno clara para a família e o próximo cuidador.</p>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700">Resumo do cuidado<textarea required maxLength={2000} value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="block text-sm font-medium text-slate-700">Ocorrências (opcional)<textarea maxLength={2000} value={occurrences} onChange={(e) => setOccurrences(e.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
            <label className="block text-sm font-medium text-slate-700">Pendências para o próximo cuidador (opcional)<textarea maxLength={2000} value={pendingNotes} onChange={(e) => setPendingNotes(e.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label>
          </div>
          <div className="mt-6 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => setCompleting(null)}>Voltar</Button><Button type="submit" disabled={shifts.saving}>Confirmar encerramento</Button></div>
        </form>
      </div>}
    </div>
  )
}
