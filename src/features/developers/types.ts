import { z } from 'zod'

export const developerSchema = z.object({
  person_id: z.string().min(1, 'Selecciona una persona'),
  role_description: z.string().optional(),
})

export type CreateDeveloperDTO = z.infer<typeof developerSchema>
export type UpdateDeveloperDTO = Partial<CreateDeveloperDTO>

export interface DevelopersPagedParams {
  eventId: string
  page: number
  pageSize: number
}
