import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { CycleTimeData } from '../../../hooks/useHubData'

interface CycleTimeCardProps {
  data: CycleTimeData
}

export default function CycleTimeCard({ data }: CycleTimeCardProps) {
  const pct = Math.round((data.actualCyclesPerDay / data.bidCyclesPerDay) * 100)
  const belowBid = data.actualCyclesPerDay < data.bidCyclesPerDay

  const signal = (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
          {data.actualCyclesPerDay}
        </span>
        <span className="text-[13px]" style={{ color: 'var(--figma-text-secondary)' }}>
          of {data.bidCyclesPerDay} bid cycles/day
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span
            className="text-[11px] font-semibold"
            style={{ color: belowBid ? 'var(--figma-chart-exception)' : 'var(--figma-success)' }}
          >
            {pct}%
          </span>
          <span className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
            {belowBid ? 'Below bid' : 'On or above bid'}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(pct, 100)}%`,
              backgroundColor: belowBid ? 'var(--figma-chart-exception)' : 'var(--figma-success)',
            }}
          />
        </div>
      </div>

      {belowBid && (
        <p className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
          Haul trucks moving slower than estimated.
        </p>
      )}

      {data.context && (
        <p className="text-[11px] italic" style={{ color: 'var(--figma-text-tertiary, var(--figma-text-secondary))' }}>
          {data.context}
        </p>
      )}
    </div>
  )

  const context = (
    <span>Compares actual haul cycles per day against the bid estimate. Below-bid performance directly impacts earthwork unit costs.</span>
  )

  return (
    <ActionableInsightCard
      title="Cycle Time"
      signal={signal}
      context={context}
      kickoff={{ label: 'Reconcile Load Counts', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
