import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Modal } from '@/components/ui/Modal'
import { useTracks } from '../hooks/useTracks'
import { useCreateTrack, useUpdateTrack, useDeleteTrack } from '../hooks/useTrackMutations'
import { TrackForm } from './TrackForm'
import { formatDate } from '@/lib/utils/formatters'
import type { TrackResponse } from '@/types/api'
import type { ColumnDef } from '@/components/ui/Table'
import type { CreateTrackDTO } from '../types'

export function TrackListPage() {
  const { eventId = '' } = useParams<{ eventId: string }>()
  const [params, setParams] = useState({ eventId, page: 1, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<TrackResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<TrackResponse | undefined>()

  const { data, isLoading, isError, refetch } = useTracks(params)
  const createMutation = useCreateTrack(eventId)
  const updateMutation = useUpdateTrack(eventId)
  const deleteMutation = useDeleteTrack(eventId)

  function handleFormSubmit(formData: CreateTrackDTO) {
    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.id, data: formData },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createMutation.mutate(formData, { onSuccess: () => setFormOpen(false) })
    }
  }

  const columns: ColumnDef<TrackResponse>[] = [
    {
      key: 'name',
      header: 'Track',
      cell: (row) => <span className="font-medium text-gray-900">{row.name}</span>,
    },
    {
      key: 'event_date',
      header: 'Fecha',
      cell: (row) => formatDate(row.event_date),
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
        <span className="text-gray-900">Tracks</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Tracks</h1>
        <Button
          onClick={() => {
            setEditTarget(undefined)
            setFormOpen(true)
          }}
        >
          + Nuevo track
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
            emptyTitle="Sin tracks"
            emptyDescription="Crea el primero pulsando «Nuevo track»."
            caption="Lista de tracks"
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

      <TrackForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialValues={editTarget}
      />

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        title="Eliminar track"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          ¿Eliminar el track <strong>{deleteTarget?.name}</strong>? Esta acción no se puede
          deshacer.
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
