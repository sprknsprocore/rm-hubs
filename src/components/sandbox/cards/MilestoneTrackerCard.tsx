import { CheckCircle, AlertCircle } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { MilestoneItem } from '../../../hooks/useHubData'

interface MilestoneTrackerCardProps {
  data: MilestoneItem[]
}

export default function MilestoneTrackerCard({ data }: MilestoneTrackerCardProps) {
  const atRiskCount = data.filter((m) => m.status === 'at_risk' || m.status === 'delayed').length

  const signal = (
    <div className="flex flex-col gap-3">
      {atRiskCount > 0 && (
        <div
          className="rounded-lg px-3 py-2 text-[12px] font-medium"
          style={{ backgroundColor: 'var(--figma-error-light)', color: 'var(--figma-error)' }}
        >
          {atRiskCount} milestone(s) at risk or delayed
        </div>
      )}
      <ul className="space-y-2">
        {data.map((ms) => {
          const isOk = ms.status === 'on_track'
          const Icon = isOk ? CheckCircle : AlertCircle
          return (
            <li
              key={ms.id}
              className="flex items-start gap-2.5 rounded-lg border px-3 py-2.5"
              style={{ borderColor: 'var(--figma-bg-outline)', backgroundColor: 'var(--figma-bg-depth2)' }}
            >
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: isOk ? 'var(--figma-success)' : 'var(--figma-primary-main)' }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                  {ms.name}
                </p>
                {ms.predecessorDelay && (
                  <p className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
                    {ms.predecessorDelay}
                  </p>
                )}
                {ms.atRiskReason && (
                  <p className="text-[11px]" style={{ color: 'var(--figma-error)' }}>
                    {ms.atRiskReason}
                  </p>
                )}
              </div>
              <span
                className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold capitalize"
                style={{
                  backgroundColor: isOk ? 'var(--figma-success-light, rgba(34,197,94,0.12))' : 'var(--figma-error-light)',
                  color: isOk ? 'var(--figma-success)' : 'var(--figma-error)',
                }}
              >
                {ms.status.replace('_', ' ')}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )

  const context = (
    <span>Status of all major project milestones. At-risk or delayed milestones need immediate schedule intervention.</span>
  )

  return (
    <ActionableInsightCard
      title="Milestone Tracker"
      signal={signal}
      context={context}
      kickoff={{ label: 'View Schedule', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
