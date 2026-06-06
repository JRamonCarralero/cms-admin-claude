import { clsx } from 'clsx'
import { useToastStore } from '@/store/toastStore'

const VARIANT_STYLES = {
  success: 'border-green-300 bg-green-50 text-green-800',
  error: 'border-red-300 bg-red-50 text-red-800',
  info: 'border-blue-300 bg-blue-50 text-blue-800',
}

const VARIANT_ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}

export function ToastContainer() {
  const { toasts, remove } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      role="log"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'flex min-w-64 max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-md',
            'animate-in slide-in-from-right-4 fade-in duration-200',
            VARIANT_STYLES[t.variant],
          )}
          role="status"
        >
          <span className="mt-0.5 shrink-0 font-bold" aria-hidden="true">
            {VARIANT_ICONS[t.variant]}
          </span>
          <p className="flex-1 text-sm">{t.message}</p>
          <button
            onClick={() => remove(t.id)}
            aria-label="Cerrar notificación"
            className="ml-1 shrink-0 opacity-60 transition-opacity hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
