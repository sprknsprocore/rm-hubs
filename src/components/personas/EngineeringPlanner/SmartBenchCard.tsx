import { ArrowRight } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { BenchEmployee } from '../../../types/lem'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface SmartBenchCardProps {
  employees: BenchEmployee[]
}

export default function SmartBenchCard({ employees }: SmartBenchCardProps) {
  const count = employees.length
  const signal = (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: 'var(--figma-primary-selected)',
            color: 'var(--figma-primary-main)',
          }}
        >
          <span className="text-2xl font-bold tabular-nums tracking-tight">{count}</span>
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span
            className="rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: 'var(--figma-bg-depth2)',
              color: 'var(--figma-text-secondary)',
              width: 'fit-content',
            }}
          >
            unassigned
          </span>
          <span className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
            {count === 1 ? '1 person' : `${count} people`} on bench
          </span>
        </div>
      </div>
    </div>
  )

  const context = (
    <ul className="space-y-2">
      {employees.map((emp) => (
        <li
          key={emp.id}
          className="flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:border-[var(--figma-primary-main)]/20"
          style={{
            borderColor: 'var(--figma-bg-outline)',
            backgroundColor: 'var(--figma-bg-depth2)',
          }}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'var(--figma-primary-main)',
              color: 'white',
            }}
          >
            {initials(emp.name)}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block truncate font-medium" style={{ color: 'var(--figma-text-primary)' }}>
              {emp.name}
            </span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {emp.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    backgroundColor: 'var(--figma-bg-default)',
                    color: 'var(--figma-text-secondary)',
                    border: '1px solid var(--figma-bg-outline)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {emp.matchedToRequest && (
            <span
              className="flex shrink-0 items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--figma-success)' }}
            >
              <ArrowRight className="h-3.5 w-3.5" />
              {emp.matchedToRequest}
            </span>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <ActionableInsightCard
      title="Smart Bench"
      signal={signal}
      context={context}
      kickoff={{ label: 'Bulk Assign from Smart Bench', onClick: () => window.history.pushState({}, '', '/workflow/bulk-assign') }}
      kickoffPriority="p2"
    />
  )
}
