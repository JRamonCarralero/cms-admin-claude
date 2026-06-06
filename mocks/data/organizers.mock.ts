import type { OrganizerDetailResponse } from '@/types/api'
import { EVENT_ID_1 } from './collaborators.mock'

export { EVENT_ID_1 }

export const mockOrganizers: OrganizerDetailResponse[] = [
  {
    id: 'org-0001-0000-0000-0000-000000000001',
    person_id: 'p0000001-0000-0000-0000-000000000001',
    event_id: EVENT_ID_1,
    company: 'GDG Aranjuez',
    role_description: 'Lead Organizer',
    first_name: 'Ana',
    last_name: 'García López',
    email: 'ana.garcia@gdg-aranjuez.com',
    avatar_url: 'https://i.pravatar.cc/150?u=ana',
    github_user: 'anagarcia',
    linkedin_url: 'https://linkedin.com/in/anagarcia',
    twitter_url: '',
    website_url: '',
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'org-0002-0000-0000-0000-000000000002',
    person_id: 'p0000005-0000-0000-0000-000000000005',
    event_id: EVENT_ID_1,
    company: 'GDG Aranjuez',
    role_description: 'Co-Organizer',
    first_name: 'María',
    last_name: 'Jiménez Castro',
    email: 'maria.jimenez@gdg-aranjuez.com',
    avatar_url: 'https://i.pravatar.cc/150?u=maria',
    github_user: 'mariajc',
    linkedin_url: 'https://linkedin.com/in/mariajc',
    twitter_url: 'https://twitter.com/mariajc',
    website_url: 'https://mariajc.dev',
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
]
