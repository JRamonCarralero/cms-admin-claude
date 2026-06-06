import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { trackSchema } from '../types'
import type { CreateTrackDTO } from '../types'
import type { TrackResponse } from '@/types/api'

interface TrackFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateTrackDTO) => void
  isLoading?: boolean
  initialValues?: TrackResponse
}

export function TrackForm({ open, onClose, onSubmit, isLoading, initialValues }: TrackFormProps) {
  const isEditing = !!initialValues

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTrackDTO>({
    resolver: zodResolver(trackSchema),
    defaultValues: { name: '', event_date: '' },
  })

  useEffect(() => {
    if (open && initialValues) {
      reset({ name: initialValues.name, event_date: initialValues.event_date })
    } else if (!open) {
      reset({ name: '', event_date: '' })
    }
  }, [open, initialValues, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar track' : 'Nuevo track'}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Nombre"
          required
          placeholder="Main Stage, Workshop Room…"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Fecha del evento"
          type="date"
          required
          error={errors.event_date?.message}
          {...register('event_date')}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEditing ? 'Guardar cambios' : 'Crear track'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
