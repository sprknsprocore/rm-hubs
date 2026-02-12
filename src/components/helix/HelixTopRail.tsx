import { useState } from 'react'
import { Search, Bell, Zap, LayoutGrid, Folder, Pencil, Link2 } from 'lucide-react'

const SEARCH_PLACEHOLDER = 'Search all my projects or ask a question...'

export default function HelixTopRail() {
  const [query, setQuery] = useState('')

  return (
    <header
      className="sticky top-0 z-30 border-b"
      style={{
        height: 'var(--helix-top-height)',
        backgroundColor: 'var(--helix-bg-card)',
        borderColor: 'var(--helix-border-divider)',
      }}
    >
      <div className="flex h-full flex-wrap items-center gap-3 px-4 md:gap-4">
        <div className="flex flex-1 items-center gap-2 md:flex-none">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--helix-text-secondary)' }}
          >
            Hi, Jim Sullivan
          </span>
        </div>
        <div className="order-3 flex h-full w-full flex-col justify-center gap-2 py-2 md:order-2 md:flex-[2] md:py-3">
          <div className="flex max-w-xl flex-1 flex-col gap-2 self-center">
            <div className="flex items-center justify-center">
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: 'var(--helix-text-primary)' }}
              >
                PROCORE
              </span>
            </div>
            <div className="relative flex items-center">
              <Search
                className="absolute left-3 h-4 w-4"
                style={{ color: 'var(--helix-text-muted)' }}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={SEARCH_PLACEHOLDER}
                className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--helix-bg-input)',
                  borderColor: 'var(--helix-border-card)',
                  color: 'var(--helix-text-primary)',
                }}
                aria-label="Search"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--helix-bg-cta-pill)',
                  color: 'var(--helix-primary)',
                }}
              >
                <Zap className="h-4 w-4" />
                Generate portfolio forecast
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--helix-bg-cta-pill)',
                  color: 'var(--helix-primary)',
                }}
              >
                <Zap className="h-4 w-4" />
                Generate key metrics
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-1 md:flex-none">
          {[Bell, Search, LayoutGrid, Folder, Pencil, Link2].map((Icon, i) => (
            <button
              key={i}
              type="button"
              className="rounded-lg p-2"
              style={{ color: 'var(--helix-text-secondary)' }}
              aria-label={Icon.name}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
