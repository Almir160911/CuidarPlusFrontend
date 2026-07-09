import { useState } from 'react'
import { ElderlyEmpty } from '../../components/elderly/ElderlyEmpty'
import { ElderlyForm } from '../../components/elderly/ElderlyForm'
import { ElderlyLoading } from '../../components/elderly/ElderlyLoading'
import { ElderlyModal } from '../../components/elderly/ElderlyModal'
import { ElderlyTable } from '../../components/elderly/ElderlyTable'
import { ElderlyToolbar } from '../../components/elderly/ElderlyToolbar'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatsCard } from '../../components/ui/StatsCard'
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

  const totalWithDoctor = items.filter((item) => item.doctorName).length
  const totalWithHealthInsurance = items.filter((item) => item.healthInsurance).length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cadastro"
        title="Gestão de Idosos"
        description="Gerencie idosos acompanhados, contatos de emergência, médicos e convênios."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total cadastrado" value={totalItems} />
        <StatsCard label="Com médico" value={totalWithDoctor} />
        <StatsCard label="Com convênio" value={totalWithHealthInsurance} />
        <StatsCard label="Alertas ativos" value={0} />
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