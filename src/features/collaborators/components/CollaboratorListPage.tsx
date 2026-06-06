import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Modal } from '@/components/ui/Modal'
import { useCollaborators } from '../hooks/useCollaborators'
import {
  useCreateCollaborator,
  useUpdateCollaborator,
  useDeleteCollaborator,
} from '../hooks/useCollaboratorMutations'
import { CollaboratorForm } from './CollaboratorForm'
import { usePersonsList } from '@/features/persons'
import { fullName } from '@/lib/utils/formatters'
import type { CollaboratorDetailResponse } from '@/types/api'
import type { ColumnDef } from '@/components/ui/Table'
import type { CreateCollaboratorDTO } from '../types'

export function CollaboratorListPage() {
  const { eventId = '' } = useParams<{ eventId: string }>()
  const [params, setParams] = useState({ eventId, page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<CollaboratorDetailResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<CollaboratorDetailResponse | undefined>()

  const { data, isLoading, isError, refetch } = useCollaborators(params)
  const { data: persons = [] } = usePersonsList()
  const createMutation = useCreateCollaborator(eventId)
  const updateMutation = useUpdateCollaborator(eventId)
  const deleteMutation = useDeleteCollaborator(eventId)

  function openCreate() {
    setEditTarget(undefined)
    setFormOpen(true)
  }

  function handleFormSubmit(formData: CreateCollaboratorDTO) {
    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.id, data: formData },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createMutation.mutate(formData, { onSuccess: () => setFormOpen(false) })
    }
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(undefined) })
  }

  const columns: ColumnDef<CollaboratorDetailResponse>[] = [
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
    { key: 'area', header: 'Área', cell: (row) => row.area ?? '—' },
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
        <span className="text-gray-900">Colaboradores</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Colaboradores</h1>
        <Button onClick={openCreate}>+ Añadir colaborador</Button>
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
            emptyTitle="Sin colaboradores"
            emptyDescription="Añade el primero pulsando «Añadir colaborador»."
            caption="Lista de colaboradores"
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

      <CollaboratorForm
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
        title="Eliminar colaborador"
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
          <Button variant="danger" loading={deleteMutation.isPending} onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
