import { z } from 'zod'

const urlOrEmpty = z.string().url('Debe ser una URL válida').or(z.literal('')).optional()

export const personSchema = z.object({
  first_name: z.string().min(1, 'El nombre es obligatorio'),
  last_name: z.string().min(1, 'Los apellidos son obligatorios'),
  email: z.string().email('Email no válido').or(z.literal('')).optional(),
  avatar_url: urlOrEmpty,
  github_user: z.string().optional(),
  linkedin_url: urlOrEmpty,
  twitter_url: urlOrEmpty,
  website_url: urlOrEmpty,
})

export type CreatePersonDTO = z.infer<typeof personSchema>
export type UpdatePersonDTO = Partial<CreatePersonDTO>

export interface PersonsPagedParams {
  page: number
  pageSize: number
  search?: string
}
