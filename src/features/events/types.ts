import { z } from 'zod'

// --- Schemas de validación ---

export const createEventSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z
    .string()
    .min(1, 'El slug es obligatorio')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  is_active: z.boolean(),
})

export const updateEventSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones')
    .optional(),
  is_active: z.boolean().optional(),
})

// --- Tipos inferidos ---

export type CreateEventDTO = z.infer<typeof createEventSchema>
export type UpdateEventDTO = z.infer<typeof updateEventSchema>

// --- Parámetros de paginación ---

export interface EventsPagedParams {
  page: number
  pageSize: number
  search?: string
  order?: string
}
