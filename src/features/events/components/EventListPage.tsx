import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Modal } from '@/components/ui/Modal'
import { useEvents } from '../hooks/useEvents'
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useEventMutations'
import { EventStatusBadge } from './EventStatusBadge'
import { EventForm } from './EventForm'
import type { EventsPagedParams } from '../types'
import type { CreateEventDTO } from '../types'
import type { EventResponse } from '@/types/api'
import type { ColumnDef } from '@/components/ui/Table'
import { formatDate } from '@/lib/utils/formatters'

export function EventListPage() {
  const [params, setParams] = useState<EventsPagedParams>({ page: 1, pageSize: 10 })
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<EventResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<EventResponse | undefined>()

  const { data, isLoading, isError, refetch } = useEvents({
    ...params,
    search: search || undefined,
  })
  const createMutation = useCreateEvent()
  const updateMutation = useUpdateEvent()
  const deleteMutation = useDeleteEvent()

  function openCreate() {
    setEditTarget(undefined)
    setFormOpen(true)
  }

  function openEdit(event: EventResponse) {
    setEditTarget(event)
    setFormOpen(true)
  }

  function handleFormSubmit(formData: CreateEventDTO) {
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

  const columns: ColumnDef<EventResponse>[] = [
    {
      key: 'name',
      header: 'Nombre',
      cell: (row) => <span className="font-medium text-gray-900">{row.name}</span>,
    },
    {
      key: 'slug',
      header: 'Slug',
      cell: (row) => <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{row.slug}</code>,
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (row) => <EventStatusBadge isActive={row.is_active} />,
      className: 'w-28',
    },
    {
      key: 'created_at',
      header: 'Creado',
      cell: (row) => <span className="text-gray-500">{formatDate(row.created_at)}</span>,
      className: 'w-40',
    },
    {
      key: 'actions',
      header: '',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Link
            to={`/events/${row.id}`}
            className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
          >
            Ver
          </Link>
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(row)}>
            Eliminar
          </Button>
        </div>
      ),
      className: 'w-44',
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Cabecera */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Eventos</h1>
          <p className="text-sm text-gray-500">Gestiona los eventos del CMS</p>
        </div>
        <Button onClick={openCreate}>+ Nuevo evento</Button>
      </div>

      {/* Buscador */}
      <div className="max-w-xs">
        <Input
          label="Buscar"
          placeholder="Nombre o slug..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setParams((p) => ({ ...p, page: 1 }))
          }}
        />
      </div>

      {/* Tabla */}
      {isError ? (
        <ErrorMessage onRetry={() => refetch()} />
      ) : (
        <>
          <Table
            data={data?.data ?? []}
            columns={columns}
            keyExtractor={(r) => r.id}
            isLoading={isLoading}
            emptyTitle="No hay eventos"
            emptyDescription="Crea el primero pulsando «Nuevo evento»."
            caption="Lista de eventos"
          />
          {data && (
            <Pagination
              meta={data.meta}
              onPageChange={(page) => setParams((p) => ({ ...p, page }))}
              onPageSizeChange={(pageSize) => setParams({ page: 1, pageSize })}
            />
          )}
        </>
      )}

      {/* Modal formulario */}
      <EventForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialValues={editTarget}
      />

      {/* Modal confirmación borrado */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        title="Eliminar evento"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          ¿Seguro que quieres eliminar{' '}
          <strong className="text-gray-900">{deleteTarget?.name}</strong>? Esta acción no se puede
          deshacer.
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
