import { z } from 'zod'

export const organizerSchema = z.object({
  person_id: z.string().min(1, 'Selecciona una persona'),
  company: z.string().optional(),
  role_description: z.string().optional(),
})

export type CreateOrganizerDTO = z.infer<typeof organizerSchema>
export type UpdateOrganizerDTO = Partial<CreateOrganizerDTO>

export interface OrganizersPagedParams {
  eventId: string
  page: number
  pageSize: number
}
