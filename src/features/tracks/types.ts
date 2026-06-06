import { z } from 'zod'

export const trackSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  event_date: z.string().min(1, 'La fecha es obligatoria'),
})

export type CreateTrackDTO = z.infer<typeof trackSchema>
export type UpdateTrackDTO = Partial<CreateTrackDTO>

export interface TracksPagedParams {
  eventId: string
  page: number
  pageSize: number
}
