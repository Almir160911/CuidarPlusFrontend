import axios from 'axios'
import {
  Camera,
  Trash2,
  UserRound,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { elderlyPhotoService } from '../../services/elderly-photo.service'
import { Button } from '../ui/Button'

interface ElderlyPhotoAvatarProps {
  elderlyPersonId: string
  elderlyPersonName: string
}

interface ApiErrorResponse {
  message?: string
  errors?: string[]
}

const MAXIMUM_FILE_SIZE =
  5 * 1024 * 1024

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

function getErrorMessage(
  error: unknown,
): string {
  if (!axios.isAxiosError(error)) {
    return 'Não foi possível concluir a operação.'
  }

  const responseData =
    error.response?.data as
      | ApiErrorResponse
      | undefined

  if (
    Array.isArray(responseData?.errors) &&
    responseData.errors.length > 0
  ) {
    return responseData.errors.join(' ')
  }

  if (responseData?.message) {
    return responseData.message
  }

  switch (error.response?.status) {
    case 400:
      return 'A API rejeitou os dados enviados.'

    case 401:
      return 'Sua sessão expirou. Faça login novamente.'

    case 404:
      return 'O idoso ou a fotografia não foi encontrado.'

    case 413:
      return 'A fotografia ultrapassa o tamanho permitido.'

    default:
      return 'Não foi possível concluir a operação.'
  }
}

export function ElderlyPhotoAvatar({
  elderlyPersonId,
  elderlyPersonName,
}: ElderlyPhotoAvatarProps) {
  const inputRef =
    useRef<HTMLInputElement>(null)

  const [photoUrl, setPhotoUrl] =
    useState<string | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  const loadPhoto = useCallback(async () => {
    setLoading(true)

    try {
      const url =
        await elderlyPhotoService.loadPhotoUrl(
          elderlyPersonId,
        )

      setPhotoUrl(url)
    } catch {
      setPhotoUrl(null)
    } finally {
      setLoading(false)
    }
  }, [elderlyPersonId])

  useEffect(() => {
    void loadPhoto()

    return () => {
      elderlyPhotoService.releasePhotoUrl(
        elderlyPersonId,
      )
    }
  }, [
    elderlyPersonId,
    loadPhoto,
  ])

  function openFileSelector() {
    inputRef.current?.click()
  }

  function validateFile(
    file: File,
  ): string | null {
    if (
      !ALLOWED_CONTENT_TYPES.includes(
        file.type,
      )
    ) {
      return 'Utilize uma imagem JPEG, PNG ou WebP.'
    }

    if (file.size <= 0) {
      return 'O arquivo selecionado está vazio.'
    }

    if (file.size > MAXIMUM_FILE_SIZE) {
      return 'A fotografia deve possuir no máximo 5 MB.'
    }

    return null
  }

  async function handleFileSelected(
    file?: File,
  ) {
    if (!file) {
      return
    }

    setError('')

    const validationError =
      validateFile(file)

    if (validationError) {
      setError(validationError)
      return
    }

    const consentConfirmed =
      window.confirm(
        'Confirmo que o idoso ou seu representante foi informado e autorizou o uso desta fotografia para identificação no Cuidar+.',
      )

    if (!consentConfirmed) {
      return
    }

    setSaving(true)

    try {
      await elderlyPhotoService.upload(
        elderlyPersonId,
        file,
        true,
      )

      await loadPhoto()
    } catch (uploadError) {
      setError(
        getErrorMessage(uploadError),
      )
    } finally {
      setSaving(false)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  async function handleDelete() {
    const confirmed =
      window.confirm(
        'Deseja remover a fotografia do idoso?',
      )

    if (!confirmed) {
      return
    }

    const revokeConsent =
      window.confirm(
        'Deseja também revogar o consentimento registrado para uso da fotografia?',
      )

    setSaving(true)
    setError('')

    try {
      await elderlyPhotoService.remove(
        elderlyPersonId,
        revokeConsent,
      )

      elderlyPhotoService.releasePhotoUrl(
        elderlyPersonId,
      )

      setPhotoUrl(null)
    } catch (deleteError) {
      setError(
        getErrorMessage(deleteError),
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex w-40 shrink-0 flex-col items-center gap-3">
      <div className="group relative h-24 w-24 overflow-hidden rounded-3xl bg-emerald-100">
        {loading ? (
          <div className="h-full w-full animate-pulse bg-slate-200" />
        ) : photoUrl !== null ? (
          <img
            src={photoUrl}
            alt={`Foto de ${elderlyPersonName}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-emerald-700">
            <UserRound size={40} />
          </div>
        )}

        <button
          type="button"
          disabled={saving}
          title="Selecionar fotografia"
          onClick={openFileSelector}
          className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-white opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Camera size={24} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          void handleFileSelected(
            event.target.files?.[0],
          )
        }}
      />

      <div className="flex w-full flex-wrap justify-center gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={saving}
          onClick={openFileSelector}
        >
          <Camera size={15} />

          {saving
            ? 'Enviando...'
            : photoUrl !== null
              ? 'Trocar'
              : 'Adicionar'}
        </Button>

        {photoUrl !== null && (
          <Button
            type="button"
            variant="secondary"
            disabled={saving}
            onClick={() => {
              void handleDelete()
            }}
          >
            <Trash2 size={15} />
          </Button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="w-72 max-w-[calc(100vw-3rem)] break-words rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700 shadow-sm lg:w-80"
        >
          {error}
        </div>
      )}
    </div>
  )
}