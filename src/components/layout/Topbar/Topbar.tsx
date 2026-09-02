import {
  Camera,
  LogOut,
  Menu,
  Search,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  authService,
  type AuthenticatedUser,
} from '../../../services/auth.service'
import { userPhotoService } from '../../../services/user-photo.service'

const roleLabels: Record<string, string> = {
  SystemAdmin: 'Administrador do sistema',
  FamilyAdmin: 'Administrador familiar',
}

const allowedPhotoTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

function getUserName(
  user: AuthenticatedUser | null,
): string {
  return (
    user?.fullName ??
    user?.name ??
    user?.email ??
    'Usuário'
  )
}

function getInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) {
    return 'U'
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase()
}

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({
  onMenuClick,
}: TopbarProps) {
  const navigate = useNavigate()
  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const [user, setUser] =
    useState<AuthenticatedUser | null>(
      () => authService.getUser(),
    )

  const [photoUrl, setPhotoUrl] =
    useState<string | null>(null)

  const [isUploading, setIsUploading] =
    useState(false)

  const userName = getUserName(user)

  async function loadPhoto() {
    try {
      const photo = await userPhotoService.download()
      const nextUrl = URL.createObjectURL(photo)

      setPhotoUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }

        return nextUrl
      })
    } catch {
      setPhotoUrl(null)
    }
  }

  useEffect(() => {
    if (user?.hasPhoto) {
      void loadPhoto()
    }

    return () => {
      setPhotoUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }

        return null
      })
    }
  }, [user?.hasPhoto])

  function handleLogout() {
    authService.logout()
    navigate('/login')
  }

  function handleAvatarClick() {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  async function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    event.target.value = ''

    if (!file) {
      return
    }

    if (!allowedPhotoTypes.includes(file.type)) {
      window.alert(
        'Selecione uma imagem JPEG, PNG ou WebP.',
      )
      return
    }

    const maximumSize = 5 * 1024 * 1024

    if (file.size > maximumSize) {
      window.alert(
        'A imagem deve ter no máximo 5 MB.',
      )
      return
    }

    try {
      setIsUploading(true)

      await userPhotoService.upload(file)

      const updatedUser = {
        ...user,
        hasPhoto: true,
      }

      authService.updateStoredUser(updatedUser)
      setUser(updatedUser)

      await loadPhoto()
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar a foto.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu de navegação"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 sm:flex">
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            className="w-72 bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Pesquisar no Cuidar+..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhotoChange}
        />

        <button
          type="button"
          onClick={handleAvatarClick}
          disabled={isUploading}
          title="Alterar foto do perfil"
          className="group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 ring-2 ring-white transition hover:ring-emerald-300 disabled:cursor-wait disabled:opacity-60"
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`Foto de ${userName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{getInitials(userName)}</span>
          )}

          <span className="absolute inset-0 hidden items-center justify-center bg-slate-900/55 text-white group-hover:flex">
            <Camera size={17} />
          </span>
        </button>

        <div className="hidden text-right sm:block">
          <p className="max-w-48 truncate text-sm font-semibold text-slate-900">
            {userName}
          </p>

          <p className="text-xs text-slate-500">
            {user?.role
              ? roleLabels[user.role] ?? user.role
              : 'Portal Cuidar+'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <LogOut size={17} />
          <span className="hidden sm:inline">
            Sair
          </span>
        </button>
      </div>
    </header>
  )
}