import { useMemo } from 'react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { ProjectData } from '../../../types/lem'

interface CycleTimeCardProps {
  projectData: ProjectData
  onReconcileLoadCounts: () => void
}

export default function CycleTimeCard({ projectData, onReconcileLoadCounts }: CycleTimeCardProps) {
  const cycleTime = projectData.cycleTime
  const signal = useMemo(() => {
    if (!cycleTime) return <p className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>No cycle time data for this project.</p>
    const { actualCyclesPerDay, bidCyclesPerDay, context } = cycleTime
    const pct = bidCyclesPerDay > 0 ? Math.min(100, Math.round((actualCyclesPerDay / bidCyclesPerDay) * 100)) : 0
    const isBehind = actualCyclesPerDay < bidCyclesPerDay
    const barColor = isBehind ? 'var(--figma-chart-exception)' : 'var(--figma-success)'
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {/* Actual vs bid bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-end justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="tabular-nums text-[22px] font-semibold tracking-tight" style={{ color: 'var(--figma-text-primary)' }}>
                {actualCyclesPerDay}
              </span>
              <span className="text-[12px] font-medium" style={{ color: 'var(--figma-text-tertiary)' }}>
                of {bidCyclesPerDay} bid
              </span>
            </div>
            <span
              className="tabular-nums text-[13px] font-semibold"
              style={{ color: isBehind ? barColor : 'var(--figma-text-secondary)' }}
            >
              {pct}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
        </div>
        {/* Status + context */}
        <div className="flex flex-col gap-0.5">
          <p className="text-[11px] font-medium" style={{ color: isBehind ? barColor : 'var(--figma-text-secondary)' }}>
            {isBehind ? 'Below bid · Haul trucks moving slower than estimated.' : 'On or above bid.'}
          </p>
          {context && (
            <p className="text-[11px] leading-snug" style={{ color: 'var(--figma-text-tertiary)' }}>{context}</p>
          )}
        </div>
      </div>
    )
  }, [cycleTime])

  const context = cycleTime
    ? 'Compare field load counts to the bid to reconcile cycle time.'
    : 'Cycle time not available for this project.'

  return (
    <ActionableInsightCard
      title="Cycle Time"
      signal={signal}
      context={context}
      kickoff={{
        label: 'Reconcile Load Counts',
        onClick: onReconcileLoadCounts,
      }}
      kickoffPriority="p2"
    />
  )
}
