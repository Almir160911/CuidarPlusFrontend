import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { elderlyDocumentService } from '../services/elderly-document.service'
import type {
  ElderlyDocument,
  UploadElderlyDocumentRequest,
} from '../types/elderly-document'

export function useElderlyDocuments(
  elderlyPersonId?: string,
) {
  const [items, setItems] =
    useState<ElderlyDocument[]>([])

  const [selected, setSelected] =
    useState<ElderlyDocument | null>(null)

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!elderlyPersonId) {
      setItems([])
      return
    }

    setLoading(true)
    setError('')

    try {
      const result =
        await elderlyDocumentService.listByElderly(
          elderlyPersonId,
        )

      setItems(result.items)
    } catch {
      setItems([])
      setError(
        'Não foi possível carregar os documentos.',
      )
    } finally {
      setLoading(false)
    }
  }, [elderlyPersonId])

  async function upload(
    payload: UploadElderlyDocumentRequest,
  ) {
    setUploading(true)
    setError('')

    try {
      const document =
        await elderlyDocumentService.upload(payload)

      await load()

      return document
    } catch {
      setError(
        'Não foi possível enviar o documento.',
      )

      throw new Error(
        'Erro ao enviar documento.',
      )
    } finally {
      setUploading(false)
    }
  }

  function openDocument(document: ElderlyDocument) {
    const url =
      elderlyDocumentService.buildFileUrl(document)

    window.open(
      url,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const filteredItems = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase()

    if (!normalizedSearch) {
      return [...items].sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() -
          new Date(a.uploadedAt).getTime(),
      )
    }

    return items
      .filter((document) => {
        const text = [
          document.originalFileName,
          document.description,
          document.contentType,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return text.includes(normalizedSearch)
      })
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() -
          new Date(a.uploadedAt).getTime(),
      )
  }, [items, search])

  useEffect(() => {
    load()
  }, [load])

  return {
    items: filteredItems,
    allItems: items,
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
  }
}
