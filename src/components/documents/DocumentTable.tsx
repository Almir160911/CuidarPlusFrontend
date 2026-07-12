import {
  ExternalLink,
  FileImage,
  FileText,
  FolderOpen,
} from 'lucide-react'
import {
  DocumentType,
  type ElderlyDocument,
} from '../../types/elderly-document'

interface DocumentTableProps {
  items: ElderlyDocument[]
  onOpen: (document: ElderlyDocument) => void
  onView: (document: ElderlyDocument) => void
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

function getDocumentTypeLabel(type: number) {
  const labels: Record<number, string> = {
    [DocumentType.Prescription]: 'Receita médica',
    [DocumentType.MedicalExam]: 'Exame médico',
    [DocumentType.HospitalDischarge]: 'Alta hospitalar',
    [DocumentType.IdentityDocument]: 'Documento pessoal',
    [DocumentType.HealthInsuranceCard]: 'Carteira do convênio',
    [DocumentType.ConsentTerm]: 'Termo de consentimento',
    [DocumentType.Other]: 'Outro',
  }

  return labels[type] ?? 'Documento'
}

function DocumentIcon({
  contentType,
}: {
  contentType: string
}) {
  if (contentType.startsWith('image/')) {
    return <FileImage size={19} />
  }

  return <FileText size={19} />
}

export function DocumentTable({
  items,
  onOpen,
  onView,
}: DocumentTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-5 py-4 font-semibold">Documento</th>
            <th className="px-5 py-4 font-semibold">Tipo</th>
            <th className="px-5 py-4 font-semibold">Descrição</th>
            <th className="px-5 py-4 font-semibold">Enviado em</th>
            <th className="px-5 py-4 font-semibold">Ações</th>
          </tr>
        </thead>

        <tbody>
          {items.map((document) => (
            <tr
              key={document.id}
              className="border-t border-slate-100"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                    <DocumentIcon
                      contentType={document.contentType}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="max-w-xs truncate font-semibold text-slate-900">
                      {document.originalFileName}
                    </p>

                    <p className="text-xs text-slate-400">
                      {document.contentType}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 text-slate-600">
                {getDocumentTypeLabel(document.type)}
              </td>

              <td className="px-5 py-4 text-slate-600">
                <p className="max-w-sm truncate">
                  {document.description || '-'}
                </p>
              </td>

              <td className="px-5 py-4 text-slate-600">
                {formatDate(document.uploadedAt)}
              </td>

              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    title="Visualizar detalhes"
                    onClick={() => onView(document)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  >
                    <FolderOpen size={16} />
                  </button>

                  <button
                    type="button"
                    title="Abrir documento"
                    onClick={() => onOpen(document)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
