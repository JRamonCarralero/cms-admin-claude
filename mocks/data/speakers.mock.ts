import type { SpeakerDetailResponse } from '@/types/api'
import { EVENT_ID_1 } from './collaborators.mock'

export { EVENT_ID_1 }

export const mockSpeakers: SpeakerDetailResponse[] = [
  {
    id: 'spk-0001-0000-0000-0000-000000000001',
    person_id: 'p0000005-0000-0000-0000-000000000005',
    event_id: EVENT_ID_1,
    bio: 'Full stack developer con más de 10 años de experiencia en proyectos cloud.',
    company: 'Google',
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
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 'spk-0002-0000-0000-0000-000000000002',
    person_id: 'p0000002-0000-0000-0000-000000000002',
    event_id: EVENT_ID_1,
    bio: 'Experto en arquitecturas backend y microservicios.',
    company: 'Microsoft',
    first_name: 'Carlos',
    last_name: 'Martínez Ruiz',
    email: 'carlos.martinez@gdg-aranjuez.com',
    avatar_url: '',
    github_user: 'carlosmr',
    linkedin_url: '',
    twitter_url: 'https://twitter.com/carlosmr',
    website_url: 'https://carlosmartinez.dev',
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-03-02T10:00:00Z',
    updated_at: '2024-03-02T10:00:00Z',
  },
]
