import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { DailyHuddleRecapData } from '../../../hooks/useHubData'

interface DailyHuddleRecapCardProps {
  data: DailyHuddleRecapData
  onExpand?: (insightId: string) => void
}

export default function DailyHuddleRecapCard({ data, onExpand }: DailyHuddleRecapCardProps) {
  const dateLabel = new Date(data.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const metrics = Object.keys(data.goalQuantities)

  const signal = (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
        Daily Huddle Recap &middot; {dateLabel}
      </p>
      <div className="space-y-2">
        {metrics.map((metric) => {
          const achieved = data.achievedQuantities[metric] ?? 0
          const goal = data.goalQuantities[metric] ?? 1
          const pct = Math.round((achieved / goal) * 100)
          const hit = achieved >= goal
          return (
            <div
              key={metric}
              className="flex items-center justify-between rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--figma-bg-outline)', backgroundColor: 'var(--figma-bg-depth2)' }}
            >
              <span className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                {metric}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="text-[13px] font-bold tabular-nums"
                  style={{ color: hit ? 'var(--figma-success)' : 'var(--figma-error)' }}
                >
                  {achieved.toLocaleString()}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--figma-text-disabled)' }}>
                  / {goal.toLocaleString()}
                </span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: hit ? 'var(--figma-success-light, rgba(34,197,94,0.12))' : 'var(--figma-error-light)',
                    color: hit ? 'var(--figma-success)' : 'var(--figma-error)',
                  }}
                >
                  {pct}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const context = (
    <span>Yesterday's achieved quantities vs. daily production goals. Green items met target; red items need attention today.</span>
  )

  return (
    <ActionableInsightCard
      title="Daily Huddle Recap"
      signal={signal}
      context={context}
      kickoff={{ label: 'Update Goals', onClick: () => onExpand?.('daily-huddle') }}
      kickoffPriority="p2"
      onInsightExpand={onExpand ? () => onExpand('daily-huddle') : undefined}
    />
  )
}
