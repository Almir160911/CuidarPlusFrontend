import axios from 'axios'
import {
  CalendarClock,
  HeartHandshake,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import { careNetworkService } from '../../services/care-network.service'
import type { CareNetwork } from '../../types/care-network'

const roleLabels: Record<number, string> = {
  1: 'Administrador familiar',
  2: 'Cuidador',
  3: 'Familiar',
  4: 'Pessoa assistida',
  5: 'Administrador do sistema',
}

const relationshipLabels: Record<number, string> = {
  1: 'A própria pessoa',
  2: 'Familiar',
  3: 'Responsável legal',
  4: 'Cuidador profissional',
  5: 'Cuidador informal',
  99: 'Outro vínculo',
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'CP'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function formatShift(start: string, end: string) {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${formatter.format(new Date(start))} até ${formatter.format(new Date(end))}`
}

function errorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return 'Não foi possível carregar a rede de cuidado.'
  const data = error.response?.data as { message?: string; errors?: string[] } | undefined
  return data?.errors?.join(' ') || data?.message || 'Não foi possível carregar a rede de cuidado.'
}

export function CareNetworkPage() {
  const [network, setNetwork] = useState<CareNetwork | null>(null)
  const [photos, setPhotos] = useState<Record<string, string>>({})
  const photoUrlsRef = useRef<string[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearPhotoUrls = useCallback(() => {
    photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    photoUrlsRef.current = []
  }, [])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await careNetworkService.get()
      const loadedPhotos: Record<string, string> = {}

      await Promise.all(result.members.filter((member) => member.hasPhoto).map(async (member) => {
        try {
          const blob = await careNetworkService.downloadMemberPhoto(member.id)
          loadedPhotos[member.id] = URL.createObjectURL(blob)
        } catch {
          // As iniciais permanecem como alternativa quando a foto não estiver disponível.
        }
      }))

      clearPhotoUrls()
      photoUrlsRef.current = Object.values(loadedPhotos)
      setPhotos(loadedPhotos)
      setNetwork(result)
    } catch (loadError) {
      setError(errorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [clearPhotoUrls])

  useEffect(() => {
    void load()
    return clearPhotoUrls
  }, [clearPhotoUrls, load])

  const members = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    if (!normalized) return network?.members ?? []
    return (network?.members ?? []).filter((member) =>
      `${member.fullName} ${member.email} ${roleLabels[member.role] ?? ''}`
        .toLocaleLowerCase('pt-BR')
        .includes(normalized),
    )
  }, [network, query])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Família e cuidadores"
        title="Rede de cuidado"
        description="Veja quem participa do cuidado, os vínculos autorizados e os próximos turnos."
        actions={<Button variant="secondary" onClick={() => void load()} disabled={loading}><RefreshCw size={18} />Atualizar</Button>}
      />

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {network && (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><UsersRound className="text-emerald-600" size={22} /><p className="mt-3 text-sm text-slate-500">Familiares</p><strong className="text-3xl text-slate-900">{network.familyMembersCount}</strong></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><HeartHandshake className="text-emerald-600" size={22} /><p className="mt-3 text-sm text-slate-500">Cuidadores</p><strong className="text-3xl text-slate-900">{network.caregiversCount}</strong></div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><ShieldCheck className="text-emerald-600" size={22} /><p className="mt-3 text-sm text-slate-500">Participantes ativos</p><strong className="text-3xl text-slate-900">{network.activeMembersCount}</strong></div>
        </section>
      )}

      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <span className="sr-only">Pesquisar na rede de cuidado</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar por nome, e-mail ou função" className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
      </label>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500">Carregando sua rede de cuidado...</div>
      ) : members.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><UserRound className="mx-auto text-emerald-600" /><h2 className="mt-3 font-semibold text-slate-900">Nenhum participante encontrado</h2><p className="mt-1 text-sm text-slate-500">Altere a pesquisa ou cadastre pessoas na organização.</p></div>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {members.map((member) => (
            <article key={member.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                {photos[member.id] ? <img src={photos[member.id]} alt={`Foto de ${member.fullName}`} className="h-16 w-16 shrink-0 rounded-2xl object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-700">{initials(member.fullName)}</div>}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-900">{member.fullName}</h2>{member.isCurrentUser && <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">Você</span>}<span className={`rounded-full px-2 py-1 text-xs font-semibold ${member.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{member.isActive ? 'Ativo' : 'Inativo'}</span></div>
                  <p className="mt-1 text-sm font-medium text-emerald-700">{roleLabels[member.role] ?? 'Participante'}</p>
                  <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-slate-500"><Mail size={16} className="shrink-0" /><span className="truncate">{member.email}</span></p>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pessoas acompanhadas</p>
                {member.assistedPeople.length === 0 ? <p className="mt-2 text-sm text-slate-500">Nenhum vínculo direto cadastrado.</p> : <div className="mt-2 flex flex-wrap gap-2">{member.assistedPeople.map((person) => <span key={person.id} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">{person.fullName} · {relationshipLabels[person.relationshipType] ?? 'Vínculo autorizado'}</span>)}</div>}
              </div>

              {member.nextShift && <div className="mt-4 rounded-2xl bg-emerald-50 p-4"><p className="flex items-center gap-2 text-sm font-semibold text-emerald-800"><CalendarClock size={17} />Próximo turno</p><p className="mt-1 text-sm text-emerald-900">{member.nextShift.elderlyPersonName}</p><p className="mt-1 text-xs text-emerald-700">{formatShift(member.nextShift.scheduledStartAt, member.nextShift.scheduledEndAt)}</p></div>}
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
