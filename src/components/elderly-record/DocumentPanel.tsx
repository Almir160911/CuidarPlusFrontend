import { useState } from 'react'
import {
  FileText,
  FolderOpen,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useElderlyDocuments } from '../../hooks/useElderlyDocuments'
import type {
  ElderlyDocument,
  UploadElderlyDocumentRequest,
} from '../../types/elderly-document'
import { DocumentTable } from '../documents/DocumentTable'
import { DocumentUploadForm } from '../documents/DocumentUploadForm'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { LoadingList } from '../ui/LoadingList'
import { Modal } from '../ui/Modal'
import { StatsCard } from '../ui/StatsCard'

interface DocumentPanelProps {
  elderlyPersonId: string
}

export function DocumentPanel({
  elderlyPersonId,
}: DocumentPanelProps) {
  const {
    items,
    allItems,
    selected,
    search,
    loading,
    uploading,
    error,
    setSearch,
    setSelected,
    load,
    upload,
    openDocument,
  } = useElderlyDocuments(elderlyPersonId)

  const [uploadModalOpen, setUploadModalOpen] =
    useState(false)

  async function handleUpload(
    payload: UploadElderlyDocumentRequest,
  ) {
    await upload(payload)
    setUploadModalOpen(false)
  }

  function handleOpen(document: ElderlyDocument) {
    openDocument(document)
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Arquivos do prontuário
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Documentos
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Armazene receitas, exames, documentos pessoais,
          carteiras e termos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatsCard
          label="Documentos cadastrados"
          value={allItems.length}
          icon={<FileText size={20} />}
        />

        <StatsCard
          label="Documentos exibidos"
          value={items.length}
          icon={<FolderOpen size={20} />}
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={18} className="text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Pesquisar por nome, descrição ou formato..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              disabled={loading}
              onClick={load}
            >
              <RefreshCw
                size={17}
                className={loading ? 'animate-spin' : ''}
              />
              Atualizar
            </Button>

            <Button
              onClick={() => setUploadModalOpen(true)}
            >
              <Plus size={17} />
              Novo documento
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <LoadingList rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={32} />}
          title="Nenhum documento encontrado"
          description="Envie o primeiro documento para o prontuário."
        />
      ) : (
        <DocumentTable
          items={items}
          onOpen={handleOpen}
          onView={setSelected}
        />
      )}

      <Modal
        open={uploadModalOpen}
        title="Enviar documento"
        description="Adicione um arquivo ao prontuário do idoso."
        maxWidth="max-w-2xl"
        onClose={() => setUploadModalOpen(false)}
      >
        <DocumentUploadForm
          elderlyPersonId={elderlyPersonId}
          uploading={uploading}
          onSubmit={handleUpload}
          onCancel={() => setUploadModalOpen(false)}
        />
      </Modal>

      <Modal
        open={Boolean(selected)}
        title={selected?.originalFileName || 'Documento'}
        description="Informações do documento armazenado."
        maxWidth="max-w-2xl"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <Card className="space-y-5 p-5">
            <div>
              <p className="text-sm text-slate-500">
                Nome do arquivo
              </p>
              <p className="font-semibold text-slate-900">
                {selected.originalFileName}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Descrição
              </p>
              <p className="text-slate-700">
                {selected.description ||
                  'Nenhuma descrição informada.'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Data de envio
              </p>
              <p className="font-semibold text-slate-900">
                {new Date(
                  selected.uploadedAt,
                ).toLocaleString('pt-BR')}
              </p>
            </div>

            <Button onClick={() => openDocument(selected)}>
              Abrir documento
            </Button>
          </Card>
        )}
      </Modal>
    </section>
  )
}
