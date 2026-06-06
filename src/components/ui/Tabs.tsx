import { useState } from 'react'
import { clsx } from 'clsx'

export interface TabItem {
  key: string
  label: string
  badge?: number | null
  content: React.ReactNode
}

interface TabsProps {
  items: TabItem[]
  defaultKey?: string
}

export function Tabs({ items, defaultKey }: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultKey ?? items[0]?.key ?? '')
  // Track which tabs have been visited to keep them mounted (preserves state/cache)
  const [visited, setVisited] = useState<Set<string>>(
    () => new Set([defaultKey ?? items[0]?.key ?? '']),
  )

  function activate(key: string) {
    setActiveKey(key)
    setVisited((prev) => {
      if (prev.has(key)) return prev
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Secciones del evento"
        className="flex gap-0 overflow-x-auto border-b border-gray-200"
      >
        {items.map((item) => (
          <button
            key={item.key}
            role="tab"
            aria-selected={activeKey === item.key}
            aria-controls={`tabpanel-${item.key}`}
            id={`tab-${item.key}`}
            onClick={() => activate(item.key)}
            className={clsx(
              'flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              activeKey === item.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            )}
          >
            {item.label}
            {item.badge != null && (
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-xs font-semibold',
                  activeKey === item.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600',
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {items.map((item) => (
        <div
          key={item.key}
          role="tabpanel"
          id={`tabpanel-${item.key}`}
          aria-labelledby={`tab-${item.key}`}
          hidden={activeKey !== item.key}
          className="pt-4"
        >
          {visited.has(item.key) && item.content}
        </div>
      ))}
    </div>
  )
}
