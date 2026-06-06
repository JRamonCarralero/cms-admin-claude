import { z } from 'zod'

const urlOrEmpty = z.string().url('Debe ser una URL válida').or(z.literal('')).optional()

// Schema del formulario (order_priority es string para evitar conflicto con z.coerce)
export const sponsorFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  logo_url: urlOrEmpty,
  website_url: urlOrEmpty,
  tier: z.string().min(1, 'El nivel es obligatorio'),
  order_priority_str: z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), 'Debe ser un número entero positivo'),
})

export type SponsorFormValues = z.infer<typeof sponsorFormSchema>

// DTO para el servicio
export interface CreateSponsorDTO {
  name: string
  logo_url?: string
  website_url?: string
  tier: string
  order_priority?: number
}

export type UpdateSponsorDTO = Partial<CreateSponsorDTO>

export interface SponsorsPagedParams {
  eventId: string
  page: number
  pageSize: number
}
