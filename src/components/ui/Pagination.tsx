import { clsx } from 'clsx'
import type { PagedMeta } from '@/types/api'

interface PaginationProps {
  meta: PagedMeta
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

export function Pagination({
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}: PaginationProps) {
  const { total, page, pageSize } = meta
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const pages = buildPageRange(page, totalPages)

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col items-center justify-between gap-3 px-1 py-3 sm:flex-row"
    >
      {/* Resumen */}
      <p className="text-sm text-gray-600">
        {total === 0 ? 'Sin resultados' : `${from}–${to} de ${total}`}
      </p>

      <div className="flex items-center gap-3">
        {/* Selector de tamaño de página */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="text-sm text-gray-600">
              Por página
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value))
                onPageChange(1)
              }}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botones de página */}
        <div className="flex items-center gap-1">
          <PageButton
            aria-label="Página anterior"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            ‹
          </PageButton>

          {pages.map((p, i) =>
            p === '…' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                …
              </span>
            ) : (
              <PageButton
                key={p}
                aria-label={`Página ${p}`}
                aria-current={p === page ? 'page' : undefined}
                active={p === page}
                onClick={() => onPageChange(p as number)}
              >
                {p}
              </PageButton>
            ),
          )}

          <PageButton
            aria-label="Página siguiente"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            ›
          </PageButton>
        </div>
      </div>
    </nav>
  )
}

interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

function PageButton({ active, children, className, ...props }: PageButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        active
          ? 'bg-blue-600 font-semibold text-white'
          : 'text-gray-700 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}
