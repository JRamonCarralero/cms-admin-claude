import { z } from 'zod'

export const speakerSchema = z.object({
  person_id: z.string().min(1, 'Selecciona una persona'),
  bio: z.string().optional(),
  company: z.string().optional(),
})

export type CreateSpeakerDTO = z.infer<typeof speakerSchema>
export type UpdateSpeakerDTO = Partial<CreateSpeakerDTO>

export interface SpeakersPagedParams {
  eventId: string
  page: number
  pageSize: number
}
