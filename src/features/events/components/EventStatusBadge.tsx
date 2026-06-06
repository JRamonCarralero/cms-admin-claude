import { Badge } from '@/components/ui/Badge'

interface EventStatusBadgeProps {
  isActive: boolean
}

export function EventStatusBadge({ isActive }: EventStatusBadgeProps) {
  return (
    <Badge variant={isActive ? 'success' : 'default'}>{isActive ? 'Activo' : 'Inactivo'}</Badge>
  )
}
