import { useCallback, useEffect, useState } from 'react'
import {
  CalendarDays,
  FileText,
  MapPin,
  Plus,
  RefreshCw,
  Stethoscope,
} from 'lucide-react'

import type { MedicalAppointment } from '../../types/medical-appointment'
import type {
  ElderlyDocument,
  UploadElderlyDocumentRequest,
} from '../../types/elderly-document'

import { elderlyDocumentService } from '../../services/elderly-document.service'

import { DocumentUploadForm } from '../documents/DocumentUploadForm'
import { DocumentViewer } from '../documents/DocumentViewer'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { LoadingList } from '../ui/LoadingList'
import { Modal } from '../ui/Modal'

interface MedicalAppointmentDetailsProps {
  appointment: MedicalAppointment
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

function formatDocumentDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

export function MedicalAppointmentDetails({
  appointment,
}: MedicalAppointmentDetailsProps) {
  const isUpcoming =
    new Date(appointment.appointmentDate).getTime() >=
    Date.now()

  const [documents, setDocuments] =
    useState<ElderlyDocument[]>([])

  const [documentsLoading, setDocumentsLoading] =
    useState(false)

  const [uploading, setUploading] =
    useState(false)

  const [documentsError, setDocumentsError] =
    useState('')

  const [uploadModalOpen, setUploadModalOpen] =
    useState(false)

  const [selectedDocument, setSelectedDocument] =
    useState<ElderlyDocument | null>(null)
  const [viewerDocument, setViewerDocument] =
    useState<ElderlyDocument | null>(null)

  const loadDocuments = useCallback(async () => {
    setDocumentsLoading(true)
    setDocumentsError('')

    try {
      const result =
        await elderlyDocumentService.listByMedicalAppointment(
          appointment.id,
        )

      setDocuments(result.items)
    } catch {
      setDocuments([])

      setDocumentsError(
        'Não foi possível carregar os anexos da consulta.',
      )
    } finally {
      setDocumentsLoading(false)
    }
  }, [appointment.id])

  useEffect(() => {
    void loadDocuments()
  }, [loadDocuments])

  async function handleUpload(
    payload: UploadElderlyDocumentRequest,
  ) {
    setUploading(true)
    setDocumentsError('')

    try {
      await elderlyDocumentService.upload(payload)

      await loadDocuments()

      setUploadModalOpen(false)
    } catch {
      setDocumentsError(
        'Não foi possível enviar o anexo da consulta.',
      )

      throw new Error(
        'Erro ao enviar anexo da consulta.',
      )
    } finally {
      setUploading(false)
    }
  }

async function openDocument(
  document: ElderlyDocument,
) {
  setViewerDocument(document)
}

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Consulta médica
            </p>

            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              {appointment.title}
            </h3>
          </div>

          <span
            className={[
              'w-fit rounded-full px-3 py-1 text-xs font-semibold',
              isUpcoming
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-200 text-slate-600',
            ].join(' ')}
          >
            {isUpcoming ? 'Agendada' : 'Realizada'}
          </span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-3 text-emerald-700">
            <Stethoscope size={20} />

            <p className="text-sm font-semibold">
              Médico
            </p>
          </div>

          <p className="mt-3 font-semibold text-slate-900">
            {appointment.doctorName ||
              'Não informado'}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {appointment.specialty ||
              'Especialidade não informada'}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 text-emerald-700">
            <CalendarDays size={20} />

            <p className="text-sm font-semibold">
              Data e horário
            </p>
          </div>

          <p className="mt-3 font-semibold text-slate-900">
            {formatDate(
              appointment.appointmentDate,
            )}
          </p>
        </Card>

        <Card className="p-5 sm:col-span-2">
          <div className="flex items-center gap-3 text-emerald-700">
            <MapPin size={20} />

            <p className="text-sm font-semibold">
              Local
            </p>
          </div>

          <p className="mt-3 text-slate-900">
            {appointment.location ||
              'Não informado'}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <p className="text-sm font-semibold text-slate-700">
          Observações
        </p>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
          {appointment.notes ||
            'Nenhuma observação cadastrada.'}
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Arquivos
            </p>

            <h4 className="mt-1 text-xl font-bold text-slate-900">
              Anexos da consulta
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Receitas, exames, laudos e outros
              documentos relacionados a esta consulta.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={documentsLoading}
              onClick={() =>
                void loadDocuments()
              }
            >
              <RefreshCw
                size={17}
                className={
                  documentsLoading
                    ? 'animate-spin'
                    : ''
                }
              />

              Atualizar
            </Button>

            <Button
              type="button"
              onClick={() =>
                setUploadModalOpen(true)
              }
            >
              <Plus size={17} />
              Adicionar anexo
            </Button>
          </div>
        </div>

        {documentsError && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {documentsError}
          </div>
        )}

        <div className="mt-5">
          {documentsLoading ? (
            <LoadingList rows={4} />
          ) : documents.length === 0 ? (
            <EmptyState
              icon={<FileText size={30} />}
              title="Nenhum anexo cadastrado"
              description="Adicione receitas, exames ou outros documentos relacionados a esta consulta."
            />
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="shrink-0 rounded-xl bg-emerald-100 p-2 text-emerald-700">
                      <FileText size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {document.originalFileName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Enviado em{' '}
                        {formatDocumentDate(
                          document.uploadedAt,
                        )}
                      </p>

                      {document.description && (
                        <p className="mt-2 text-sm text-slate-600">
                          {document.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setSelectedDocument(
                          document,
                        )
                      }
                    >
                      Detalhes
                    </Button>

                    <Button
                      type="button"
                      onClick={() =>
                        openDocument(document)
                      }
                    >
                      Abrir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Modal
        open={uploadModalOpen}
        title="Adicionar anexo"
        description="Envie um documento relacionado a esta consulta médica."
        maxWidth="max-w-2xl"
        onClose={() =>
          setUploadModalOpen(false)
        }
      >
        <DocumentUploadForm
          elderlyPersonId={
            appointment.elderlyPersonId
          }
          medicalAppointmentId={
            appointment.id
          }
          uploading={uploading}
          onSubmit={handleUpload}
          onCancel={() =>
            setUploadModalOpen(false)
          }
        />
      </Modal>

      <Modal
        open={Boolean(selectedDocument)}
        title={
          selectedDocument?.originalFileName ??
          'Documento'
        }
        description="Informações do anexo da consulta."
        maxWidth="max-w-2xl"
        onClose={() =>
          setSelectedDocument(null)
        }
      >
        {selectedDocument && (
          <Card className="space-y-5 p-5">
            <div>
              <p className="text-sm text-slate-500">
                Nome do arquivo
              </p>

              <p className="break-words font-semibold text-slate-900">
                {
                  selectedDocument.originalFileName
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Tipo
              </p>

              <p className="font-semibold text-slate-900">
                {selectedDocument.contentType}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Descrição
              </p>

              <p className="text-slate-700">
                {selectedDocument.description ||
                  'Nenhuma descrição informada.'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Data de envio
              </p>

              <p className="font-semibold text-slate-900">
                {formatDocumentDate(
                  selectedDocument.uploadedAt,
                )}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelectedDocument(null)}
              >
                Fechar
              </Button>
              <Button
                type="button"
                onClick={() => openDocument(selectedDocument)}
              >
                Abrir documento
              </Button>
            </div>
          </Card>
        )}
      </Modal>

      <DocumentViewer
        document={viewerDocument}
        onClose={() => setViewerDocument(null)}
      />
    </div>
  )
}
