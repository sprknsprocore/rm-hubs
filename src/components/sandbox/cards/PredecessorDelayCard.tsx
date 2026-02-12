import { GitBranch } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { PredecessorDelayData } from '../../../hooks/useHubData'

interface PredecessorDelayCardProps {
  data: PredecessorDelayData
}

export default function PredecessorDelayCard({ data }: PredecessorDelayCardProps) {
  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'var(--figma-chart-exception-light)', color: 'var(--figma-chart-exception)' }}
        >
          <GitBranch className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-bold" style={{ color: 'var(--figma-chart-exception)' }}>
            {data.delayDays}-Day Slip
          </p>
          <p className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
            Milestone predecessor delay
          </p>
        </div>
      </div>
      <div
        className="rounded-lg px-3 py-2.5"
        style={{ backgroundColor: 'var(--figma-chart-exception-light)', borderLeft: '3px solid var(--figma-chart-exception)' }}
      >
        <p className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
          <strong>{data.taskName}</strong> at risk due to <strong>{data.predecessorName}</strong> delay
        </p>
        <p className="mt-1 text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
          Impacted trade: {data.impactedTrade}
        </p>
      </div>
    </div>
  )

  const context = (
    <span>
      Critical predecessor task is behind schedule. {data.taskName} cannot start until {data.predecessorName} is complete.
    </span>
  )

  return (
    <ActionableInsightCard
      title="Predecessor Delay (Milestone Slip)"
      signal={signal}
      context={context}
      kickoff={{ label: 'Escalate to GC', onClick: () => {} }}
      kickoffPriority="p1"
    />
  )
}
