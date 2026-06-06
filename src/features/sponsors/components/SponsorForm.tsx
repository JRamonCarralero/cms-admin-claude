import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { sponsorFormSchema } from '../types'
import type { SponsorFormValues, CreateSponsorDTO } from '../types'
import type { SponsorResponse } from '@/types/api'

const TIERS = ['platinum', 'gold', 'silver', 'bronze', 'community']

interface SponsorFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateSponsorDTO) => void
  isLoading?: boolean
  initialValues?: SponsorResponse
}

export function SponsorForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  initialValues,
}: SponsorFormProps) {
  const isEditing = !!initialValues

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: { name: '', logo_url: '', website_url: '', tier: '', order_priority_str: '' },
  })

  useEffect(() => {
    if (open && initialValues) {
      reset({
        name: initialValues.name,
        logo_url: initialValues.logo_url,
        website_url: initialValues.website_url,
        tier: initialValues.tier,
        order_priority_str:
          initialValues.order_priority != null ? String(initialValues.order_priority) : '',
      })
    } else if (!open) {
      reset({ name: '', logo_url: '', website_url: '', tier: '', order_priority_str: '' })
    }
  }, [open, initialValues, reset])

  function handleValid(values: SponsorFormValues) {
    const dto: CreateSponsorDTO = {
      name: values.name,
      logo_url: values.logo_url,
      website_url: values.website_url,
      tier: values.tier,
      order_priority: values.order_priority_str
        ? parseInt(values.order_priority_str, 10)
        : undefined,
    }
    onSubmit(dto)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar patrocinador' : 'Nuevo patrocinador'}
      size="sm"
    >
      <form onSubmit={handleSubmit(handleValid)} noValidate className="flex flex-col gap-4">
        <Input label="Nombre" required error={errors.name?.message} {...register('name')} />

        <Input
          label="Logo URL"
          type="url"
          placeholder="https://..."
          error={errors.logo_url?.message}
          {...register('logo_url')}
        />

        <Input
          label="Web"
          type="url"
          placeholder="https://..."
          error={errors.website_url?.message}
          {...register('website_url')}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="spo-tier">
            Nivel <span className="text-red-500">*</span>
          </label>
          <select
            id="spo-tier"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('tier')}
          >
            <option value="">— Selecciona un nivel —</option>
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          {errors.tier && <p className="text-xs text-red-600">{errors.tier.message}</p>}
        </div>

        <Input
          label="Prioridad"
          placeholder="1, 2, 3…"
          error={errors.order_priority_str?.message}
          {...register('order_priority_str')}
        />

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
