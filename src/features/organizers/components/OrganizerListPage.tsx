import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Modal } from '@/components/ui/Modal'
import { useOrganizers } from '../hooks/useOrganizers'
import {
  useCreateOrganizer,
  useUpdateOrganizer,
  useDeleteOrganizer,
} from '../hooks/useOrganizerMutations'
import { OrganizerForm } from './OrganizerForm'
import { usePersonsList } from '@/features/persons'
import { fullName } from '@/lib/utils/formatters'
import type { OrganizerDetailResponse } from '@/types/api'
import type { ColumnDef } from '@/components/ui/Table'
import type { CreateOrganizerDTO } from '../types'

interface OrganizerListPageProps {
  embedded?: boolean
}

export function OrganizerListPage({ embedded }: OrganizerListPageProps) {
  const { eventId = '' } = useParams<{ eventId: string }>()
  const [params, setParams] = useState({ eventId, page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<OrganizerDetailResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<OrganizerDetailResponse | undefined>()

  const { data, isLoading, isError, refetch } = useOrganizers(params)
  const { data: persons = [] } = usePersonsList()
  const createMutation = useCreateOrganizer(eventId)
  const updateMutation = useUpdateOrganizer(eventId)
  const deleteMutation = useDeleteOrganizer(eventId)

  function handleFormSubmit(formData: CreateOrganizerDTO) {
    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.id, data: formData },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createMutation.mutate(formData, { onSuccess: () => setFormOpen(false) })
    }
  }

  const columns: ColumnDef<OrganizerDetailResponse>[] = [
    {
      key: 'person',
      header: 'Persona',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar_url} alt={fullName(row.first_name, row.last_name)} size="sm" />
          <span className="font-medium text-gray-900">
            {fullName(row.first_name, row.last_name)}
          </span>
        </div>
      ),
    },
    { key: 'company', header: 'Empresa', cell: (row) => row.company ?? '—' },
    { key: 'role', header: 'Rol', cell: (row) => row.role_description ?? '—' },
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
      {!embedded && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/events" className="hover:text-gray-900">
            Eventos
          </Link>
          <span>/</span>
          <span className="text-gray-900">Organizadores</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        {!embedded && <h1 className="text-xl font-semibold text-gray-900">Organizadores</h1>}
        <div className={embedded ? 'ml-auto' : ''}>
          <Button
            onClick={() => {
              setEditTarget(undefined)
              setFormOpen(true)
            }}
          >
            + Añadir organizador
          </Button>
        </div>
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
            emptyTitle="Sin organizadores"
            emptyDescription="Añade el primero pulsando «Añadir organizador»."
            caption="Lista de organizadores"
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

      <OrganizerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialValues={editTarget}
        persons={persons}
      />

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        title="Eliminar organizador"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          ¿Eliminar a{' '}
          <strong>
            {deleteTarget && fullName(deleteTarget.first_name, deleteTarget.last_name)}
          </strong>
          ? Esta acción no se puede deshacer.
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
