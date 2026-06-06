import type { SponsorResponse } from '@/types/api'
import { EVENT_ID_1 } from './collaborators.mock'

export { EVENT_ID_1 }

export const mockSponsors: SponsorResponse[] = [
  {
    id: 'spo-0001-0000-0000-0000-000000000001',
    event_id: EVENT_ID_1,
    name: 'Google',
    logo_url: 'https://logo.clearbit.com/google.com',
    website_url: 'https://google.com',
    tier: 'gold',
    order_priority: 1,
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z',
  },
  {
    id: 'spo-0002-0000-0000-0000-000000000002',
    event_id: EVENT_ID_1,
    name: 'Microsoft',
    logo_url: 'https://logo.clearbit.com/microsoft.com',
    website_url: 'https://microsoft.com',
    tier: 'silver',
    order_priority: 2,
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-02-11T10:00:00Z',
    updated_at: '2024-02-11T10:00:00Z',
  },
  {
    id: 'spo-0003-0000-0000-0000-000000000003',
    event_id: EVENT_ID_1,
    name: 'JetBrains',
    logo_url: 'https://logo.clearbit.com/jetbrains.com',
    website_url: 'https://jetbrains.com',
    tier: 'bronze',
    order_priority: 3,
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-02-12T10:00:00Z',
    updated_at: '2024-02-12T10:00:00Z',
  },
]
