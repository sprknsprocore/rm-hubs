import { Users } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'

interface WorkforceCountCardProps {
  data: { planned: number; actual: number }
  onExpand?: (insightId: string) => void
}

export default function WorkforceCountCard({ data, onExpand }: WorkforceCountCardProps) {
  const delta = data.actual - data.planned
  const pct = Math.round((data.actual / data.planned) * 100)
  const isShort = data.actual < data.planned

  const signal = (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        {/* Actual */}
        <div className="flex flex-col items-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: isShort ? 'var(--figma-chart-exception-light)' : 'var(--figma-success-light)',
              color: isShort ? 'var(--figma-chart-exception)' : 'var(--figma-success)',
            }}
          >
            <span className="text-2xl font-bold tabular-nums">{data.actual}</span>
          </div>
          <span className="mt-1.5 text-[11px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
            Actual
          </span>
        </div>

        {/* Divider */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-[13px] font-bold tabular-nums"
            style={{ color: isShort ? 'var(--figma-chart-exception)' : 'var(--figma-success)' }}
          >
            {delta > 0 ? '+' : ''}{delta}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--figma-text-tertiary)' }}>
            variance
          </span>
        </div>

        {/* Planned */}
        <div className="flex flex-col items-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: 'var(--figma-bg-depth2)', color: 'var(--figma-text-primary)' }}
          >
            <span className="text-2xl font-bold tabular-nums">{data.planned}</span>
          </div>
          <span className="mt-1.5 text-[11px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
            Planned
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[240px]">
        <div className="relative h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{
              width: `${Math.min(pct, 100)}%`,
              backgroundColor: isShort ? 'var(--figma-chart-exception)' : 'var(--figma-success)',
            }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px]" style={{ color: 'var(--figma-text-tertiary)' }}>0</span>
          <span className="text-[10px] font-medium tabular-nums" style={{ color: 'var(--figma-text-secondary)' }}>
            {pct}% staffed
          </span>
          <span className="text-[10px] tabular-nums" style={{ color: 'var(--figma-text-tertiary)' }}>{data.planned}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5" style={{ color: 'var(--figma-text-secondary)' }}>
        <Users className="h-4 w-4" />
        <span className="text-[12px]">Daily headcount vs. planned manpower</span>
      </div>
    </div>
  )

  const context = (
    <span>
      {isShort
        ? `${Math.abs(delta)} workers short of planned manpower. Labor shortfall may impact schedule.`
        : 'Workforce is at or above planned manpower levels.'}
    </span>
  )

  return (
    <ActionableInsightCard
      title="Total Workforce Count"
      signal={signal}
      context={context}
      kickoff={{ label: 'Request Crew', onClick: () => onExpand?.('workforce-count') }}
      kickoffPriority={isShort ? 'p1' : 'p2'}
      onInsightExpand={onExpand ? () => onExpand('workforce-count') : undefined}
    />
  )
}
