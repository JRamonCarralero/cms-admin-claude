import type { DeveloperDetailResponse } from '@/types/api'
import { EVENT_ID_1 } from './collaborators.mock'

export { EVENT_ID_1 }

export const mockDevelopers: DeveloperDetailResponse[] = [
  {
    id: 'dev-0001-0000-0000-0000-000000000001',
    person_id: 'p0000003-0000-0000-0000-000000000003',
    event_id: EVENT_ID_1,
    role_description: 'Mobile Developer',
    first_name: 'Laura',
    last_name: 'Sánchez Vega',
    email: 'laura.sanchez@gdg-aranjuez.com',
    avatar_url: 'https://i.pravatar.cc/150?u=laura',
    github_user: '',
    linkedin_url: 'https://linkedin.com/in/laurasanchez',
    twitter_url: '',
    website_url: '',
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-02-05T10:00:00Z',
    updated_at: '2024-02-05T10:00:00Z',
  },
  {
    id: 'dev-0002-0000-0000-0000-000000000002',
    person_id: 'p0000004-0000-0000-0000-000000000004',
    event_id: EVENT_ID_1,
    role_description: 'DevOps Engineer',
    first_name: 'David',
    last_name: 'Torres Fernández',
    email: 'david.torres@gmail.com',
    avatar_url: '',
    github_user: 'davidtf',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-02-06T10:00:00Z',
    updated_at: '2024-02-06T10:00:00Z',
  },
]
