import { useState } from 'react'
import { ElderlyEmpty } from '../../components/elderly/ElderlyEmpty'
import { ElderlyForm } from '../../components/elderly/ElderlyForm'
import { ElderlyLoading } from '../../components/elderly/ElderlyLoading'
import { ElderlyModal } from '../../components/elderly/ElderlyModal'
import { ElderlyTable } from '../../components/elderly/ElderlyTable'
import { ElderlyToolbar } from '../../components/elderly/ElderlyToolbar'
import { useElderly } from '../../hooks/useElderly'
import type { CreateElderlyPersonRequest } from '../../types/elderly'

export function ElderlyPage() {
  const {
    items,
    totalItems,
    search,
    loading,
    saving,
    error,
    setSearch,
    load,
    create,
  } = useElderly()

  const [modalOpen, setModalOpen] = useState(false)

  async function handleCreate(data: CreateElderlyPersonRequest) {
    await create(data)
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-emerald-700">Cadastro</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Gestão de Idosos</h1>
        <p className="mt-2 text-slate-500">
          Gerencie idosos acompanhados, contatos de emergência, médicos e convênios.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total cadastrado</p>
          <strong className="mt-2 block text-3xl text-slate-900">{totalItems}</strong>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Com médico</p>
          <strong className="mt-2 block text-3xl text-slate-900">
            {items.filter((item) => item.doctorName).length}
          </strong>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Com convênio</p>
          <strong className="mt-2 block text-3xl text-slate-900">
            {items.filter((item) => item.healthInsurance).length}
          </strong>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Alertas ativos</p>
          <strong className="mt-2 block text-3xl text-slate-900">0</strong>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <ElderlyToolbar
        search={search}
        loading={loading}
        onSearchChange={setSearch}
        onRefresh={load}
        onCreate={() => setModalOpen(true)}
      />

      {loading ? (
        <ElderlyLoading />
      ) : items.length === 0 ? (
        <ElderlyEmpty />
      ) : (
        <ElderlyTable items={items} />
      )}

      <ElderlyModal
        open={modalOpen}
        title="Novo idoso"
        description="Cadastre uma pessoa acompanhada pelo Cuidar+."
        onClose={() => setModalOpen(false)}
      >
        <ElderlyForm
          saving={saving}
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </ElderlyModal>
    </div>
  )
}