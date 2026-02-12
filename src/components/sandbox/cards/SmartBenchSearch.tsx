import { useState, useMemo } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { BenchWorker } from '../../../hooks/useHubData'

interface SmartBenchSearchProps {
  data: BenchWorker[]
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function SmartBenchSearch({ data }: SmartBenchSearchProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.role.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [data, query])

  // Collect all unique tags for tag cloud
  const allTags = useMemo(() => {
    const set = new Set<string>()
    data.forEach((w) => w.tags.forEach((t) => set.add(t)))
    return Array.from(set)
  }, [data])

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'var(--figma-primary-selected)', color: 'var(--figma-primary-main)' }}
        >
          <span className="text-lg font-bold tabular-nums">{data.length}</span>
        </div>
        <span className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
          unassigned workers on bench
        </span>
      </div>

      {/* Search bar */}
      <div
        className="flex items-center gap-2 rounded-lg border px-3 py-2"
        style={{
          borderColor: 'var(--figma-bg-outline)',
          backgroundColor: 'var(--figma-bg-depth2)',
        }}
      >
        <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-text-tertiary)' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, role, or tag..."
          className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--figma-text-disabled)]"
          style={{ color: 'var(--figma-text-primary)' }}
        />
      </div>

      {/* Tag cloud */}
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setQuery(tag)}
            className="rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors hover:opacity-80"
            style={{
              backgroundColor: query.toLowerCase() === tag.toLowerCase() ? 'var(--figma-primary-selected)' : 'var(--figma-bg-default)',
              color: query.toLowerCase() === tag.toLowerCase() ? 'var(--figma-primary-main)' : 'var(--figma-text-secondary)',
              border: '1px solid var(--figma-bg-outline)',
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )

  const context = (
    <ul className="space-y-2">
      {filtered.map((w) => (
        <li
          key={w.id}
          className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
          style={{
            borderColor: 'var(--figma-bg-outline)',
            backgroundColor: 'var(--figma-bg-depth2)',
          }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: 'var(--figma-primary-main)' }}
          >
            {initials(w.name)}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
              {w.name}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
              {w.role}
              {w.allocation > 0 && ` · ${Math.round(w.allocation * 100)}% allocated`}
            </span>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-text-tertiary)' }} />
        </li>
      ))}
      {filtered.length === 0 && (
        <li className="py-4 text-center text-[13px]" style={{ color: 'var(--figma-text-tertiary)' }}>
          No matches found
        </li>
      )}
    </ul>
  )

  return (
    <ActionableInsightCard
      title="Smart Bench"
      signal={signal}
      context={context}
      kickoff={{ label: 'Dispatch', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
