import { z } from 'zod'

export const collaboratorSchema = z.object({
  person_id: z.string().min(1, 'Selecciona una persona'),
  area: z.string().optional(),
})

export type CreateCollaboratorDTO = z.infer<typeof collaboratorSchema>
export type UpdateCollaboratorDTO = Partial<CreateCollaboratorDTO>

export interface CollaboratorsPagedParams {
  eventId: string
  page: number
  pageSize: number
}
