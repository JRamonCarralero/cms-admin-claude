import { clsx } from 'clsx'

interface AvatarProps {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function initials(alt: string): string {
  return alt
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const sizeClass = clsx(
    size === 'sm' && 'h-8 w-8 text-xs',
    size === 'md' && 'h-10 w-10 text-sm',
    size === 'lg' && 'h-12 w-12 text-base',
  )

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={clsx('rounded-full object-cover', sizeClass, className)}
      />
    )
  }

  return (
    <span
      aria-label={alt}
      className={clsx(
        'inline-flex items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700',
        sizeClass,
        className,
      )}
    >
      {initials(alt)}
    </span>
  )
}
