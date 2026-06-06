import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Modal } from '@/components/ui/Modal'
import { useSponsors } from '../hooks/useSponsors'
import { useCreateSponsor, useUpdateSponsor, useDeleteSponsor } from '../hooks/useSponsorMutations'
import { SponsorForm } from './SponsorForm'
import type { SponsorResponse } from '@/types/api'
import type { ColumnDef } from '@/components/ui/Table'
import type { CreateSponsorDTO } from '../types'

const TIER_VARIANT: Record<string, 'danger' | 'warning' | 'info' | 'success' | 'default'> = {
  platinum: 'danger',
  gold: 'warning',
  silver: 'info',
  bronze: 'success',
  community: 'default',
}

export function SponsorListPage() {
  const { eventId = '' } = useParams<{ eventId: string }>()
  const [params, setParams] = useState({ eventId, page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<SponsorResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<SponsorResponse | undefined>()

  const { data, isLoading, isError, refetch } = useSponsors(params)
  const createMutation = useCreateSponsor(eventId)
  const updateMutation = useUpdateSponsor(eventId)
  const deleteMutation = useDeleteSponsor(eventId)

  function handleFormSubmit(formData: CreateSponsorDTO) {
    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.id, data: formData },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createMutation.mutate(formData, { onSuccess: () => setFormOpen(false) })
    }
  }

  const columns: ColumnDef<SponsorResponse>[] = [
    {
      key: 'name',
      header: 'Patrocinador',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.logo_url ? (
            <img src={row.logo_url} alt={row.name} className="h-8 w-8 rounded object-contain" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-500">
              {row.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            {row.website_url && (
              <a
                href={row.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                {row.website_url}
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'tier',
      header: 'Nivel',
      cell: (row) => (
        <Badge variant={TIER_VARIANT[row.tier] ?? 'default'}>
          {row.tier.charAt(0).toUpperCase() + row.tier.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'priority',
      header: 'Prioridad',
      cell: (row) => row.order_priority ?? '—',
    },
    {
      key: 'actions',
      header: '',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditTarget(row)
              setFormOpen(true)
            }}
          >
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(row)}>
            Eliminar
          </Button>
        </div>
      ),
      className: 'w-36',
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/events" className="hover:text-gray-900">
          Eventos
        </Link>
        <span>/</span>
        <span className="text-gray-900">Patrocinadores</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Patrocinadores</h1>
        <Button
          onClick={() => {
            setEditTarget(undefined)
            setFormOpen(true)
          }}
        >
          + Añadir patrocinador
        </Button>
      </div>

      {isError ? (
        <ErrorMessage onRetry={() => refetch()} />
      ) : (
        <>
          <Table
            data={data?.data ?? []}
            columns={columns}
            keyExtractor={(r) => r.id}
            isLoading={isLoading}
            emptyTitle="Sin patrocinadores"
            emptyDescription="Añade el primero pulsando «Añadir patrocinador»."
            caption="Lista de patrocinadores"
          />
          {data && (
            <Pagination
              meta={data.meta}
              onPageChange={(page) => setParams((p) => ({ ...p, page }))}
              onPageSizeChange={(pageSize) => setParams({ ...params, page: 1, pageSize })}
            />
          )}
        </>
      )}

      <SponsorForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialValues={editTarget}
      />

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        title="Eliminar patrocinador"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          ¿Eliminar a <strong>{deleteTarget?.name}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(undefined)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => {
              if (!deleteTarget) return
              deleteMutation.mutate(deleteTarget.id, {
                onSuccess: () => setDeleteTarget(undefined),
              })
            }}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
