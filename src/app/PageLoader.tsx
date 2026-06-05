import { Spinner } from '@/components/ui/Spinner'

export function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Spinner size="lg" />
    </div>
  )
}
