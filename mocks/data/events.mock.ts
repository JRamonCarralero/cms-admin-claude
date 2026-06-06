import type { EventResponse } from '@/types/api'

export const mockEvents: EventResponse[] = [
  {
    id: 'a1b2c3d4-0001-0001-0001-000000000001',
    name: 'GDG Aranjuez DevFest 2024',
    slug: 'gdg-aranjuez-devfest-2024',
    is_active: true,
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T12:00:00Z',
  },
  {
    id: 'a1b2c3d4-0002-0002-0002-000000000002',
    name: 'GDG Aranjuez Cloud Summit',
    slug: 'gdg-aranjuez-cloud-summit',
    is_active: true,
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-10T09:00:00Z',
  },
  {
    id: 'a1b2c3d4-0003-0003-0003-000000000003',
    name: 'GDG Aranjuez AI Workshop',
    slug: 'gdg-aranjuez-ai-workshop',
    is_active: false,
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2023-11-05T08:00:00Z',
    updated_at: '2023-12-01T11:00:00Z',
  },
  {
    id: 'a1b2c3d4-0004-0004-0004-000000000004',
    name: 'GDG Aranjuez Flutter Day',
    slug: 'gdg-aranjuez-flutter-day',
    is_active: false,
    created_by: 'user-001',
    updated_by: 'user-001',
    created_at: '2023-06-20T10:00:00Z',
    updated_at: '2023-07-01T15:00:00Z',
  },
]
