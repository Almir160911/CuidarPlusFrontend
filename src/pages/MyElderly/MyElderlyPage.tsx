import {
  useEffect,
  useState,
} from 'react'
import {
  ArrowRight,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { elderlyAccessService } from '../../services/elderly-access.service'
import type {
  MyElderlyPersonAccess,
} from '../../types/elderly-access'
import { getApiErrorMessage } from '../../utils/api-error'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingList } from '../../components/ui/LoadingList'
import { PageHeader } from '../../components/ui/PageHeader'

function getAccessRoleLabel(
  accessRole: number,
): string {
  switch (accessRole) {
    case 1:
      return 'Administrador'

    case 2:
      return 'Gestor de cuidados'

    case 3:
      return 'Cuidador'

    case 4:
      return 'Visualizador'

    default:
      return 'Perfil de acesso'
  }
}

function getRelationshipLabel(
  relationshipType: number,
): string {
  switch (relationshipType) {
    case 1:
      return 'Próprio usuário'

    case 2:
      return 'Familiar'

    case 3:
      return 'Responsável legal'

    case 4:
      return 'Cuidador profissional'

    case 5:
      return 'Cuidador informal'

    case 99:
      return 'Outro'

    default:
      return 'Relacionamento'
  }
}

export function MyElderlyPage() {
  const [items, setItems] =
    useState<MyElderlyPersonAccess[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')

      try {
        const result =
          await elderlyAccessService.getMyAccesses()

        setItems(result)
      } catch (error) {
        setItems([])
        setError(
          getApiErrorMessage(
            error,
            'Não foi possível carregar suas pessoas assistidas.',
          ),
        )
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  if (loading) {
    return <LoadingList rows={4} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Meus vínculos"
        title="Minhas pessoas assistidas"
        description="Acesse as pessoas para as quais você possui vínculo ativo no Cuidar+."
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && items.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title="Nenhuma pessoa assistida vinculada"
          description="Seu usuário não possui vínculos ativos neste momento."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <Card
              key={item.accessId}
              className="p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Pessoa assistida
                  </p>

                  <h2 className="mt-1 break-words text-xl font-bold text-slate-900">
                    {item.elderlyPersonName}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {getAccessRoleLabel(
                        item.accessRole,
                      )}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {getRelationshipLabel(
                        item.relationshipType,
                      )}
                    </span>
                  </div>
                </div>

                <Users
                  size={24}
                  className="shrink-0 text-emerald-600"
                />
              </div>

              <Link
                to={`/idosos/${item.elderlyPersonId}`}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Abrir prontuário
                <ArrowRight size={17} />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
