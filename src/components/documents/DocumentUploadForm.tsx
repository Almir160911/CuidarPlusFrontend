import { FileUp, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  DocumentType,
  type UploadElderlyDocumentRequest,
} from '../../types/elderly-document'
import { Button } from '../ui/Button'

interface DocumentUploadFormProps {
  elderlyPersonId: string
  uploading?: boolean
  onSubmit: (
    payload: UploadElderlyDocumentRequest,
  ) => Promise<void>
  onCancel: () => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function DocumentUploadForm({
  elderlyPersonId,
  uploading = false,
  onSubmit,
  onCancel,
}: DocumentUploadFormProps) {
  const [type, setType] = useState<number>(
    DocumentType.Prescription,
  )
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setError('')

    const selectedFile = event.target.files?.[0] ?? null

    if (!selectedFile) {
      setFile(null)
      return
    }

    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Selecione um arquivo PDF, PNG, JPG ou JPEG.')
      setFile(null)
      event.target.value = ''
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('O arquivo deve ter no máximo 10 MB.')
      setFile(null)
      event.target.value = ''
      return
    }

    setFile(selectedFile)
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')

    if (!file) {
      setError('Selecione um arquivo.')
      return
    }

    await onSubmit({
      elderlyPersonId,
      type: type as UploadElderlyDocumentRequest['type'],
      description: description.trim() || undefined,
      file,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Tipo de documento
        </span>

        <select
          value={type}
          onChange={(event) =>
            setType(Number(event.target.value))
          }
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        >
          <option value={DocumentType.Prescription}>
            Receita médica
          </option>
          <option value={DocumentType.MedicalExam}>
            Exame médico
          </option>
          <option value={DocumentType.HospitalDischarge}>
            Alta hospitalar
          </option>
          <option value={DocumentType.IdentityDocument}>
            Documento pessoal
          </option>
          <option value={DocumentType.HealthInsuranceCard}>
            Carteira do convênio
          </option>
          <option value={DocumentType.ConsentTerm}>
            Termo de consentimento
          </option>
          <option value={DocumentType.Other}>
            Outro
          </option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Arquivo
        </span>

        <input
          type="file"
          required
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          onChange={handleFileChange}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
        />

        <p className="mt-2 text-xs text-slate-500">
          Formatos permitidos: PDF, PNG, JPG e JPEG. Limite de 10 MB.
        </p>
      </label>

      {file && (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <FileUp className="text-emerald-700" size={22} />

          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">
              {file.name}
            </p>

            <p className="text-xs text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Descrição
        </span>

        <textarea
          rows={4}
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Informações adicionais sobre o documento."
          className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={uploading}>
          {uploading && (
            <Loader2 size={18} className="animate-spin" />
          )}
          Enviar documento
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={uploading}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
