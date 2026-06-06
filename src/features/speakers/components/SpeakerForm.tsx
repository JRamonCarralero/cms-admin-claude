import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { speakerSchema } from '../types'
import type { CreateSpeakerDTO } from '../types'
import type { SpeakerDetailResponse, PersonResponse } from '@/types/api'
import { fullName } from '@/lib/utils/formatters'

interface SpeakerFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateSpeakerDTO) => void
  isLoading?: boolean
  initialValues?: SpeakerDetailResponse
  persons: PersonResponse[]
}

export function SpeakerForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  initialValues,
  persons,
}: SpeakerFormProps) {
  const isEditing = !!initialValues

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSpeakerDTO>({
    resolver: zodResolver(speakerSchema),
    defaultValues: { person_id: '', bio: '', company: '' },
  })

  useEffect(() => {
    if (open && initialValues) {
      reset({
        person_id: initialValues.person_id,
        bio: initialValues.bio ?? '',
        company: initialValues.company ?? '',
      })
    } else if (!open) {
      reset({ person_id: '', bio: '', company: '' })
    }
  }, [open, initialValues, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar ponente' : 'Nuevo ponente'}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="spk-person">
            Persona <span className="text-red-500">*</span>
          </label>
          <select
            id="spk-person"
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

        <Input label="Empresa" placeholder="Google, Microsoft…" {...register('company')} />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="spk-bio">
            Biografía
          </label>
          <textarea
            id="spk-bio"
            rows={3}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('bio')}
          />
        </div>

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
