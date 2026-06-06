import { useState } from 'react'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Modal } from '@/components/ui/Modal'
import { usePersons } from '../hooks/usePersons'
import { useCreatePerson, useUpdatePerson, useDeletePerson } from '../hooks/usePersonMutations'
import { PersonForm } from './PersonForm'
import type { PersonsPagedParams, CreatePersonDTO } from '../types'
import type { PersonResponse } from '@/types/api'
import type { ColumnDef } from '@/components/ui/Table'
import { fullName } from '@/lib/utils/formatters'

export function PersonListPage() {
  const [params, setParams] = useState<PersonsPagedParams>({ page: 1, pageSize: 10 })
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<PersonResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<PersonResponse | undefined>()

  const { data, isLoading, isError, refetch } = usePersons({
    ...params,
    search: search || undefined,
  })
  const createMutation = useCreatePerson()
  const updateMutation = useUpdatePerson()
  const deleteMutation = useDeletePerson()

  function openCreate() {
    setEditTarget(undefined)
    setFormOpen(true)
  }

  function openEdit(person: PersonResponse) {
    setEditTarget(person)
    setFormOpen(true)
  }

  function handleFormSubmit(formData: CreatePersonDTO) {
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

  const columns: ColumnDef<PersonResponse>[] = [
    {
      key: 'person',
      header: 'Persona',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar_url} alt={fullName(row.first_name, row.last_name)} size="sm" />
          <div>
            <p className="font-medium text-gray-900">{fullName(row.first_name, row.last_name)}</p>
            {row.email && <p className="text-xs text-gray-400">{row.email}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'social',
      header: 'Perfil',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.github_user && (
            <a
              href={`https://github.com/${row.github_user}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub de ${row.first_name}`}
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              GitHub
            </a>
          )}
          {row.linkedin_url && (
            <a
              href={row.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn de ${row.first_name}`}
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              LinkedIn
            </a>
          )}
          {row.website_url && (
            <a
              href={row.website_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Web de ${row.first_name}`}
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              Web
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
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
      {/* Cabecera */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Personas</h1>
          <p className="text-sm text-gray-500">
            Directorio de ponentes, colaboradores y organizadores
          </p>
        </div>
        <Button onClick={openCreate}>+ Nueva persona</Button>
      </div>

      {/* Buscador */}
      <div className="max-w-xs">
        <Input
          label="Buscar"
          placeholder="Nombre o email..."
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
            emptyTitle="No hay personas"
            emptyDescription="Crea la primera pulsando «Nueva persona»."
            caption="Lista de personas"
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
      <PersonForm
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
        title="Eliminar persona"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          ¿Seguro que quieres eliminar a{' '}
          <strong className="text-gray-900">
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
