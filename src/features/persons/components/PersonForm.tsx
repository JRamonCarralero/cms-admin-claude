import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { personSchema } from '../types'
import type { CreatePersonDTO } from '../types'
import type { PersonResponse } from '@/types/api'

interface PersonFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreatePersonDTO) => void
  isLoading?: boolean
  initialValues?: PersonResponse
}

export function PersonForm({ open, onClose, onSubmit, isLoading, initialValues }: PersonFormProps) {
  const isEditing = !!initialValues

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePersonDTO>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      avatar_url: '',
      github_user: '',
      linkedin_url: '',
      twitter_url: '',
      website_url: '',
    },
  })

  useEffect(() => {
    if (open && initialValues) {
      reset({
        first_name: initialValues.first_name,
        last_name: initialValues.last_name,
        email: initialValues.email ?? '',
        avatar_url: initialValues.avatar_url ?? '',
        github_user: initialValues.github_user ?? '',
        linkedin_url: initialValues.linkedin_url ?? '',
        twitter_url: initialValues.twitter_url ?? '',
        website_url: initialValues.website_url ?? '',
      })
    } else if (!open) {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        avatar_url: '',
        github_user: '',
        linkedin_url: '',
        twitter_url: '',
        website_url: '',
      })
    }
  }, [open, initialValues, reset])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar persona' : 'Nueva persona'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* Datos básicos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nombre"
            required
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            label="Apellidos"
            required
            error={errors.last_name?.message}
            {...register('last_name')}
          />
        </div>

        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />

        <Input
          label="Avatar URL"
          type="url"
          placeholder="https://..."
          error={errors.avatar_url?.message}
          {...register('avatar_url')}
        />

        {/* Redes sociales */}
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Redes y perfil
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="GitHub"
            placeholder="usuario"
            error={errors.github_user?.message}
            {...register('github_user')}
          />
          <Input
            label="LinkedIn URL"
            type="url"
            placeholder="https://linkedin.com/in/..."
            error={errors.linkedin_url?.message}
            {...register('linkedin_url')}
          />
          <Input
            label="Twitter/X URL"
            type="url"
            placeholder="https://twitter.com/..."
            error={errors.twitter_url?.message}
            {...register('twitter_url')}
          />
          <Input
            label="Web personal"
            type="url"
            placeholder="https://..."
            error={errors.website_url?.message}
            {...register('website_url')}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEditing ? 'Guardar cambios' : 'Crear persona'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
