import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  Pill,
  UserRound,
} from 'lucide-react'
import { elderlyService } from '../../services/elderly.service'
import type { ElderlyPerson } from '../../types/elderly'

function calculateAge(birthDate?: string) {
  if (!birthDate) return '-'

  const birth = new Date(birthDate)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return `${age} anos`
}

const panels = [
  {
    title: 'Medicamentos',
    description: 'Tratamentos, dosagens e períodos de uso.',
    icon: Pill,
  },
  {
    title: 'Agenda de Medicamentos',
    description: 'Horários, confirmações e pendências.',
    icon: CalendarDays,
  },
  {
    title: 'Sinais Vitais',
    description: 'Pressão, glicemia, temperatura, batimentos e saturação.',
    icon: HeartPulse,
  },
  {
    title: 'Consultas Médicas',
    description: 'Histórico e próximas consultas.',
    icon: UserRound,
  },
  {
    title: 'Diário de Cuidados',
    description: 'Banho, alimentação, humor, dor, quedas e observações.',
    icon: ClipboardList,
  },
  {
    title: 'Alertas',
    description: 'Alertas clínicos, pendências e ocorrências importantes.',
    icon: AlertTriangle,
  },
  {
    title: 'Relatórios',
    description: 'Resumo, relatório detalhado e PDF.',
    icon: FileText,
  },
]

export function ElderlyRecordPage() {
  const { id } = useParams()
  const [elderly, setElderly] = useState<ElderlyPerson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      if (!id) return

      setLoading(true)
      setError('')

      try {
        const result = await elderlyService.getById(id)
        setElderly(result)
      } catch {
        setError('Não foi possível carregar o prontuário do idoso.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-slate-500">Carregando prontuário...</p>
      </div>
    )
  }

  if (error || !elderly) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
        {error || 'Prontuário não encontrado.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        to="/idosos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={17} />
        Voltar para idosos
      </Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm font-medium text-emerald-700">Prontuário do Idoso</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {elderly.fullName || 'Idoso sem nome'}
            </h1>
            <p className="mt-2 text-slate-500">
              {calculateAge(elderly.birthDate)} • Convênio: {elderly.healthInsurance || 'Não informado'}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-800">
            <p className="text-xs font-semibold uppercase">Contato de emergência</p>
            <p className="mt-1 font-bold">{elderly.emergencyContactName || 'Não informado'}</p>
            <p className="text-sm">{elderly.emergencyContactPhone || '-'}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Médico responsável</p>
          <strong className="mt-2 block text-lg text-slate-900">
            {elderly.doctorName || 'Não informado'}
          </strong>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Alergias</p>
          <strong className="mt-2 block text-lg text-slate-900">
            {elderly.allergies || 'Não informado'}
          </strong>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
          <p className="text-sm text-slate-500">Doenças conhecidas</p>
          <strong className="mt-2 block text-lg text-slate-900">
            {elderly.knownDiseases || 'Não informado'}
          </strong>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {panels.map((panel) => {
          const Icon = panel.icon

          return (
            <div
              key={panel.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <Icon size={24} />
              </div>

              <h2 className="text-lg font-bold text-slate-900">{panel.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{panel.description}</p>

              <button className="mt-6 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Abrir módulo
              </button>
            </div>
          )
        })}
      </section>
    </div>
  )
}