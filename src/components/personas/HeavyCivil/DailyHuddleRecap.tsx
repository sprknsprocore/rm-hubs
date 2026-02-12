import type { DailyHuddleRecap as DailyHuddleRecapType } from '../../../types/lem'

interface DailyHuddleRecapProps {
  recap: DailyHuddleRecapType
}

export default function DailyHuddleRecap({ recap }: DailyHuddleRecapProps) {
  const { achievedQuantities, goalQuantities, date } = recap
  const keys = Array.from(new Set([...Object.keys(achievedQuantities), ...Object.keys(goalQuantities)]))
  const displayDate = new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div
      className="rounded-lg border px-4 py-3"
      style={{
        borderColor: 'var(--figma-bg-outline)',
        backgroundColor: 'var(--figma-bg-depth2)',
      }}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--figma-text-secondary)' }}>
        Daily Huddle Recap · {displayDate}
      </h3>
      <p className="mt-1 text-xs" style={{ color: 'var(--figma-text-secondary)' }}>
        Achieved vs Goal quantities (previous day)
      </p>
      <dl className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {keys.map((key) => {
          const achieved = achievedQuantities[key] ?? 0
          const goal = goalQuantities[key] ?? 0
          const met = goal <= 0 || achieved >= goal
          return (
            <div key={key} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5" style={{ backgroundColor: 'var(--figma-bg-default)' }}>
              <dt className="text-sm font-medium" style={{ color: 'var(--figma-text-primary)' }}>{key}</dt>
              <dd className="flex items-center gap-2 text-sm tabular-nums">
                <span style={{ color: met ? 'var(--figma-success)' : 'var(--figma-error)' }}>
                  {achieved.toLocaleString()}
                </span>
                <span style={{ color: 'var(--figma-text-disabled)' }}>/</span>
                <span style={{ color: 'var(--figma-text-secondary)' }}>{goal.toLocaleString()}</span>
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
