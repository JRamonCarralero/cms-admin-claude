import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { collaboratorSchema } from '../types'
import type { CreateCollaboratorDTO } from '../types'
import type { CollaboratorDetailResponse, PersonResponse } from '@/types/api'
import { fullName } from '@/lib/utils/formatters'

interface CollaboratorFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateCollaboratorDTO) => void
  isLoading?: boolean
  initialValues?: CollaboratorDetailResponse
  persons: PersonResponse[]
}

export function CollaboratorForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  initialValues,
  persons,
}: CollaboratorFormProps) {
  const isEditing = !!initialValues

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCollaboratorDTO>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: { person_id: '', area: '' },
  })

  useEffect(() => {
    if (open && initialValues) {
      reset({ person_id: initialValues.person_id, area: initialValues.area ?? '' })
    } else if (!open) {
      reset({ person_id: '', area: '' })
    }
  }, [open, initialValues, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar colaborador' : 'Nuevo colaborador'}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="collab-person">
            Persona <span className="text-red-500">*</span>
          </label>
          <select
            id="collab-person"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('person_id')}
            disabled={isEditing}
          >
            <option value="">— Selecciona una persona —</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>
                {fullName(p.first_name, p.last_name)}
              </option>
            ))}
          </select>
          {errors.person_id && <p className="text-xs text-red-600">{errors.person_id.message}</p>}
        </div>

        <Input label="Área" placeholder="Front-end, Back-end…" {...register('area')} />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEditing ? 'Guardar cambios' : 'Añadir'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
