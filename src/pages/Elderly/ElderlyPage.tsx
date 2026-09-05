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
import type {
  CreateElderlyPersonRequest,
  ElderlyPerson,
} from '../../types/elderly'

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
    update,
    setStatus,
  } = useElderly()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ElderlyPerson | null>(null)

  async function handleCreate(data: CreateElderlyPersonRequest) {
    await create(data)
    setModalOpen(false)
  }

  async function handleUpdate(data: CreateElderlyPersonRequest) {
    if (!editing?.id) return
    await update(editing.id, data)
    setEditing(null)
  }

  async function handleStatusChange(item: ElderlyPerson) {
    if (!item.id) return

    const active = item.isActive !== false
    const confirmed = window.confirm(
      active
        ? `Arquivar ${item.fullName}? Todo o histórico será preservado.`
        : `Reativar ${item.fullName}?`,
    )

    if (confirmed) await setStatus(item.id, !active)
  }

  const totalWithDoctor = items.filter((item) => item.doctorName).length
  const totalWithHealthInsurance = items.filter((item) => item.healthInsurance).length

  return (
    <div className="space-y-6">
      <PageHeader
        showBack
        eyebrow="Cadastro"
        title="Pessoas assistidas"
        description="Gerencie as pessoas acompanhadas, seus contatos de emergência, médicos e convênios."
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
        <ElderlyTable
          items={items}
          busy={saving}
          onEdit={setEditing}
          onStatusChange={handleStatusChange}
        />
      )}

      <ElderlyModal
        open={modalOpen}
        title="Nova pessoa assistida"
        description="Cadastre uma pessoa acompanhada pelo Cuidar+."
        onClose={() => setModalOpen(false)}
      >
        <ElderlyForm
          saving={saving}
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </ElderlyModal>

      <ElderlyModal
        open={editing !== null}
        title="Editar cadastro"
        description="Atualize os dados sem alterar o histórico de cuidados."
        onClose={() => setEditing(null)}
      >
        <ElderlyForm
          initialData={editing}
          saving={saving}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      </ElderlyModal>
    </div>
  )
}
