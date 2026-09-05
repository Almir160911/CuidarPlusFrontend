import { Download, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { elderlyDocumentService } from '../../services/elderly-document.service'
import type { ElderlyDocument } from '../../types/elderly-document'

interface DocumentViewerProps {
  document: ElderlyDocument | null
  onClose: () => void
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [contentType, setContentType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!document) return
    let active = true
    let objectUrl: string | null = null

    async function load() {
      setLoading(true)
      setError('')
      setUrl(null)
      try {
        const result = await elderlyDocumentService.downloadDocument(document!.id, document!.contentType)
        if (!active) return
        objectUrl = URL.createObjectURL(result.blob)
        setContentType(result.contentType)
        setUrl(objectUrl)
      } catch {
        if (active) setError('Não foi possível carregar o documento.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [document])

  useEffect(() => {
    if (!document) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [document, onClose])

  if (!document) return null

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-slate-100" role="dialog" aria-modal="true" aria-label={`Documento ${document.originalFileName}`}>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="min-w-0"><p className="truncate font-semibold text-slate-900">{document.originalFileName}</p><p className="text-xs text-slate-500">Visualização protegida</p></div>
        <div className="flex shrink-0 gap-2">
          {url && <a href={url} download={document.originalFileName} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"><Download size={18} /><span className="hidden sm:inline">Baixar</span></a>}
          <button type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"><X size={19} />Fechar</button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-auto p-3 sm:p-6">
        {loading && <div className="flex h-full items-center justify-center gap-3 text-slate-600"><Loader2 className="animate-spin" />Carregando documento...</div>}
        {error && <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-700">{error}</div>}
        {url && contentType.startsWith('image/') && <img src={url} alt={document.description || document.originalFileName} className="mx-auto max-h-full max-w-full rounded-xl bg-white object-contain shadow" />}
        {url && contentType === 'application/pdf' && <iframe title={document.originalFileName} src={url} className="h-full min-h-[75vh] w-full rounded-xl border-0 bg-white shadow" />}
        {url && !contentType.startsWith('image/') && contentType !== 'application/pdf' && <div className="mx-auto mt-10 max-w-lg rounded-2xl bg-white p-6 text-center shadow"><p className="text-slate-600">Este formato não possui visualização interna.</p><a href={url} download={document.originalFileName} className="mt-4 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white">Baixar documento</a></div>}
      </main>
    </div>
  )
}
