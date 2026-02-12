import { Calendar } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { MilestoneBufferItem } from '../../../hooks/useHubData'

interface MilestoneBufferCardProps {
  data: MilestoneBufferItem[]
}

export default function MilestoneBufferCard({ data }: MilestoneBufferCardProps) {
  const criticalCount = data.filter((m) => m.daysUntil <= 5).length

  const signal = (
    <div className="flex flex-col gap-3">
      {criticalCount > 0 && (
        <div
          className="rounded-lg px-3 py-2 text-[12px] font-medium"
          style={{ backgroundColor: 'var(--figma-error-light)', color: 'var(--figma-error)' }}
        >
          {criticalCount} milestone(s) with &le;5 days buffer
        </div>
      )}
      <ul className="space-y-2">
        {data.map((item) => {
          const isCritical = item.daysUntil <= 5
          return (
            <li
              key={item.milestoneName}
              className="flex items-center justify-between rounded-lg border px-3 py-2.5"
              style={{
                borderColor: 'var(--figma-bg-outline)',
                backgroundColor: 'var(--figma-bg-depth2)',
              }}
            >
              <div>
                <p className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                  {item.milestoneName}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
                  After {item.predecessorName}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" style={{ color: isCritical ? 'var(--figma-error)' : 'var(--figma-text-secondary)' }} />
                <span
                  className="text-[13px] font-bold tabular-nums"
                  style={{ color: isCritical ? 'var(--figma-error)' : 'var(--figma-text-primary)' }}
                >
                  {item.daysUntil}d
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )

  const context = (
    <span>Days of buffer between predecessor completion and milestone start. Low buffer milestones are at highest risk of cascade delay.</span>
  )

  return (
    <ActionableInsightCard
      title="Milestone Buffer"
      signal={signal}
      context={context}
      kickoff={{ label: 'View Schedule', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
