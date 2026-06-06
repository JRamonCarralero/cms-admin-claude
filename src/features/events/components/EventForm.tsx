import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createEventSchema } from '../types'
import type { CreateEventDTO } from '../types'
import type { EventResponse } from '@/types/api'
import { slugify } from '@/lib/utils/formatters'

interface EventFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateEventDTO) => void
  isLoading?: boolean
  initialValues?: EventResponse
}

export function EventForm({ open, onClose, onSubmit, isLoading, initialValues }: EventFormProps) {
  const isEditing = !!initialValues

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateEventDTO>({
    resolver: zodResolver(createEventSchema),
    defaultValues: { name: '', slug: '', is_active: false as boolean },
  })

  // Precargar valores al editar
  useEffect(() => {
    if (open && initialValues) {
      reset({
        name: initialValues.name,
        slug: initialValues.slug,
        is_active: initialValues.is_active,
      })
    } else if (!open) {
      reset({ name: '', slug: '', is_active: false })
    }
  }, [open, initialValues, reset])

  // Autogenerar slug a partir del nombre (solo al crear)
  const nameValue = watch('name')
  useEffect(() => {
    if (!isEditing && nameValue) {
      setValue('slug', slugify(nameValue), { shouldValidate: false })
    }
  }, [nameValue, isEditing, setValue])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar evento' : 'Nuevo evento'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input label="Nombre" required error={errors.name?.message} {...register('name')} />

        <Input
          label="Slug"
          required
          hint="Solo minúsculas, números y guiones. Se genera automáticamente."
          error={errors.slug?.message}
          {...register('slug')}
        />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 accent-blue-600"
            {...register('is_active')}
          />
          Activo
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEditing ? 'Guardar cambios' : 'Crear evento'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
